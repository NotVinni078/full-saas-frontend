
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BaileysConnectionRequest {
  action: 'create' | 'get_qr' | 'disconnect' | 'status'
  connectionId?: string
  name?: string
  sectors?: string[]
}

// Store active connections in memory
const activeConnections = new Map()

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, connectionId, name, sectors }: BaileysConnectionRequest = await req.json()

    switch (action) {
      case 'create': {
        if (!name) {
          return new Response(
            JSON.stringify({ error: 'Nome da conexão é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        try {
          // Criar nova conexão no banco de dados
          const { data: connection, error } = await supabase
            .from('tenant_baileys_connections')
            .insert({
              name,
              sectors: sectors || [],
              status: 'connecting'
            })
            .select()
            .single()

          if (error) {
            console.error('Erro ao criar conexão:', error)
            return new Response(
              JSON.stringify({ error: 'Erro ao criar conexão no banco' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          // Inicializar sessão Baileys
          const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = await import('https://esm.sh/@whiskeysockets/baileys@6.7.5')
          const QRCode = await import('https://esm.sh/qrcode@1.5.3')

          // Criar estado de auth temporário (em produção, usar storage persistente)
          const authState = await useMultiFileAuthState(`./auth_sessions/${connection.id}`)
          
          let qrCode = ''
          let isConnected = false

          const sock = makeWASocket({
            auth: authState.state,
            printQRInTerminal: false,
            browser: ['WhatsApp Business', 'Chrome', '1.0.0'],
            connectTimeoutMs: 30000,
            defaultQueryTimeoutMs: 30000,
          })

          // Armazenar conexão ativa
          activeConnections.set(connection.id, {
            socket: sock,
            authState,
            status: 'connecting'
          })

          // Event listeners
          sock.ev.on('creds.update', authState.saveCreds)

          sock.ev.on('connection.update', async (update) => {
            const { connection: connStatus, lastDisconnect, qr } = update

            if (qr) {
              try {
                qrCode = await QRCode.toDataURL(qr, {
                  width: 300,
                  margin: 2,
                  color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                  }
                })

                const expiresAt = new Date(Date.now() + 60000) // 60 segundos

                // Atualizar no banco
                await supabase
                  .from('tenant_baileys_connections')
                  .update({
                    qr_code: qrCode,
                    qr_expires_at: expiresAt.toISOString(),
                    status: 'waiting_scan'
                  })
                  .eq('id', connection.id)

                console.log(`QR Code gerado para conexão ${connection.id}`)
              } catch (qrError) {
                console.error('Erro ao gerar QR Code:', qrError)
              }
            }

            if (connStatus === 'close') {
              const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
              
              if (shouldReconnect) {
                console.log('Reconectando...')
                // Reconectar após 5 segundos
                setTimeout(() => {
                  activeConnections.delete(connection.id)
                }, 5000)
              } else {
                // Desconectado permanentemente
                await supabase
                  .from('tenant_baileys_connections')
                  .update({
                    status: 'disconnected',
                    qr_code: null,
                    qr_expires_at: null
                  })
                  .eq('id', connection.id)

                activeConnections.delete(connection.id)
              }
            } else if (connStatus === 'open') {
              // Conectado com sucesso
              isConnected = true
              const phoneNumber = sock.user?.id?.split(':')[0] || ''

              await supabase
                .from('tenant_baileys_connections')
                .update({
                  status: 'connected',
                  phone_number: phoneNumber,
                  last_activity_at: new Date().toISOString(),
                  qr_code: null,
                  qr_expires_at: null
                })
                .eq('id', connection.id)

              // Atualizar conexão ativa
              const activeConn = activeConnections.get(connection.id)
              if (activeConn) {
                activeConn.status = 'connected'
              }

              console.log(`WhatsApp conectado: ${phoneNumber}`)
            }
          })

          // Aguardar geração do QR Code inicial
          await new Promise(resolve => setTimeout(resolve, 3000))

          return new Response(
            JSON.stringify({
              connection_id: connection.id,
              qr_code: qrCode,
              expires_at: new Date(Date.now() + 60000).toISOString(),
              status: isConnected ? 'connected' : 'waiting_scan'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )

        } catch (baileysError) {
          console.error('Erro ao inicializar Baileys:', baileysError)
          return new Response(
            JSON.stringify({ error: 'Erro ao inicializar conexão WhatsApp' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }

      case 'get_qr': {
        if (!connectionId) {
          return new Response(
            JSON.stringify({ error: 'ID da conexão é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verificar se existe conexão ativa
        const activeConn = activeConnections.get(connectionId)
        
        if (!activeConn) {
          return new Response(
            JSON.stringify({ error: 'Conexão não encontrada ou inativa' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Buscar dados atuais do banco
        const { data: connection, error } = await supabase
          .from('tenant_baileys_connections')
          .select('*')
          .eq('id', connectionId)
          .single()

        if (error || !connection) {
          return new Response(
            JSON.stringify({ error: 'Conexão não encontrada no banco' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Se já conectado, retornar status
        if (connection.status === 'connected') {
          return new Response(
            JSON.stringify({
              status: 'connected',
              phone_number: connection.phone_number
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verificar se QR Code expirou
        const now = new Date()
        const expiresAt = connection.qr_expires_at ? new Date(connection.qr_expires_at) : null

        if (!expiresAt || now > expiresAt || !connection.qr_code) {
          // Solicitar novo QR Code
          try {
            if (activeConn.socket) {
              activeConn.socket.requestPairingCode = false
              // Força nova geração de QR
              activeConn.socket.ev.emit('connection.update', { qr: 'refresh' })
            }

            // Aguardar novo QR ser gerado
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Buscar QR atualizado
            const { data: updatedConnection } = await supabase
              .from('tenant_baileys_connections')
              .select('qr_code, qr_expires_at, status')
              .eq('id', connectionId)
              .single()

            return new Response(
              JSON.stringify({
                qr_code: updatedConnection?.qr_code,
                expires_at: updatedConnection?.qr_expires_at,
                status: updatedConnection?.status || 'waiting_scan'
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          } catch (refreshError) {
            console.error('Erro ao renovar QR Code:', refreshError)
            return new Response(
              JSON.stringify({ error: 'Erro ao renovar QR Code' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        }

        return new Response(
          JSON.stringify({
            qr_code: connection.qr_code,
            expires_at: connection.qr_expires_at,
            status: connection.status
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'disconnect': {
        if (!connectionId) {
          return new Response(
            JSON.stringify({ error: 'ID da conexão é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Desconectar socket ativo
        const activeConn = activeConnections.get(connectionId)
        if (activeConn && activeConn.socket) {
          try {
            await activeConn.socket.logout()
            activeConn.socket.end()
          } catch (disconnectError) {
            console.error('Erro ao desconectar socket:', disconnectError)
          }
          activeConnections.delete(connectionId)
        }

        // Atualizar banco
        const { error } = await supabase
          .from('tenant_baileys_connections')
          .update({
            status: 'disconnected',
            qr_code: null,
            qr_expires_at: null,
            phone_number: null,
            session_data: {}
          })
          .eq('id', connectionId)

        if (error) {
          return new Response(
            JSON.stringify({ error: 'Erro ao desconectar no banco' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'status': {
        if (!connectionId) {
          return new Response(
            JSON.stringify({ error: 'ID da conexão é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        const { data: connection, error } = await supabase
          .from('tenant_baileys_connections')
          .select('status, phone_number, last_activity_at')
          .eq('id', connectionId)
          .single()

        if (error || !connection) {
          return new Response(
            JSON.stringify({ error: 'Conexão não encontrada' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verificar se conexão está realmente ativa
        const activeConn = activeConnections.get(connectionId)
        const realStatus = activeConn ? 
          (activeConn.status === 'connected' ? 'connected' : connection.status) : 
          'disconnected'

        return new Response(
          JSON.stringify({
            status: realStatus,
            phone_number: connection.phone_number,
            last_activity_at: connection.last_activity_at
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Ação não reconhecida' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Erro no Edge Function:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
