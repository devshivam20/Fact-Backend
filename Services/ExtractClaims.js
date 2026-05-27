import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function extractClaims(text){

const prompt=`
Extract factual claims.

Focus on:
- statistics
- dates
- percentages
- technical facts
- financial values

Return ONLY JSON array.

Text:
${text}
`;

const response=await ai.models.generateContent({
model:"gemini-2.5-flash",
contents:prompt
});

const cleaned=response.text
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

return JSON.parse(cleaned);

}