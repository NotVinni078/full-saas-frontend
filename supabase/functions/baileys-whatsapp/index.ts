
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

// Store active Baileys sessions in memory
const activeSessions = new Map()

// Import Baileys with dynamic import for Deno compatibility
let makeWASocket: any
let DisconnectReason: any
let useMultiFileAuthState: any
let Browsers: any

const initializeBaileys = async () => {
  try {
    const baileys = await import("https://esm.sh/@whiskeysockets/baileys@latest")
    const qrcode = await import("https://esm.sh/qrcode@latest")
    
    makeWASocket = baileys.default
    DisconnectReason = baileys.DisconnectReason
    useMultiFileAuthState = baileys.useMultiFileAuthState
    Browsers = baileys.Browsers
    
    return { baileys, qrcode }
  } catch (error) {
    console.error('Erro ao importar Baileys:', error)
    throw error
  }
}

// Generate real QR Code using Baileys
const generateRealQRCode = async (connectionId: string): Promise<{ qrCode: string; socket: any } | null> => {
  try {
    const { baileys, qrcode } = await initializeBaileys()
    
    // Create a simple in-memory auth state for this demo
    const authState = {
      state: {
        creds: undefined,
        keys: {}
      },
      saveCreds: () => {},
      clearState: () => {}
    }
    
    // Create WhatsApp socket
    const socket = makeWASocket({
      auth: authState,
      printQRInTerminal: false,
      browser: Browsers.macOS('Desktop'),
      logger: {
        level: 'silent',
        fatal: () => {},
        error: () => {},
        warn: () => {},
        info: () => {},
        debug: () => {},
        trace: () => {}
      }
    })

    return new Promise((resolve) => {
      socket.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update
        
        if (qr) {
          try {
            // Generate QR code as data URL
            const qrCodeDataURL = await qrcode.default.toDataURL(qr, {
              width: 300,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            })
            
            console.log(`QR Code real gerado para conexão ${connectionId}`)
            
            // Store the socket for later use
            activeSessions.set(connectionId, {
              socket,
              status: 'waiting_scan',
              qr_code: qrCodeDataURL,
              created_at: new Date().toISOString()
            })
            
            resolve({
              qrCode: qrCodeDataURL,
              socket
            })
          } catch (qrError) {
            console.error('Erro ao gerar QR Code:', qrError)
            resolve(null)
          }
        }
        
        if (connection === 'open') {
          console.log(`Conexão WhatsApp estabelecida para ${connectionId}`)
          
          // Update session status
          const session = activeSessions.get(connectionId)
          if (session) {
            session.status = 'connected'
            session.phone_number = socket.user?.id?.split('@')[0] || 'unknown'
            activeSessions.set(connectionId, session)
          }
        }
        
        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
          console.log('Conexão fechada devido a:', lastDisconnect?.error, ', reconectando:', shouldReconnect)
          
          if (!shouldReconnect) {
            activeSessions.delete(connectionId)
          }
        }
      })
      
      // Timeout after 30 seconds if no QR is generated
      setTimeout(() => {
        if (!activeSessions.has(connectionId)) {
          socket.end()
          resolve(null)
        }
      }, 30000)
    })
  } catch (error) {
    console.error('Erro ao inicializar Baileys:', error)
    return null
  }
}

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

          // Generate real QR code with Baileys
          console.log(`Iniciando geração de QR Code real para conexão ${connection.id}`)
          const qrResult = await generateRealQRCode(connection.id)
          
          if (!qrResult) {
            throw new Error('Falha ao gerar QR Code com Baileys')
          }

          const expiresAt = new Date(Date.now() + 60000) // 60 segundos

          // Update database with real QR code
          await supabase
            .from('tenant_baileys_connections')
            .update({
              qr_code: qrResult.qrCode,
              qr_expires_at: expiresAt.toISOString(),
              status: 'waiting_scan'
            })
            .eq('id', connection.id)

          console.log(`QR Code real do Baileys gerado para conexão ${connection.id}`)

          return new Response(
            JSON.stringify({
              connection_id: connection.id,
              qr_code: qrResult.qrCode,
              expires_at: expiresAt.toISOString(),
              status: 'waiting_scan'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )

        } catch (baileysError) {
          console.error('Erro ao inicializar Baileys:', baileysError)
          return new Response(
            JSON.stringify({ error: 'Erro ao inicializar conexão WhatsApp com Baileys' }),
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

        // Check active Baileys session
        const activeSession = activeSessions.get(connectionId)
        
        // Get current data from database
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

        // Check if already connected via Baileys
        if (activeSession && activeSession.status === 'connected') {
          await supabase
            .from('tenant_baileys_connections')
            .update({
              status: 'connected',
              phone_number: activeSession.phone_number,
              last_activity_at: new Date().toISOString()
            })
            .eq('id', connectionId)

          return new Response(
            JSON.stringify({
              status: 'connected',
              phone_number: activeSession.phone_number
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if QR code expired or needs regeneration
        const now = new Date()
        const expiresAt = connection.qr_expires_at ? new Date(connection.qr_expires_at) : null

        if (!expiresAt || now > expiresAt || !connection.qr_code || !activeSession) {
          // Generate new real QR code
          console.log(`Regenerando QR Code real para conexão ${connectionId}`)
          const qrResult = await generateRealQRCode(connectionId)
          
          if (!qrResult) {
            return new Response(
              JSON.stringify({ error: 'Erro ao gerar novo QR Code' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          const newExpiresAt = new Date(Date.now() + 60000)

          await supabase
            .from('tenant_baileys_connections')
            .update({
              qr_code: qrResult.qrCode,
              qr_expires_at: newExpiresAt.toISOString(),
              status: 'waiting_scan'
            })
            .eq('id', connectionId)

          return new Response(
            JSON.stringify({
              qr_code: qrResult.qrCode,
              expires_at: newExpiresAt.toISOString(),
              status: 'waiting_scan'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
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

        // Disconnect Baileys session
        const activeSession = activeSessions.get(connectionId)
        if (activeSession && activeSession.socket) {
          try {
            activeSession.socket.logout()
            activeSession.socket.end()
          } catch (disconnectError) {
            console.error('Erro ao desconectar Baileys:', disconnectError)
          }
        }

        // Remove from active sessions
        activeSessions.delete(connectionId)

        // Update database
        const { error } = await supabase
          .from('tenant_baileys_connections')
          .update({
            status: 'disconnected',
            qr_code: null,
            qr_expires_at: null,
            phone_number: null
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

        // Check if connection is really active via Baileys
        const activeSession = activeSessions.get(connectionId)
        const realStatus = activeSession && activeSession.status === 'connected' ? 'connected' : connection.status

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
