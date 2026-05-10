import { GoogleGenAI } from "@google/genai";

const DEFAULT_AI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getAICompletion(
  prompt: string, 
  history: { role: string; content: string }[], 
  signal?: AbortSignal,
  customKey?: string,
  aiModel: "gemini" | "ollama" = "gemini",
  ollamaEndpoint?: string
) {
  try {
    if (aiModel === "ollama") {
      const response = await fetch(`${ollamaEndpoint || "http://localhost:11434"}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3", // Default Ollama model
          prompt: `System: Tu es l'assistant de Sky Dex, l'assistant ultime pour les agents de voyage en Afrique.
          Tu es intelligent, rapide, professionnel et capable d'aider sur la recherche de vols, la gestion de clients (CRM), et la création d'itinéraires.
          Tu parles un français clair et simple.
          Réponds en Markdown.
          
          History:
          ${history.map(h => `${h.role}: ${h.content}`).join("\n")}
          
          User: ${prompt}`,
          stream: false
        }),
        signal
      });

      if (!response.ok) throw new Error("NETWORK_ERROR");
      const data = await response.json();
      return data.response;
    }

    if (!customKey && !process.env.GEMINI_API_KEY) {
      throw new Error("MISSING_API_KEY");
    }

    const aiClient = customKey ? new GoogleGenAI({ apiKey: customKey }) : DEFAULT_AI;
    
    const generatePromise = aiClient.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        ...history.map(h => ({ role: h.role === "assistant" ? "model" as const : "user" as const, parts: [{ text: h.content }] })),
        { role: "user", parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: `Tu es l'assistant de Sky Dex, l'assistant ultime pour les agents de voyage en Afrique.
        Tu es intelligent, rapide, professionnel et capable d'aider sur la recherche de vols, la gestion de clients (CRM), et la création d'itinéraires.
        Tu parles un français clair et simple.
        Réponds en Markdown.`,
      }
    });

    let response;
    if (signal) {
      if (signal.aborted) throw new Error("Aborted");
      response = await Promise.race([
        generatePromise,
        new Promise((_, reject) => {
          signal.addEventListener("abort", () => reject(new Error("Aborted")), { once: true });
        })
      ]) as any;
    } else {
      response = await generatePromise;
    }

    if (signal?.aborted) {
      throw new Error("Aborted");
    }

    if (!response.text) {
      throw new Error("EMPTY_RESPONSE");
    }

    return response.text;
  } catch (error: any) {
    if (error instanceof Error && error.message === "Aborted") {
      throw error;
    }
    
    console.error("AI Service Error:", error);

    // Specific error mapping
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("INVALID_API_KEY");
    }

    if (
      error.message?.includes("fetch failed") || 
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("network error") ||
      error.name === "TypeError"
    ) {
      throw new Error("NETWORK_ERROR");
    }

    throw error;
  }
}
