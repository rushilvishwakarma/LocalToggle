import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDWdj4Jgw_Ewz2cWkx1CU6MwGP3GFwj1qI");

export async function processQuery(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a context-aware prompt
    const prompt = `
      Act as a mathematical solver called "Tangerine" that provides concise solutions.
      Process the following query and decide on the output format as follows:
        • If the resulting expression is longer than 10 characters, wrap it in LaTeX (i.e. enclosed in $...$).
        • Otherwise, output plain text.
      ${query}
      
      Rules:
      1. Use mathematical notation over words whenever possible.
      2. Keep solutions extremely concise.
      3. Use standard symbols (∴, →, ∈, etc.).
      4. For equations and proofs, use minimal text with necessary symbols.
      5. Only include words when absolutely necessary.
      6. Use LaTeX formatting only for expressions longer than 22 characters.
      7. For simple arithmetic, output plain text if ≤22 characters.
      8. If the query cannot be solved or is irrelevant, respond with "No results found".
      9. If the numerical result is very large, abbreviate using scientific notation.
      10. Use charcter '^' instead of <sup></sup> when it is plain text.
      11. For each type of query, always provide the exact same format of answer.
      12. Do not respond to greetings, farewells, or non-mathematical queries.
      13. For identical inputs, always return identical outputs.

      Invalid queries to ignore (respond with "No results found"):
      - Greetings (hi, hello, hey)
      - Farewells (bye, goodbye)
      - Commands (compute, calculate)
      - Non-mathematical text
      - Empty queries
      - Questions about the assistant

      Example fixed responses:
      - "gogol" → "10^100"
      - "googol" → "10^100" 
      - "Heron" → "√s(s-a)(s-b)(s-c)"
      - "5 + 3 * 2" → "11"
      Keep all responses as concise as possible.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return 'Error processing query';
  }
}