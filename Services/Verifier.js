import { tavily } from "@tavily/core";
import { GoogleGenAI } from "@google/genai";

import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const tvly = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

export async function verifyClaim(claim) {
  try {

  
    const searchResponse = await tvly.search(
      claim,
      {
        maxResults: 3,
      }
    );

    const webData = searchResponse.results
      .map(item => item.content)
      .join("\n");

    const prompt = `
Claim:
"${claim}"

Web Data:
${webData}

Determine whether the claim is:

- Verified
- Inaccurate
- False

Return ONLY JSON:

{
 "status":"",
 "correction":"",
 "reason":""
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const cleanResponse = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanResponse);

  } catch (error) {

    console.log("Verification Error:", error);

    return {
      status: "Error",
      correction: "",
      reason: error.message,
    };
  }
}