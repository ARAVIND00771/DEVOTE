import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const auditElection = async (candidates: any[], totalVotes: number): Promise<string> => {
  const client = getClient();
  if (!client) return "API Key missing. Cannot audit.";

  try {
    const dataStr = JSON.stringify({ candidates, totalVotes });
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an Election Integrity AI. Analyze the current election results.
      Data: ${dataStr}
      
      Provide a 2-sentence summary of the current standings and state if the distribution looks organic or suspicious (this is a simulation, so assume organic unless extremely lopsided). Then provide a "Predicted Winner" based on current trends.`,
    });
    return response.text || "No audit generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error auditing election.";
  }
};