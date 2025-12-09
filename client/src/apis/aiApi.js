// api.js
// Production-ready API handler for Gemini Pro Vision.
// WARNING: API key exposed in frontend—use backend proxy in real prod.

const GEMINI_API_KEY = import.meta.env.VITE_REACT_APP_GEMINI_API_KEY;
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

/**
 * Analyzes a plant image using Gemini API.
 * @param {File} imageFile - The uploaded image file (PNG/JPG/GIF, <5MB).
 * @returns {Promise<Object>} Parsed JSON response or throws error.
 */
export const analyzePlantImage = async (imageFile) => {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not configured. Check .env file.");
  }

  // Validate file
  if (imageFile.size > 5 * 1024 * 1024) {
    throw new Error("Image size exceeds 5MB limit.");
  }
  if (!imageFile.type.startsWith("image/")) {
    throw new Error("Please upload a valid image file.");
  }

  try {
    // Convert image to base64
    const base64Image = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove data:image/... prefix
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    // Powerful prompt for detailed JSON response
    const prompt = `
      Analyze this plant image (leaf/crop) for diseases or health issues. 
      Be comprehensive: Detect the plant type if possible, identify any disease/pest, assess severity.
      Respond ONLY with valid JSON (no extra text). Structure:
      {
        "plantType": "e.g., Tomato",
        "disease": "Disease name or 'Healthy'",
        "confidence": number (0-100),
        "summary": "Detailed 2-3 sentence overview of findings, symptoms, and impacts.",
        "symptoms": ["Bullet-point list of visible symptoms"],
        "causes": ["Bullet-point list of likely causes (e.g., fungal, environmental)"],
        "severity": "low|medium|high|critical",
        "suggestions": ["4-6 detailed, actionable treatment steps (include organic options, dosages if relevant)"],
        "prevention": ["4-6 proactive tips to avoid recurrence"]
      }
      If healthy, set disease to 'Healthy', suggestions to general care tips, and severity to 'low'.
    `;

    // API request body
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: imageFile.type, // e.g., image/jpeg
                data: base64Image,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.2, // Low for consistent JSON
        maxOutputTokens: 2048, // Allow detailed response
      },
    };

    const response = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No analysis generated. Try a clearer image.");
    }

    // Parse JSON (strip any markdown if present)
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from AI.");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      ...parsed,
      healthy: parsed.disease === "Healthy",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error; // Re-throw for UI handling
  }
};
