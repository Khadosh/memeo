// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { fal } from "npm:@fal-ai/client"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { templateImageUrl, swapImageBase64 } = await req.json()

    if (!templateImageUrl || !swapImageBase64) {
      throw new Error("Missing images input")
    }

    // Call fal.ai advanced face swap model
    // The advanced model handles multi-faces better and preserves scene structure
    const result = await fal.subscribe("easel-ai/advanced-face-swap", {
      input: {
        face_image_0: swapImageBase64,  // The user's face
        target_image: templateImageUrl, // The meme template
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log)
        }
      },
    })

    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Retornamos 200 para que supabase-js pueda leer el cuerpo de la respuesta con el motivo de error
      },
    )
  }
})
