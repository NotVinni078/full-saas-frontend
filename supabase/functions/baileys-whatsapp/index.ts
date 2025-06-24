
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

interface BaileysQRResponse {
  qr_code: string
  expires_at: string
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
            JSON.stringify({ error: 'Erro ao criar conexão' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Simular geração de QR Code real (em produção, aqui você integraria com Baileys)
        const qrCode = generateMockQRCode(connection.id)
        const expiresAt = new Date(Date.now() + 20000) // 20 segundos

        // Atualizar conexão com QR Code
        const { error: updateError } = await supabase
          .from('tenant_baileys_connections')
          .update({
            qr_code: qrCode,
            qr_expires_at: expiresAt.toISOString(),
            status: 'waiting_scan'
          })
          .eq('id', connection.id)

        if (updateError) {
          console.error('Erro ao atualizar QR Code:', updateError)
        }

        // Simular conexão bem-sucedida após alguns segundos
        setTimeout(async () => {
          await supabase
            .from('tenant_baileys_connections')
            .update({
              status: 'connected',
              phone_number: '+55 11 99999-9999',
              last_activity_at: new Date().toISOString()
            })
            .eq('id', connection.id)
        }, 8000)

        return new Response(
          JSON.stringify({
            connection_id: connection.id,
            qr_code: qrCode,
            expires_at: expiresAt.toISOString(),
            status: 'waiting_scan'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get_qr': {
        if (!connectionId) {
          return new Response(
            JSON.stringify({ error: 'ID da conexão é obrigatório' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Buscar conexão atual
        const { data: connection, error } = await supabase
          .from('tenant_baileys_connections')
          .select('*')
          .eq('id', connectionId)
          .single()

        if (error || !connection) {
          return new Response(
            JSON.stringify({ error: 'Conexão não encontrada' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Verificar se QR Code expirou
        const now = new Date()
        const expiresAt = connection.qr_expires_at ? new Date(connection.qr_expires_at) : null

        if (!expiresAt || now > expiresAt) {
          // Gerar novo QR Code
          const newQrCode = generateMockQRCode(connectionId)
          const newExpiresAt = new Date(Date.now() + 20000)

          await supabase
            .from('tenant_baileys_connections')
            .update({
              qr_code: newQrCode,
              qr_expires_at: newExpiresAt.toISOString(),
              status: 'waiting_scan'
            })
            .eq('id', connectionId)

          return new Response(
            JSON.stringify({
              qr_code: newQrCode,
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
            JSON.stringify({ error: 'Erro ao desconectar' }),
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

        return new Response(
          JSON.stringify(connection),
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

// Função para gerar QR Code mockado (em produção, use Baileys real)
function generateMockQRCode(connectionId: string): string {
  const timestamp = Date.now()
  const qrData = `2@${connectionId}_${timestamp}_mock_qr_data`
  
  // Em produção, aqui você geraria um QR Code real com a biblioteca QR
  // Por enquanto, retornamos uma URL de QR Code mockado
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="40%" font-family="Arial" font-size="12" fill="#333" text-anchor="middle">QR Code Real</text>
      <text x="50%" y="55%" font-family="Arial" font-size="8" fill="#666" text-anchor="middle">Conexão: ${connectionId.slice(0, 8)}</text>
      <text x="50%" y="70%" font-family="Arial" font-size="6" fill="#999" text-anchor="middle">Timestamp: ${timestamp}</text>
    </svg>
  `)}`
}
