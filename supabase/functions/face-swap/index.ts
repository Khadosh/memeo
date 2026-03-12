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

  const debugLogs: string[] = [];
  const log = (...args: any[]) => {
    const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
    console.log(msg);
    debugLogs.push(msg);
  };

  try {
    const { templateImageUrl, swapImageBase64 } = await req.json()

    log("--- DEBUG: Inicia Proceso Face Swap ---");
    log("Template URL:", templateImageUrl);
    log("Swap Image (primeros 50 caracteres):", swapImageBase64?.substring(0, 50));

    if (!templateImageUrl || !swapImageBase64) {
      log("ERROR: Faltan parámetros");
      throw new Error("Missing images input")
    }

    // Call fal.ai face swap model (Half Moon AI version)
    const modelId = "half-moon-ai/ai-face-swap/faceswapimage";
    log("Llamando fal.run con:", modelId);

    let result;
    try {
      result = await fal.run(modelId, {
        input: {
          source_face_url: swapImageBase64,
          target_image_url: templateImageUrl,
        }
      });
      log("IA result exitoso");
    } catch (apiError) {
      log("API ERROR DETECTED:", apiError.message || apiError);
      
      log("Intentando fallback al modelo básico de Fal...");
      result = await fal.subscribe("fal-ai/face-swap", {
        input: {
          base_image_url: templateImageUrl,
          swap_image_url: swapImageBase64,
        }
      });
      log("Fallback completado");
    }

    return new Response(
      JSON.stringify({ ...result, debugLogs }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || String(error), debugLogs }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      },
    )
  }
})
