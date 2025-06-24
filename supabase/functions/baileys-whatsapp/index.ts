
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

// Store active connections in memory (simplified for now)
const activeConnections = new Map()

// Mock QR Code generator function (replace with actual implementation)
const generateMockQRCode = async (): Promise<string> => {
  // This is a placeholder - in production, you'd integrate with actual WhatsApp API
  const mockQRData = `whatsapp-qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  // Generate a simple data URL for testing
  const canvas = `data:image/svg+xml;base64,${btoa(`
    <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
      <rect width="300" height="300" fill="white"/>
      <text x="150" y="150" text-anchor="middle" font-family="Arial" font-size="12" fill="black">
        Mock QR Code
      </text>
      <text x="150" y="170" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">
        ${mockQRData}
      </text>
    </svg>
  `)}`
  
  return canvas
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

          // Generate mock QR code
          const qrCode = await generateMockQRCode()
          const expiresAt = new Date(Date.now() + 60000) // 60 segundos

          // Update database with QR code
          await supabase
            .from('tenant_baileys_connections')
            .update({
              qr_code: qrCode,
              qr_expires_at: expiresAt.toISOString(),
              status: 'waiting_scan'
            })
            .eq('id', connection.id)

          // Store connection as active
          activeConnections.set(connection.id, {
            status: 'waiting_scan',
            qr_code: qrCode,
            expires_at: expiresAt.toISOString()
          })

          console.log(`Mock QR Code gerado para conexão ${connection.id}`)

          return new Response(
            JSON.stringify({
              connection_id: connection.id,
              qr_code: qrCode,
              expires_at: expiresAt.toISOString(),
              status: 'waiting_scan'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )

        } catch (mockError) {
          console.error('Erro ao inicializar conexão mock:', mockError)
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

        // Check active connection
        const activeConn = activeConnections.get(connectionId)
        
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

        // Check if already connected
        if (connection.status === 'connected') {
          return new Response(
            JSON.stringify({
              status: 'connected',
              phone_number: connection.phone_number
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Check if QR code expired
        const now = new Date()
        const expiresAt = connection.qr_expires_at ? new Date(connection.qr_expires_at) : null

        if (!expiresAt || now > expiresAt || !connection.qr_code) {
          // Generate new QR code
          const newQrCode = await generateMockQRCode()
          const newExpiresAt = new Date(Date.now() + 60000)

          await supabase
            .from('tenant_baileys_connections')
            .update({
              qr_code: newQrCode,
              qr_expires_at: newExpiresAt.toISOString(),
              status: 'waiting_scan'
            })
            .eq('id', connectionId)

          activeConnections.set(connectionId, {
            status: 'waiting_scan',
            qr_code: newQrCode,
            expires_at: newExpiresAt.toISOString()
          })

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

        // Remove from active connections
        activeConnections.delete(connectionId)

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

        // Check if connection is really active
        const activeConn = activeConnections.get(connectionId)
        const realStatus = activeConn ? connection.status : 'disconnected'

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
