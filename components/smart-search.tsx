import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { useState, useId, useEffect } from "react";
import { processQuery } from "@/utils/gemini";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { AuroraText } from "@/components/ui/aurora-text"
import { LatexAurora } from "@/components/ui/latex-aurora";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge"; // Import BadgeDestructive

interface TagSearchProps {
  onSearch: (query: string) => void;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  allTags: string[];
  noCardsFound?: boolean;  // Add this prop
}

// Define mathematical operators and units for validation
const mathOperators = ['+', '-', '*', '/', '(', ')', '^', '%', '=', '√', '∛', '∜', '≤', '≥', '≠', '∈', '∉', '⊂', '⊃', '∪', '∩', '→'];
const validUnits = [
  // Time
  'seconds', 'second', 'sec', 's',
  'minutes', 'minute', 'min', 'm',
  'hours', 'hour', 'hr', 'h',
  'days', 'day', 'd',
  
  // Temperature
  'celsius', 'centigrade', 'c',
  'fahrenheit', 'fah', 'f',
  'kelvin', 'k',
  
  // Length
  'meters', 'meter', 'm',
  'feet', 'foot', 'ft',
  'inches', 'inch', 'in',
  'kilometers', 'kilometer', 'km',
  'centimeters', 'centimeter', 'cm',
  'millimeters', 'millimeter', 'mm',
  'miles', 'mile', 'mi',
  
  // Mass
  'kilograms', 'kilogram', 'kg',
  'pounds', 'pound', 'lb', 'lbs',
  'grams', 'gram', 'g',
  'ounces', 'ounce', 'oz',
  
  // Data
  'bytes', 'byte', 'B',
  'kilobytes', 'kilobyte', 'kb', 'KB',
  'megabytes', 'megabyte', 'mb', 'MB',
  'gigabytes', 'gigabyte', 'gb', 'GB',
  'terabytes', 'terabyte', 'tb', 'TB',
  
  // Area
  'square meters', 'square meter', 'm²', 'm2',
  'square feet', 'square foot', 'ft²', 'ft2',
  'acres', 'acre', 'ac',
  'hectares', 'hectare', 'ha',
  
  // Volume
  'liters', 'liter', 'l', 'L',
  'gallons', 'gallon', 'gal',
  'cubic meters', 'cubic meter', 'm³', 'm3',
  'milliliters', 'milliliter', 'ml', 'mL',
  
  // Speed
  'meters per second', 'm/s', 'mps',
  'kilometers per hour', 'km/h', 'kph',
  'miles per hour', 'mph',
  
  // Physics
  'newtons', 'newton', 'N',
  'joules', 'joule', 'J',
  'watts', 'watt', 'W',
  'volts', 'volt', 'V',
  'amperes', 'ampere', 'amp', 'A',
  'ohms', 'ohm', 'Ω',
  
  // Common terms
  'area', 'volume', 'speed', 'velocity', 'acceleration', 'force', 'energy', 'power',
  'radius', 'diameter', 'circumference', 'height', 'width', 'length',
  'percentage', 'ratio', 'average', 'mean', 'median', 'mode',
  // Mathematical terms
  'let', 'if', 'then', 'prove', 'therefore', 'given', 'find', 'solve',
  'equation', 'inequality', 'expression', 'function', 'domain', 'range',
  'set', 'subset', 'union', 'intersection', 'implies', 'exists', 'forall',
  'values', 'variable', 'constant', 'coefficient', 'term', 'polynomial',
  'quadratic', 'linear', 'exponential', 'logarithmic', 'derivative', 'integral'
];

const commonFormulas = {
  'pythagoras theorem': 'a² + b² = c²',
  'pythagorean theorem': 'a² + b² = c²',
  'quadratic formula': 'x = (-b ± √(b² - 4ac)) / 2a',
  'area of circle': 'A = πr²',
  'circumference of circle': 'C = 2πr',
  'area of triangle': 'A = ½bh',
  'area of rectangle': 'A = l × w',
  'volume of sphere': 'V = (4/3)πr³',
  'volume of cylinder': 'V = πr²h',
  'distance formula': 'd = √((x₂-x₁)² + (y₂-y₁)²)',
  'slope formula': 'm = (y₂-y₁)/(x₂-x₁)',
  'density formula': 'ρ = m/V',
  'force formula': 'F = ma',
  'ohms law': 'V = IR',
  'power formula': 'P = VI'
};

const advancedFormulas = {
  'taylor series': 'f(x) = f(a) + f^{\\prime}(a)(x-a) + \\frac{f^{\\prime\\prime}(a)}{2!}(x-a)^2 + \\frac{f^{\\prime\\prime\\prime}(a)}{3!}(x-a)^3 + \\cdots',
  'maclaurin series': 'f(x) = f(0) + f\'(0)x + (f\'\'(0)/2!)x² + (f\'\'\'(0)/3!)x³ + ...',
  'euler formula': 'e^(iθ) = cos(θ) + i·sin(θ)',
  'fourier series': 'f(x) = a₀/2 + Σ(aₙcos(nx) + bₙsin(nx))',
  'binomial theorem': '(x + y)ⁿ = Σᵏ(ⁿCᵏ)xᵏyⁿ⁻ᵏ',
  'chain rule': 'd/dx[f(g(x))] = f\'(g(x))·g\'(x)',
  'product rule': 'd/dx[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)',
  'quotient rule': 'd/dx[f(x)/g(x)] = (f\'(x)g(x) - f(x)g\'(x))/[g(x)]²',
  'integration by parts': '∫u·dv = u·v - ∫v·du',
  'eigenvalue equation': 'Ax = λx',
  'schrodinger equation': 'iℏ∂ψ/∂t = -ℏ²/2m ∇²ψ + Vψ',
  'maxwell equations': '∇·E = ρ/ε₀, ∇·B = 0, ∇×E = -∂B/∂t, ∇×B = μ₀J + μ₀ε₀∂E/∂t',
  'einstein field equations': 'Gᵤᵥ + Λgᵤᵥ = 8πG/c⁴ Tᵤᵥ',
  'normal distribution': 'f(x) = (1/σ√(2π))e^(-(x-μ)²/2σ²)',
  'logarithm rules': 'log(xy) = log(x) + log(y), log(x/y) = log(x) - log(y), log(xⁿ) = n·log(x)'
};

const filterCategories = [
  { id: 'calculator', label: 'Calculators' },
  { id: 'converter', label: 'Converters' },
  { id: 'metric', label: 'Metric Units' },
  { id: 'imperial', label: 'Imperial Units' },
];

// Define component tags with categories
const tagCategories = {
  type: ['calculator', 'converter'],
  domain: ['math', 'finance', 'health', 'tech', 'programming', 'personal', 'shopping'],
  unit: ['time', 'date', 'temperature', 'length', 'mass', 'volume', 'speed', 'area', 'bytes'],
  format: ['decimal', 'binary', 'hex', 'octal', 'roman'],
  operation: ['add', 'subtract', 'multiply', 'divide', 'power', 'root', 'percentage']
} as const;

// Define component tags with their categories
const componentTags: Record<string, string[]> = {
  TimeConverter: ['converter', 'time', 'date'],
  DateCalculator: ['calculator', 'time', 'date'],
  AgeCalculator: ['calculator', 'personal', 'time', 'date'],
  TempCalculator: ['converter', 'temperature'],
  LengthCalculator: ['converter', 'length', 'metric', 'imperial'],
  MassCalculator: ['converter', 'mass', 'metric', 'imperial'],
  DataCalculator: ['converter', 'tech', 'bytes', 'digital'],
  AreaCalculator: ['converter', 'area', 'metric', 'imperial'],
  VolumeCalculator: ['converter', 'volume', 'metric', 'imperial'],
  SpeedConverter: ['converter', 'speed', 'metric', 'imperial'],
  BMICalculator: ['calculator', 'health', 'mass', 'length'],
  DiscountCalculator: ['calculator', 'finance', 'shopping', 'percentage'],
  NumeralSystemConverter: ['converter', 'tech', 'programming', 'binary', 'hex', 'decimal', 'octal']
};

// Create a mapping of unit variations to their canonical form
const unitVariations = {
  // Time
  's': 'seconds',
  'sec': 'seconds',
  'second': 'seconds',
  'seconds': 'seconds',
  'm': 'minutes',
  'min': 'minutes',
  'minute': 'minutes',
  'minutes': 'minutes',
  'h': 'hours',
  'hr': 'hours',
  'hour': 'hours',
  'hours': 'hours',
  'd': 'days',
  'day': 'days',
  'days': 'days',
  
  // Temperature
  'c': 'celsius',
  'celsius': 'celsius',
  'centigrade': 'celsius',
  'f': 'fahrenheit',
  'fah': 'fahrenheit',
  'fahrenheit': 'fahrenheit',
  'k': 'kelvin',
  'kelvin': 'kelvin',
  
  // Update other unit variations similarly...
} as const;

// Define units and their associated components
const unitMappings = {
  'seconds': 'TimeConverter',
  'minutes': 'TimeConverter',
  'hours': 'TimeConverter',
  'days': 'TimeConverter',
  'celsius': 'TempCalculator',
  'fahrenheit': 'TempCalculator',
  'kelvin': 'TempCalculator',
  'meters': 'LengthCalculator',
  'meter': 'LengthCalculator',
  'm': 'LengthCalculator',
  'kilometers': 'LengthCalculator',
  'kilometer': 'LengthCalculator',
  'km': 'LengthCalculator',
  'centimeters': 'LengthCalculator',
  'centimeter': 'LengthCalculator',
  'cm': 'LengthCalculator',
  'millimeters': 'LengthCalculator',
  'millimeter': 'LengthCalculator',
  'mm': 'LengthCalculator',
  'miles': 'LengthCalculator',
  'mile': 'LengthCalculator',
  'mi': 'LengthCalculator',
  'kilograms': 'MassCalculator',
  'kilogram': 'MassCalculator',
  'kg': 'MassCalculator',
  'pounds': 'MassCalculator',
  'pound': 'MassCalculator',
  'lb': 'MassCalculator',
  'lbs': 'MassCalculator',
  'grams': 'MassCalculator',
  'gram': 'MassCalculator',
  'g': 'MassCalculator',
  'ounces': 'MassCalculator',
  'ounce': 'MassCalculator',
  'oz': 'MassCalculator',
  'bytes': 'DataCalculator',
  'byte': 'DataCalculator',
  'B': 'DataCalculator',
  'kilobytes': 'DataCalculator',
  'kilobyte': 'DataCalculator',
  'kb': 'DataCalculator',
  'KB': 'DataCalculator',
  'megabytes': 'DataCalculator',
  'megabyte': 'DataCalculator',
  'mb': 'DataCalculator',
  'MB': 'DataCalculator',
  'gigabytes': 'DataCalculator',
  'gigabyte': 'DataCalculator',
  'gb': 'DataCalculator',
  'GB': 'DataCalculator',
  'terabytes': 'DataCalculator',
  'terabyte': 'DataCalculator',
  'tb': 'DataCalculator',
  'TB': 'DataCalculator',
  'square meters': 'AreaCalculator',
  'square meter': 'AreaCalculator',
  'm²': 'AreaCalculator',
  'm2': 'AreaCalculator',
  'square feet': 'AreaCalculator',
  'square foot': 'AreaCalculator',
  'ft²': 'AreaCalculator',
  'ft2': 'AreaCalculator',
  'acres': 'AreaCalculator',
  'acre': 'AreaCalculator',
  'ac': 'AreaCalculator',
  'hectares': 'AreaCalculator',
  'hectare': 'AreaCalculator',
  'ha': 'AreaCalculator',
  'liters': 'VolumeCalculator',
  'liter': 'VolumeCalculator',
  'l': 'VolumeCalculator',
  'L': 'VolumeCalculator',
  'gallons': 'VolumeCalculator',
  'gallon': 'VolumeCalculator',
  'gal': 'VolumeCalculator',
  'cubic meters': 'VolumeCalculator',
  'cubic meter': 'VolumeCalculator',
  'm³': 'VolumeCalculator',
  'm3': 'VolumeCalculator',
  'milliliters': 'VolumeCalculator',
  'milliliter': 'VolumeCalculator',
  'ml': 'VolumeCalculator',
  'mL': 'VolumeCalculator',
  'meters per second': 'SpeedConverter',
  'm/s': 'SpeedConverter',
  'mps': 'SpeedConverter',
  'kilometers per hour': 'SpeedConverter',
  'km/h': 'SpeedConverter',
  'kph': 'SpeedConverter',
  'miles per hour': 'SpeedConverter',
  'mph': 'SpeedConverter',
  'bmi': 'BMICalculator',
  'discount': 'DiscountCalculator',
  'percentage': 'DiscountCalculator'
} as const;

// Define operation mappings
const operationMappings = {
  '+': ['DiscountCalculator', 'DataCalculator'],
  '-': ['DiscountCalculator', 'DataCalculator'],
  '*': ['DiscountCalculator'],
  '/': ['DiscountCalculator'],
  '%': ['DiscountCalculator'],
  '=': ['NumeralSystemConverter']
} as const;

interface Suggestion {
  type: 'unit' | 'operation' | 'conversion' | 'tag' | 'calculator' | 'converter';
  value: string;
  display: string;
  category: string;
  component?: string;
  related?: string[];
}

// Define suggestions database
const suggestions: Suggestion[] = [
  // Units
  { type: 'unit', value: 'seconds', display: 'Seconds', category: 'time', component: 'TimeConverter', related: ['minutes', 'hours'] },
  { type: 'unit', value: 'celsius', display: 'Celsius', category: 'temperature', component: 'TempCalculator', related: ['fahrenheit', 'kelvin'] },
  { type: 'unit', value: 'meters', display: 'Meters', category: 'length', component: 'LengthCalculator', related: ['kilometers', 'feet'] },
  
  // Operations
  { type: 'operation', value: '+', display: 'Add', category: 'math', related: ['sum', 'plus'] },
  { type: 'operation', value: '-', display: 'Subtract', category: 'math', related: ['minus', 'difference'] },
  { type: 'operation', value: '%', display: 'Percentage', category: 'math', related: ['discount', 'ratio'] }
];

// Update convertToLatex function
const convertToLatex = (formula: string): string => {
  return formatArithmeticResult(formula)
    // Fix integral notation first
    .replace(/∫\s*\((.*?)\)\s*dx/g, '\\int($1)\\dx') // Integral with parentheses
    .replace(/∫\s*(.*?)\s*dx/g, '\\int $1\\dx')      // Regular integral
    // Fix superscripts in integrals
    .replace(/([a-z])(\d+)/g, '{$1}^{$2}')           // Convert ax2 to a^{2}
    .replace(/\b(\d+)\b/g, '{$1}')                   // Wrap numbers in {}
    // Fix fractions
    .replace(/\(([^/]+)\/([^)]+)\)/g, '\\frac{$1}{$2}')
    .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
    // Other mathematical symbols
    .replace(/\*/g, '\\cdot')
    .replace(/±/g, '\\pm')
    .replace(/→/g, '\\rightarrow')
    .replace(/π/g, '\\pi')
    // Clean up spaces
    .replace(/\s*=\s*/g, ' = ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Add this function to normalize mathematical expressions
const normalizeExpression = (expr: string): string => {
  return expr
    .replace(/(\d+)\s*x\s*(\d+)/g, '$1×$2')  // Convert "2x3" to "2×3"
    .replace(/\*/g, '×')  // Convert "*" to "×"
    .replace(/([0-9])\s+([0-9])/g, '$1×$2');  // Convert "2 3" to "2×3"
};

// Add this helper function before TagSearch component
const isSimpleFraction = (formula: string): boolean => {
  return /^\d+\/\d+\s*=/.test(formula) || // Matches patterns like "1/4 = "
         /^\d+\s*\/\s*\d+\s*=/.test(formula); // Matches patterns like "1 / 4 = "
};

// Update isComplexFormula function to be more specific
const isComplexFormula = (formula: string): boolean => {
  // First check if it's a LaTeX formatted string
  if (formula.trim().startsWith('$') && formula.trim().endsWith('$')) {
    return true;
  }

  // Don't treat simple fractions as complex formulas
  if (isSimpleFraction(formula)) return false;
  
  // Other complex formula checks
  return formula.includes('\\sqrt') || // Square roots
    formula.includes('\\frac') || // Fractions
    formula.includes('...') || // Series
    formula.includes('∫') || // Integrals
    formula.includes('∑') || // Summations
    formula.includes('∏') || // Products
    formula.includes('∇') || // Vector operations
    formula.includes('partial') || // Partial derivatives
    formula.match(/[₀₁₂₃₄₅₆₇₈₉].*[₀₁₂₃₄₅₆₇₈₉]/) !== null; // Multiple subscripts
};

const formatArithmeticResult = (result: string): string => {
  // Only format if it's an arithmetic operation (contains numbers and equals)
  if (result.includes('=') && /\d/.test(result)) {
    // Check if it's not a formula (formulas usually contain letters)
    const isArithmetic = !/[a-zA-Z]/.test(result.replace('log', '')); // ignore 'log' in formulas
    if (isArithmetic) {
      // For simple fractions, don't add newline
      if (isSimpleFraction(result)) {
        return result;
      }
      return result.replace('=', '\\\\ =');  // LaTeX newline before equals for other cases
    }
  }
  return result;
};

const isCalculationQuery = (value: string): boolean => {
  const calculationKeywords = [
    'evaluate', 'calculate', 'compute', 'find', 'solve',
    'value', 'integral', 'derivative', 'sum', 'product'
  ];
  const lowercaseValue = value.toLowerCase();
  return calculationKeywords.some(keyword => lowercaseValue.startsWith(keyword));
};

const isFormulaQuery = (query: string): boolean => {
  const lowercaseQuery = query.toLowerCase();
  const formulaKeywords = [
    'formula', 'theorem', 'law', 'equation', 'rule',
    'pythagoras', 'pythagorean', 'circle', 'sphere', 'cylinder',
    'area', 'volume', 'circumference', 'density', 'force',
    'taylor', 'euler', 'fourier', 'maxwell', 'einstein'
  ];
  
  return formulaKeywords.some(keyword => lowercaseQuery.includes(keyword));
};

// Remove or simplify cleanLatexOutput so it no longer overrides AI output
const cleanLatexOutput = (text: string): string => {
  // Simply trim the text, letting the AI decide whether to use LaTeX formatting
  return text.trim();
};

// Add this helper function
const findMatchingUnit = (query: string): string | undefined => {
  const words = query.toLowerCase().split(/\s+/);
  return words.find(word => 
    Object.keys(unitVariations).some(unit => 
      word === unit || 
      word.startsWith(unit + ' ') || 
      word.endsWith(' ' + unit)
    )
  );
};

export default function TagSearch({ onSearch, onQueryChange, placeholder, allTags, noCardsFound = false }: TagSearchProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeminiMode, setIsGeminiMode] = useState(false);  // Changed from isAIMode to isGeminiMode

  // Compute if a matching card exists from allTags
  const hasMatchingCard = allTags.some(tag =>
    tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Add this utility function inside the component
  const isProcessableQuery = (value: string): boolean => {
    return value.trim().length > 0;
  };

  // In processInputQuery, use the raw response without forcing conversion
  const processInputQuery = async (value: string) => {
    const normalizedValue = normalizeExpression(value).toLowerCase();
    
    // First check if it's a calculation or problem-solving request
    if (isCalculationQuery(normalizedValue) || normalizedValue.startsWith('if') || 
        normalizedValue.includes('solve for') || normalizedValue.includes('integral')) {
      setIsProcessing(true);
      try {
        const response = await processQuery(normalizedValue);
        setResult(response.result);
        setIsGeminiMode(response.isGemini);
      } catch (error) {
        console.error('Error processing query:', error);
        setResult('Error processing query');
      }
      setIsProcessing(false);
      return;
    }

    // Then check for exact formula matches only if formula keywords are present
    if (isFormulaQuery(normalizedValue)) {
      const allFormulas = { ...commonFormulas, ...advancedFormulas };
      const formulaMatch = Object.entries(allFormulas).find(([formula]) => {
        return formula.toLowerCase().includes(normalizedValue) || 
               normalizedValue.includes(formula.toLowerCase());
      });

      if (formulaMatch) {
        setIsGeminiMode(false);  // Using local formulas
        setResult(formulaMatch[1]);
        return;
      }
    }

    // Check for units in the query, including shortforms
    const matchedUnit = findMatchingUnit(normalizedValue);
    if (matchedUnit) {
      const canonicalUnit = unitVariations[matchedUnit as keyof typeof unitVariations];
      const componentType = unitMappings[canonicalUnit as keyof typeof unitMappings];
      if (componentType) {
        setIsProcessing(true);
        try {
          const response = await processQuery(normalizedValue);
          setResult(response.result);
          setIsGeminiMode(response.isGemini);
        } catch (error) {
          console.error('Error processing query:', error);
          setResult('Error processing query');
        }
        setIsProcessing(false);
        return;
      }
    }

    // Fallback to general query processing
    if (!isProcessableQuery(normalizedValue)) return;

    setIsProcessing(true);
    try {
      const response = await processQuery(normalizedValue);
      setResult(response.result);
      setIsGeminiMode(response.isGemini);
    } catch (error) {
      console.error('Error processing query:', error);
      setResult('Error processing query');
    }
    setIsProcessing(false);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (!value || !value.trim()) {
      onSearch('');
      if (onQueryChange) onQueryChange('');
      setResult(null); // Clear result when input is empty
      setIsGeminiMode(false); // Reset Gemini mode
      return;
    }

    // Only filter cards if not in AI mode
    if (!isGeminiMode) {
      if (onQueryChange) onQueryChange(value);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setResult(null);
    setIsGeminiMode(false);
    onSearch('');
    if (onQueryChange) onQueryChange('');
  };

  // Update button visibility logic
  const showAskAIButton = inputValue && 
    !hasMatchingCard && 
    !isProcessing && 
    !result && 
    !isGeminiMode && 
    isProcessableQuery(inputValue);

  return (
    <div className="w-full space-y-4 block">  {/* Changed: Added 'block' to ensure visibility */}
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 min-w-[200px]">  {/* Added min-width to prevent collapse */}
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              id={id} 
              className="peer pe-9 ps-9 w-full" // Added w-full to maintain width
              placeholder="Search or ask AI for a calculation..."
              value={inputValue}
              autoComplete="off"
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  handleClear();
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  processInputQuery(inputValue);
                }
              }}
            />
            {inputValue && (
              <button
                onClick={handleClear}
                className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {showAskAIButton && (
            <ButtonColorful
              label="Ask AI"
              onClick={() => processInputQuery(inputValue)}
              type="button"
              className="min-w-[100px] whitespace-nowrap" // Added whitespace-nowrap
            />
          )}
        </div>
      </div>

      {isProcessing ? (
        <div className="rounded-lg border text-card-foreground shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm font-medium">Processing your query...</p>
            </div>
          </div>
        </div>
      ) : result && (
        <div className="w-full rounded-lg border text-card-foreground bg-muted/50 shadow-sm hover:shadow-md transition-all relative">
          <ScrollArea className="w-full whitespace-nowrap px-4">
            <div className="py-6 md:py-14 mb-3 flex justify-center items-center mx-auto">
              {(result.trim().startsWith("$") && result.trim().endsWith("$")) || isComplexFormula(result) ? (
                <LatexAurora 
                formula={result}
                className={cn(
                  "font-bold tracking-wide",
                  "text-xs sm:text-xxs md:text-2xl lg:text-3xl", // Responsive font sizes
                  "w-full text-center px-2" // Ensure full width and center alignment
                )}
              />
              ) : (
              <AuroraText className="font-bold tracking-wide text-4xl sm:text-5xl py-2">
                {result}
              </AuroraText>
              )}
            </div>
            <ScrollBar orientation="horizontal" className="mt-2" />
          </ScrollArea>
          {isGeminiMode && (
            <div className="absolute bottom-2 left-2">
                  <Badge variant="outline" className="gap-1.5">
                   <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true"></span>
                    Caution: AI can make Mistakes
                  </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

