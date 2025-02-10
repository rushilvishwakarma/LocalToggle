import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";
import { useState, useId, useEffect } from "react";
import { processQuery } from "@/utils/gemini";
import { ButtonColorful } from "@/components/ui/button-colorful";

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
  'seconds', 'minutes', 'hours', 'days',
  // Temperature
  'celsius', 'fahrenheit', 'kelvin',
  // Length
  'meters', 'feet', 'inches', 'kilometers',
  // Mass
  'kilograms', 'pounds',
  // Data
  'bytes', 'kilobytes', 'megabytes',
  // Area
  'square meters', 'square feet',
  // Volume
  'liters', 'gallons',
  // Speed
  'meters per second', 'kilometers per hour', 'miles per hour',
  // Physics
  'newtons', 'joules', 'watts', 'volts', 'amperes', 'ohms',
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

// Define units and their associated components
const unitMappings = {
  // Time units
  'seconds': 'TimeConverter',
  'minutes': 'TimeConverter',
  'hours': 'TimeConverter',
  'days': 'TimeConverter',
  'date': 'DateCalculator',
  'age': 'AgeCalculator',
  
  // Temperature
  'celsius': 'TempCalculator',
  'fahrenheit': 'TempCalculator',
  'kelvin': 'TempCalculator',
  
  // Length
  'meters': 'LengthCalculator',
  'feet': 'LengthCalculator',
  'inches': 'LengthCalculator',
  'km': 'LengthCalculator',
  'miles': 'LengthCalculator',
  
  // Mass
  'kilograms': 'MassCalculator',
  'pounds': 'MassCalculator',
  'grams': 'MassCalculator',
  'ounces': 'MassCalculator',
  
  // Data
  'bytes': 'DataCalculator',
  'kb': 'DataCalculator',
  'mb': 'DataCalculator',
  'gb': 'DataCalculator',
  'binary': 'NumeralSystemConverter',
  'hex': 'NumeralSystemConverter',
  'decimal': 'NumeralSystemConverter',
  'octal': 'NumeralSystemConverter',
  
  // Area
  'square meters': 'AreaCalculator',
  'square feet': 'AreaCalculator',
  'acres': 'AreaCalculator',
  'hectares': 'AreaCalculator',
  
  // Volume
  'liters': 'VolumeCalculator',
  'gallons': 'VolumeCalculator',
  'cubic meters': 'VolumeCalculator',
  
  // Speed
  'meters per second': 'SpeedConverter',
  'kilometers per hour': 'SpeedConverter',
  'miles per hour': 'SpeedConverter',
  
  // Special calculations
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

export default function TagSearch({ onSearch, onQueryChange, placeholder, allTags, noCardsFound = false }: TagSearchProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Compute if a matching card exists from allTags
  const hasMatchingCard = allTags.some(tag =>
    tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Clear everything on ESC
        setInputValue('');
        setResult(null);
        onSearch('');
        if (onQueryChange) {
          onQueryChange('');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSearch, onQueryChange]);

  const processInputQuery = async (value: string) => {
    if (!value || !value.trim()) {
      return;
    }

    // Check for mathematical query
    const hasMathOperators = value.match(/[+\-*/%=<>≤≥≠∈∉⊂⊃∪∩→]/);
    const hasNumbers = /\d/.test(value);
    const isMathQuery = value.toLowerCase().match(/^(let|if|then|solve|find|prove|calculate|what|how)/);
    
    if ((hasMathOperators || hasNumbers || isMathQuery) && value.trim()) {
      setIsProcessing(true);
      try {
        const response = await processQuery(value);
        setResult(response);
      } catch (error) {
        console.error('Error processing query:', error);
        setResult('Error processing query');
      }
      setIsProcessing(false);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setResult(null); // Clear result first
    
    if (!value || !value.trim()) {
      onSearch(''); // Show cards when empty
      if (onQueryChange) {
        onQueryChange('');
      }
      return;
    }

    if (onQueryChange) {
      onQueryChange(value);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input id={id} className="peer pe-9 ps-9" placeholder="Search or ask AI for a calculation..."
              value={inputValue}
              autoComplete="off"
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  e.preventDefault();
                  setInputValue('');
                  setResult(null);
                  onSearch('');
                  if (onQueryChange) {
                    onQueryChange('');
                  }
                } else if (e.key === 'Enter') {
                  e.preventDefault();
                  processInputQuery(inputValue);
                }
              }}
            />
            {inputValue && (
              <button
                onClick={() => {
                  setInputValue('');
                  setResult(null);
                  onSearch('');
                  if (onQueryChange) {
                    onQueryChange('');
                  }
                }}
                className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {inputValue && !hasMatchingCard && !isProcessing && !result && (
            <ButtonColorful
              label="Ask AI"
              onClick={() => processInputQuery(inputValue)}
              type="button"
              className="min-w-[100px]" // Button already has h-10 inside ButtonColorful
            />
          )}
        </div>
      </div>

      {isProcessing ? (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm">Processing query...</p>
            </div>
          </div>
        </div>
      ) : result && (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h4 className="text-sm font-medium">Result</h4>
            <div className="mt-2 whitespace-pre-wrap text-sm">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
}

