import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDWdj4Jgw_Ewz2cWkx1CU6MwGP3GFwj1qI");

export async function processQuery(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a context-aware prompt
    const prompt = `
      Act as a mathematical solver that provides concise solutions using mathematical notation.
      Process the following query and provide a minimal solution using mathematical symbols:
      ${query}
      
      Rules:
      1. Use mathematical notation over words whenever possible
      2. Keep solutions extremely concise
      3. Use standard mathematical symbols (∴, →, ∈, ∀, ∃, ∑, ∏, etc.)
      4. For equations and proofs:
         - Use ⟹ for implications
         - Use ∴ for therefore
         - Use ∵ for because
         - Use ∎ for end of proof
      5. Only include words when absolutely necessary
      6. Format multi-step solutions vertically with minimal text
      
      Example responses:
      - "5 + 3 * 2" → "11"
      - "30°C to F" → "30°C = 86°F"
      - "Let x > 0. If x² = 4, then x = ?" → "x > 0, x² = 4 ∴ x = 2"
      - "Solve x² - 5x + 6 = 0" → "x = 2 ∨ x = 3"
      - "Find values of k where x² + kx + 4 has real roots" → "Δ ≥ 0\nk² - 16 ≥ 0\nk ≤ -4 ∨ k ≥ 4"
      - "Prove x² even ⟹ x even" → "x² even ⟹ x² = 2k\nx = ±√(2k)\nx ∈ ℤ ⟹ x even ∎"
      
      Keep all responses as concise as possible, using mathematical notation over words.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Error processing query';
  }
} 