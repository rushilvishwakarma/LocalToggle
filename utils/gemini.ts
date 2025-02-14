import { create, all } from 'mathjs';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create a math.js instance and configure it for BigNumber arithmetic.
const math = create(all);
math.config({ number: 'BigNumber', precision: 64 });

const genAI = new GoogleGenerativeAI("AIzaSyDWdj4Jgw_Ewz2cWkx1CU6MwGP3GFwj1qI");

// Helper function: check if query is a pure arithmetic exponentiation (basic check)
function isPureArithmetic(query: string): boolean {
  // Matches expressions like "16^43", "23^32" (possibly with spaces)
  return /^\s*\d+\s*\^\s*\d+\s*$/.test(query);
}

// Helper function: convert an exponent string to Unicode superscripts.
function convertExponentToUnicode(exp: string): string {
  const superscripts: { [key: string]: string } = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '-': '⁻'
  };
  return exp.split('').map(ch => superscripts[ch] || ch).join('');
}

// Helper function: compute arithmetic using math.js instance with BigNumber arithmetic.
function computeArithmetic(query: string): string | null {
  try {
    // Remove spaces and compute the result exactly.
    const cleaned = query.replace(/\s+/g, '');
    const result = math.evaluate(cleaned); // result is a BigNumber
    
    // Use math.format to get an exponential notation string.
    const resultStr = math.format(result, { notation: 'exponential', precision: 10 }); 
    // Expected format: e.g. "5.9863107e+51"
    const parts = resultStr.split('e');
    if (parts.length < 2) {
      // No exponent part, return plain result.
      return resultStr;
    }
    const mantissa = parts[0];
    let exponentRaw = parts[1];
    // Extract and store the sign (if any) for proper formatting.
    const sign = (exponentRaw[0] === '+' || exponentRaw[0] === '-') ? exponentRaw[0] : '';
    // Remove the sign for digit count checking.
    exponentRaw = exponentRaw.replace(/^[+-]/, '');
    
    // If the exponent (absolute value) has more than 2 digits, return "infinity".
    if (exponentRaw.length > 2) {
      return "infinity";
    }
    
    // Optionally, round mantissa to 10 significant digits and remove trailing zeros.
    const roundedMantissa = Number(mantissa).toPrecision(10).replace(/\.?0+$/, '');
    return `${roundedMantissa}×10${convertExponentToUnicode(sign + exponentRaw)}`;
  } catch (error) {
    console.error("Math evaluation error:", error);
    return null;
  }
}

export async function processQuery(query: string): Promise<{ result: string; isGemini: boolean }> {
  // If the query is a pure arithmetic expression, process it using math.js.
  if (isPureArithmetic(query)) {
    const computed = computeArithmetic(query);
    if (computed !== null) {
      return { result: computed, isGemini: false };
    }
  }
  
  // Otherwise, fall back to Gemini.
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
      Act as a mathematical solver called "Tangerine" that provides concise solutions in plain text only.
      Process the following query and decide on the output format as follows:
        • If the resulting expression is longer than 22 characters, output it in scientific notation using Unicode superscript digits (e.g. "10¹⁰") with the multiplication symbol "×".
        • Otherwise, output plain text.
      ${query}
      
      Rules:
      1. Use mathematical notation over words whenever possible.
      2. Keep solutions extremely concise.
      3. Use standard symbols (∴, →, ∈, etc.).
      4. For equations and proofs, use minimal text with necessary symbols.
      5. Only include words when absolutely necessary.
      6. If the computed result exceeds practical limits (i.e., if the exponent part has more than 2 digits), respond with "infinity".
      7. For simple arithmetic, output plain text if the result is 22 characters or less.
      8. If the query is irrelevant or contains invalid keywords (e.g., greetings, farewells, "compute", "calculate", "maths"), respond with "No results found".
      9. If the query cannot be solved or is empty, respond with "No results found".
      10. If the numerical result is very large, abbreviate using scientific notation.
      11. Always use Unicode superscript digits for exponents (e.g., "10¹⁰" instead of "10^10").
      12. For each type of query, always provide the exact same format of answer.
      13. Do not respond to greetings, farewells, or non-mathematical queries.
      14. For identical inputs, always return identical outputs.
      15. If the query involves currency conversions or contains currency-related terms, respond with "No results found".
      16. For valid arithmetic expressions, compute the full result only if the exponent part has less than 3 digits and it’s not tending to infinity. If the exponent part exceeds practical limits, output "infinity".
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return { result: response.text(), isGemini: true };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { result: "Error processing query", isGemini: true };
  }
}
