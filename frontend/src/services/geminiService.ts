import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getInterviewFeedback(question: string, answer: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Question: ${question}\nUser Answer: ${answer}`,
    config: {
      systemInstruction: "You are an expert backend interviewer. Evaluate the user's answer for clarity, accuracy, and depth. Provide a score out of 10 and specific improvement tips.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          clarity: { type: Type.NUMBER },
          accuracy: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "clarity", "accuracy", "feedback", "tips"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function explainDSAPattern(pattern: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Explain the ${pattern} pattern for backend interviews.`,
    config: {
      systemInstruction: "Explain the pattern like a senior backend engineer. Include when to use it, time/space complexity, and a common interview example.",
    }
  });

  return response.text;
}

export async function generateResumeBullet(achievement: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Achievement: ${achievement}`,
    config: {
      systemInstruction: "Transform the achievement into a high-impact resume bullet point for a backend engineer. Use metrics and strong action verbs.",
    }
  });

  return response.text;
}

export async function getConceptSummary(concept: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a 5-minute read summary for the backend concept: ${concept}.`,
    config: {
      systemInstruction: "You are a senior backend architect. Provide a concise, highly technical yet accessible summary. Include: 1. Core Definition, 2. Why it matters, 3. A text-based diagram (using ASCII or Mermaid syntax), 4. Example Python/FastAPI code snippet, 5. Common Interview Questions related to it. Use Markdown formatting.",
    }
  });

  return response.text;
}

export async function evaluateInterview(round: string, data: any) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Round: ${round}\nData: ${JSON.stringify(data)}`,
    config: {
      systemInstruction: "You are a senior interviewer. Evaluate the interview performance. Provide scores (0-10) for Algorithm, Communication, and Optimization thinking. Provide detailed feedback on correctness, code clarity, and edge cases. Return JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          scores: {
            type: Type.OBJECT,
            properties: {
              coding: { type: Type.NUMBER },
              backend: { type: Type.NUMBER },
              behavioral: { type: Type.NUMBER }
            },
            required: ["coding", "backend", "behavioral"]
          },
          feedback: { type: Type.STRING }
        },
        required: ["scores", "feedback"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function evaluateSystemDesign(topic: string, components: any[], explanation: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Topic: ${topic}\nComponents: ${JSON.stringify(components)}\nExplanation: ${explanation}`,
    config: {
      systemInstruction: "Evaluate this system design. Check for scalability, database choice, caching, and failure handling. Provide a score and detailed feedback. Return JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "feedback", "improvements"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function evaluateExplanation(problem: string, explanation: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Problem: ${problem}\nExplanation: ${explanation}`,
    config: {
      systemInstruction: "Evaluate this solution explanation. Check for clarity, structure, and missing edge cases. Provide feedback like an interviewer. Return JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          clarity: { type: Type.NUMBER },
          structure: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          missing_points: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["clarity", "structure", "feedback", "missing_points"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function getHint(problem: string, code: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Problem: ${problem}\nCurrent Code: ${code}`,
    config: {
      systemInstruction: "You are an AI Pair Programmer. Provide a subtle hint to nudge the user towards the solution without giving away the full answer. Suggest patterns or data structures. Keep it short.",
    }
  });
  return response.text;
}

export async function getBehavioralFeedback(question: string, answer: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Question: ${question}\nAnswer: ${answer}`,
    config: {
      systemInstruction: "Evaluate the behavioral interview answer. Check for technical balance, business impact, and STAR method structure. Provide specific feedback on what's missing or what's too technical. Return JSON.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "feedback", "strengths", "improvements"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
}
