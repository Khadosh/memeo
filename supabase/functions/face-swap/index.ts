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

    // Call fal.ai face swap model
    // Using fal-ai/face-swap or similar optimized model
    // The base64 must include the prefix, e.g. "data:image/jpeg;base64,...""
    const result = await fal.subscribe("fal-ai/face-swap", {
      input: {
        base_image_url: templateImageUrl,
        swap_image_url: swapImageBase64,
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      },
    )
  }
})
