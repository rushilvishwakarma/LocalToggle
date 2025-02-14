import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDWdj4Jgw_Ewz2cWkx1CU6MwGP3GFwj1qI");

export async function processQuery(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Updated prompt: force plain text output with Unicode superscripts and no LaTeX delimiters.
    const prompt = `
      Act as a mathematical solver called "Tangerine" that provides concise solutions in plain text only.
      Process the following query and decide on the output format as follows:
        • If the resulting expression is longer than 22 characters, output it in scientific notation using Unicode superscript digits (e.g. "10¹⁰⁰") with the multiplication symbol "×".
        • Otherwise, output plain text.
      ${query}
      
      Rules:
      1. Use mathematical notation over words whenever possible.
      2. Keep solutions extremely concise.
      3. Use standard symbols (∴, →, ∈, etc.).
      4. For equations and proofs, use minimal text with necessary symbols.
      5. Only include words when absolutely necessary.
      6. Do not use any LaTeX formatting or delimiters such as $...$; always output in plain text.
      7. For simple arithmetic, output plain text if the result is 22 characters or less.
      8. If the query is irrelevant or contains invalid keywords (e.g., greetings, farewells, commands like "compute", "calculate", "maths"), respond with "No results found".
      9. If the query cannot be solved or is empty, respond with "No results found".
      10. If the numerical result is very large, abbreviate using scientific notation.
      11. Always use Unicode superscript digits for exponents in plain text (e.g. output "10¹⁰⁰" instead of "10^100").
      12. For each type of query, always provide the exact same format of answer.
      13. Do not respond to greetings, farewells, or non-mathematical queries.
      14. For identical inputs, always return identical outputs.
      15. If the query involves currency conversions or contains currency-related terms (e.g., "dollar", "euro", "pound", "yen", "currency conversion"), respond with "No results found".
      16. For valid arithmetic expressions—including exponentiation like 23^234—compute the result regardless of its length. If the computed result exceeds 22 characters, output it in scientific notation with Unicode superscripts in plain text.
      
      Example fixed responses:
      - "gogol" → "10¹⁰⁰"
      - "googol" → "10¹⁰⁰"
      - "Heron" → "√s(s-a)(s-b)(s-c)"
      - "5 + 3 * 2" → "11"
      - "23^234" → (the computed result in plain text with Unicode superscripts)
      Keep all responses as concise as possible.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error processing query";
  }
}
