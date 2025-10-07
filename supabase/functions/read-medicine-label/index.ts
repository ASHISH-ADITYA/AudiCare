import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Define the Google Vision API endpoint
const visionApiUrl = "https://vision.googleapis.com/v1/images:annotate";

serve(async (req) => {
  try {
    // Access the API key from the environment variables (Supabase secrets)
    const googleApiKey = Deno.env.get("GOOGLE_API_KEY");
    if (!googleApiKey) {
      return new Response("Missing Google API Key", { status: 500 });
    }

    // Parse the request body to get the Base64 image string
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response("Missing image data", { status: 400 });
    }

    // Construct the request body for the Google Vision API
    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [
            {
              type: "TEXT_DETECTION",
            },
          ],
        },
      ],
    };

    // Make the call to the Google Vision API
    const response = await fetch(`${visionApiUrl}?key=${googleApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${googleApiKey}`
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();

    // Extract the recognized text from the API response
    const extractedText = result.responses?.[0]?.fullTextAnnotation?.text || "";

    // Return the result to the mobile app
    return new Response(JSON.stringify({ text: extractedText }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});