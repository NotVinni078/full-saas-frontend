
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

// Store active sessions in memory (for demo purposes)
const activeSessions = new Map<string, {
  status: string
  qr_code?: string
  phone_number?: string
  created_at: string
  expires_at?: string
}>()

// Generate QR Code using a Deno-compatible library
const generateQRCode = async (connectionId: string): Promise<{ qrCode: string; expiresAt: string } | null> => {
  try {
    // Import QR code library that works in Deno
    const QRCode = await import("https://deno.land/x/qrcode@v2.0.0/mod.ts")
    
    // Generate a realistic WhatsApp-like QR code data
    const qrData = `2@${Math.random().toString(36).substring(2, 15)},${Math.random().toString(36).substring(2, 15)},${Date.now()}`
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.encode(qrData, {
      type: 'png',
      width: 300,
      height: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
    
    const expiresAt = new Date(Date.now() + 60000).toISOString() // 60 seconds from now
    
    console.log(`QR Code gerado para conexão ${connectionId}`)
    
    // Store the session
    activeSessions.set(connectionId, {
      status: 'waiting_scan',
      qr_code: qrCodeDataURL,
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    })
    
    return {
      qrCode: qrCodeDataURL,
      expiresAt
    }
  } catch (error) {
    console.error('Erro ao gerar QR Code:', error)
    return null
  }
}

// Simulate connection process (for demo - in real implementation this would connect to WhatsApp)
const simulateConnection = (connectionId: string) => {
  // Simulate scanning after 10-30 seconds
  const delay = Math.random() * 20000 + 10000 // 10-30 seconds
  
  setTimeout(() => {
    const session = activeSessions.get(connectionId)
    if (session && session.status === 'waiting_scan') {
      session.status = 'connected'
      session.phone_number = `+55119${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
      activeSessions.set(connectionId, session)
      console.log(`Conexão simulada estabelecida para ${connectionId}`)
    }
  }, delay)
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

          // Generate QR code
          console.log(`Iniciando geração de QR Code para conexão ${connection.id}`)
          const qrResult = await generateQRCode(connection.id)
          
          if (!qrResult) {
            throw new Error('Falha ao gerar QR Code')
          }

          // Update database with QR code
          await supabase
            .from('tenant_baileys_connections')
            .update({
              qr_code: qrResult.qrCode,
              qr_expires_at: qrResult.expiresAt,
              status: 'waiting_scan'
            })
            .eq('id', connection.id)

          // Start simulation of connection process
          simulateConnection(connection.id)

          console.log(`QR Code gerado para conexão ${connection.id}`)

          return new Response(
            JSON.stringify({
              connection_id: connection.id,
              qr_code: qrResult.qrCode,
              expires_at: qrResult.expiresAt,
              status: 'waiting_scan'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )

        } catch (qrError) {
          console.error('Erro ao gerar QR Code:', qrError)
          return new Response(
            JSON.stringify({ error: 'Erro ao gerar QR Code' }),
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

        // Check active session
        const activeSession = activeSessions.get(connectionId)
        
        // Get current data from database
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

        // Check if already connected
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
          // Generate new QR code
          console.log(`Regenerando QR Code para conexão ${connectionId}`)
          const qrResult = await generateQRCode(connectionId)
          
          if (!qrResult) {
            return new Response(
              JSON.stringify({ error: 'Erro ao gerar novo QR Code' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }

          await supabase
            .from('tenant_baileys_connections')
            .update({
              qr_code: qrResult.qrCode,
              qr_expires_at: qrResult.expiresAt,
              status: 'waiting_scan'
            })
            .eq('id', connectionId)

          // Start simulation again
          simulateConnection(connectionId)

          return new Response(
            JSON.stringify({
              qr_code: qrResult.qrCode,
              expires_at: qrResult.expiresAt,
              status: 'waiting_scan'
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        return new Response(
          JSON.stringify({
            qr_code: connection.qr_code,
            expires_at: connection.qr_expires_at,
            status: activeSession?.status || connection.status
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

        // Check if connection is really active
        const activeSession = activeSessions.get(connectionId)
        const realStatus = activeSession?.status || connection.status

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
