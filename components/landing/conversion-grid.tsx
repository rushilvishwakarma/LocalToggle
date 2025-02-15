'use client'

import { AgeCalculator } from '@/components/landing/AgeCalculator';
import { TempCalculator } from '@/components/landing/TempConverter';
import { AreaCalculator } from '@/components/landing/AreaConverter';
import { DataCalculator } from '@/components/landing/DataStorageConverter';
import { DateCalculator } from '@/components/landing/DateCalculator';
import { BMICalculator } from '@/components/landing/BMICalculator';
import { DiscountCalculator } from '@/components/landing/DiscountCalculator';
import { LengthCalculator } from '@/components/landing/LengthConverter';
import { MassCalculator } from '@/components/landing/MassConverter';
import { NumeralSystemConverter } from '@/components/landing/NumeralSystem';
import { SpeedConverter } from '@/components/landing/SpeedConverter';
import { VolumeCalculator } from '@/components/landing/VolumeConverter';
import { TimeConverter } from '@/components/landing/TimeConverter';
import TagSearch from '@/components/smart-search';
import { useState } from 'react';
import { Option } from '@/components/ui/multiselect';
import { YearOfBirthCalculator } from "@/components/landing/YearOfBirthCalculator";

// Define component tags with categories
const tagCategories = {
  type: ['calculator', 'converter'],
  domain: ['math', 'finance', 'health', 'tech', 'programming', 'personal', 'shopping'],
  unit: ['time', 'date', 'temperature', 'length', 'mass', 'volume', 'speed', 'area', 'bytes'],
  measurement: ['metric', 'imperial', 'digital'],
} as const;

// Define units and their associated components
const unitMappings = {
  // Time units
  milliseconds: 'TimeConverter',
  seconds: 'TimeConverter',
  minutes: 'TimeConverter',
  hours: 'TimeConverter',
  days: 'TimeConverter',
  weeks: 'TimeConverter',

  // Temperature
  celsius: 'TempCalculator',
  fahrenheit: 'TempCalculator',
  kelvin: 'TempCalculator',
  rankine: 'TempCalculator',

  // Length
  millimeters: 'LengthCalculator',
  centimeters: 'LengthCalculator',
  meters: 'LengthCalculator',
  kilometers: 'LengthCalculator',
  inches: 'LengthCalculator',
  feet: 'LengthCalculator',
  yards: 'LengthCalculator',
  miles: 'LengthCalculator',

  // Mass
  grams: 'MassCalculator',
  kilograms: 'MassCalculator',
  ounces: 'MassCalculator',
  pounds: 'MassCalculator',
  stone: 'MassCalculator',
  tons: 'MassCalculator',

  // Data
  bytes: 'DataCalculator',
  kilobytes: 'DataCalculator',
  megabytes: 'DataCalculator',
  gigabytes: 'DataCalculator',
  terabytes: 'DataCalculator',
  petabytes: 'DataCalculator',

  // Area
  'square millimeters': 'AreaCalculator',
  'square centimeters': 'AreaCalculator',
  'square meters': 'AreaCalculator',
  'square kilometers': 'AreaCalculator',
  'square inches': 'AreaCalculator',
  'square feet': 'AreaCalculator',
  'square yards': 'AreaCalculator',
  'square miles': 'AreaCalculator',

  // Volume
  milliliters: 'VolumeCalculator',
  liters: 'VolumeCalculator',
  'cubic centimeters': 'VolumeCalculator',
  'cubic meters': 'VolumeCalculator',
  'cubic inches': 'VolumeCalculator',
  'cubic feet': 'VolumeCalculator',
  gallons: 'VolumeCalculator',
  quarts: 'VolumeCalculator',
  pints: 'VolumeCalculator',
  cups: 'VolumeCalculator',

  // Speed
  'meters per second': 'SpeedConverter',
  'kilometers per hour': 'SpeedConverter',
  'miles per hour': 'SpeedConverter',
  'feet per second': 'SpeedConverter',
  knots: 'SpeedConverter',

  // Date of Birth
  birth: 'YearOfBirthCalculator',
  age: 'AgeCalculator', // Changed from 'YearOfBirthCalculator' to 'AgeCalculator'
  year: 'YearOfBirthCalculator',

  // Numeral System (new mappings)
  binary: 'NumeralSystemConverter',
  hexadecimal: 'NumeralSystemConverter',
  octal: 'NumeralSystemConverter',
  decimal: 'NumeralSystemConverter',
  base2: 'NumeralSystemConverter',
  base8: 'NumeralSystemConverter',
  base10: 'NumeralSystemConverter',
  base16: 'NumeralSystemConverter'
} as const;

// Add unit variations mapping
const unitAliases = {
  // Time aliases
  'ms': 'milliseconds',
  'millisecond': 'milliseconds',
  'milliseconds': 'milliseconds',
  's': 'seconds',
  'sec': 'seconds',
  'second': 'seconds',
  'seconds': 'seconds',
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
  'wk': 'weeks',
  'wks': 'weeks',
  'week': 'weeks',
  'weeks': 'weeks',

  // Temperature aliases
  'c': 'celsius',
  '°c': 'celsius',
  'celsius': 'celsius',
  'f': 'fahrenheit',
  'fah': 'fahrenheit',
  '°f': 'fahrenheit',
  'fahrenheit': 'fahrenheit',
  'k': 'kelvin',
  'kelvin': 'kelvin',
  '°r': 'rankine',
  'rankine': 'rankine',

  // Length aliases
  'mm': 'millimeters',
  'millimeter': 'millimeters',
  'millimeters': 'millimeters',
  'cm': 'centimeters',
  'centimeter': 'centimeters',
  'centimeters': 'centimeters',
  'mtr': 'meters', // Use 'mtr' for meters to avoid conflict with minutes
  'meter': 'meters',
  'meters': 'meters',
  'km': 'kilometers',
  'kilometer': 'kilometers',
  'kilometers': 'kilometers',
  'in': 'inches',
  'inch': 'inches',
  'inches': 'inches',
  'ft': 'feet',
  'foot': 'feet',
  'feet': 'feet',
  'yd': 'yards',
  'yard': 'yards',
  'yards': 'yards',
  'mi': 'miles',
  'mile': 'miles',
  'miles': 'miles',

  // Mass aliases
  'g': 'grams',
  'gram': 'grams',
  'grams': 'grams',
  'kg': 'kilograms',
  'kilogram': 'kilograms',
  'kilograms': 'kilograms',
  'oz': 'ounces',
  'ounce': 'ounces',
  'ounces': 'ounces',
  'lb': 'pounds',
  'lbs': 'pounds',
  'pound': 'pounds',
  'pounds': 'pounds',
  'st': 'stone',
  'stone': 'stone',
  'stones': 'stone',
  'ton': 'tons',
  'tons': 'tons',

  // Data aliases
  'b': 'bytes',
  'byte': 'bytes',
  'bytes': 'bytes',
  'kb': 'kilobytes',
  'kilobyte': 'kilobytes',
  'kilobytes': 'kilobytes',
  'mb': 'megabytes',
  'megabyte': 'megabytes',
  'megabytes': 'megabytes',
  'gb': 'gigabytes',
  'gigabyte': 'gigabytes',
  'gigabytes': 'gigabytes',
  'tb': 'terabytes',
  'terabyte': 'terabytes',
  'terabytes': 'terabytes',
  'pb': 'petabytes',
  'petabyte': 'petabytes',
  'petabytes': 'petabytes',

  // Area aliases
  'sq mm': 'square millimeters',
  'mm²': 'square millimeters',
  'square millimeter': 'square millimeters',
  'square millimeters': 'square millimeters',
  'sq cm': 'square centimeters',
  'cm²': 'square centimeters',
  'square centimeter': 'square centimeters',
  'square centimeters': 'square centimeters',
  'sq m': 'square meters',
  'm²': 'square meters',
  'square meter': 'square meters',
  'square meters': 'square meters',
  'sq km': 'square kilometers',
  'km²': 'square kilometers',
  'square kilometer': 'square kilometers',
  'square kilometers': 'square kilometers',
  'sq in': 'square inches',
  'in²': 'square inches',
  'square inch': 'square inches',
  'square inches': 'square inches',
  'sq ft': 'square feet',
  'ft²': 'square feet',
  'square foot': 'square feet',
  'square feet': 'square feet',
  'sq yd': 'square yards',
  'yd²': 'square yards',
  'square yard': 'square yards',
  'square yards': 'square yards',
  'sq mi': 'square miles',
  'mi²': 'square miles',
  'square mile': 'square miles',
  'square miles': 'square miles',

  // Volume aliases
  'ml': 'milliliters',
  'milliliter': 'milliliters',
  'milliliters': 'milliliters',
  'l': 'liters',
  'liter': 'liters',
  'liters': 'liters',
  'm³': 'cubic meters',
  'cubic meter': 'cubic meters',
  'cubic meters': 'cubic meters',
  'cm³': 'cubic centimeters',
  'cubic centimeter': 'cubic centimeters',
  'cubic centimeters': 'cubic centimeters',
  'in³': 'cubic inches',
  'cubic inch': 'cubic inches',
  'cubic inches': 'cubic inches',
  'ft³': 'cubic feet',
  'cubic foot': 'cubic feet',
  'cubic feet': 'cubic feet',
  'qt': 'quarts',
  'quart': 'quarts',
  'quarts': 'quarts',
  'pt': 'pints',
  'pint': 'pints',
  'pints': 'pints',
  'cup': 'cups',
  'cups': 'cups',

  // Speed aliases
  'm/s': 'meters per second',
  'meters/second': 'meters per second',
  'km/h': 'kilometers per hour',
  'kilometers/hour': 'kilometers per hour',
  'mph': 'miles per hour',
  'miles/hour': 'miles per hour',
  'ft/s': 'feet per second',
  'fps': 'feet per second',
  'kn': 'knots',
  'knot': 'knots',
  'knots': 'knots',

  // Date of Birth aliases
  'birth': 'birth',
  'born': 'birth',
  'birthday': 'birth',
  'dob': 'dob',
  'age': 'age',

  // Numeral System aliases (new)
  'bin': 'binary',
  'b2': 'binary',
  'hex': 'hexadecimal',
  'oct': 'octal',
  'dec': 'decimal',
  'base-2': 'binary',
  'base-8': 'octal',
  'base-10': 'decimal',
  'base-16': 'hexadecimal'
} as const;

// Create formatted options for the MultipleSelector
const createTagOptions = () => {
  const options: Option[] = [];
  
  Object.entries(tagCategories).forEach(([category, tags]) => {
    options.push({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1),
      disable: true,
    });
    
    tags.forEach(tag => {
      options.push({
        value: tag,
        label: tag.charAt(0).toUpperCase() + tag.slice(1),
      });
    });
  });
  
  return options;
};

// Define component tags with their categories
const componentTags = {
  AgeCalculator: ['calculator', 'personal', 'time', 'date', 'age'],
  AreaCalculator: ['converter', 'math', 'area', 'metric', 'imperial'],
  BMICalculator: ['calculator', 'health', 'mass', 'length', 'metric', 'imperial'],
  DataCalculator: ['converter', 'tech', 'bytes', 'digital'],
  DateCalculator: ['calculator', 'time', 'date'],
  DiscountCalculator: ['calculator', 'finance', 'shopping'],
  LengthCalculator: ['converter', 'math', 'length', 'metric', 'imperial'],
  MassCalculator: ['converter', 'math', 'mass', 'metric', 'imperial'],
  NumeralSystemConverter: ['converter', 'math', 'programming', 'digital'],
  SpeedConverter: ['converter', 'math', 'speed', 'metric', 'imperial'],
  TempCalculator: ['converter', 'temperature', 'metric', 'imperial'],
  TimeConverter: ['converter', 'time', 'date'],
  VolumeCalculator: ['converter', 'math', 'volume', 'metric', 'imperial'],
  YearOfBirthCalculator: ['calculator', 'personal', 'age' ,'time', 'date', 'birth'],
};

export default function HeroSection() {
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  // Filter components based on selected tags and search query
  const filterComponents = (componentName: string): boolean => {
    // If we have an active component from unit search, only show that
    if (activeComponent) {
      return componentName === activeComponent;
    }

    // If no filters are active, show all components
    if (selectedTags.length === 0 && !searchQuery) return true;

    const componentTagList = componentTags[componentName as keyof typeof componentTags];
    
    // Check if component matches all selected tags
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => componentTagList.includes(tag.value));

    // Check if component matches search query
    const matchesSearch = !searchQuery ||
      componentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      componentTagList.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTags && matchesSearch;
  };

  // Handle search query changes
  const handleQueryChange = (query: string) => {
    setSearchQuery(query);
    
    if (!query) {
      setActiveComponent(null);
      return;
    }

    // Normalize the query and split into words
    const queryWords = query.toLowerCase().split(/\s+/);
    
    // Check each word against unit aliases and original units
    for (const word of queryWords) {
      // Check aliases first
      const canonicalUnit = unitAliases[word as keyof typeof unitAliases];
      if (canonicalUnit && unitMappings[canonicalUnit as keyof typeof unitMappings]) {
        setActiveComponent(unitMappings[canonicalUnit as keyof typeof unitMappings]);
        return;
      }
      
      // Check direct unit matches
      if (unitMappings[word as keyof typeof unitMappings]) {
        setActiveComponent(unitMappings[word as keyof typeof unitMappings]);
        return;
      }
    }

    // If no unit match found, clear active component
    setActiveComponent(null);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSelectedTags([]);
      setSearchQuery('');
      setActiveComponent(null);
      return;
    }
    // Convert string query to Option[] format if needed
    const tag = { value: query, label: query };
    setSelectedTags([tag]);
  };

  return (
    <section className="min-h-screen pt-6 pb-2 relative mx-auto mt-14 max-w-5xl px-6 text-center md:px-8">
      <div className="mb-3 mx-auto">
        <TagSearch 
          onSearch={handleSearch}
          onQueryChange={handleQueryChange}
          placeholder="Search by units, operations, or tags (e.g., meters, celsius, +)"
          allTags={Object.values(tagCategories).flat()}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
        {filterComponents('AgeCalculator') && (
          <div className="w-full">
            <AgeCalculator />
          </div>
        )}

        {filterComponents('YearOfBirthCalculator') && (
          <div className="w-full">
            <YearOfBirthCalculator />
          </div>
        )}

        {filterComponents('AreaCalculator') && (
          <div className="w-full">
            <AreaCalculator />
          </div>
        )}

        {filterComponents('BMICalculator') && (
          <div className="w-full">
            <BMICalculator />
          </div>
        )}

        {filterComponents('DataCalculator') && (
          <div className="w-full">
            <DataCalculator />
          </div>
        )}

        {filterComponents('DateCalculator') && (
          <div className="w-full">
            <DateCalculator />
          </div>
        )}

        {filterComponents('DiscountCalculator') && (
          <div className="w-full">
            <DiscountCalculator />
          </div>
        )}

        {filterComponents('LengthCalculator') && (
          <div className="w-full">
            <LengthCalculator />
          </div>
        )}

        {filterComponents('MassCalculator') && (
          <div className="w-full">
            <MassCalculator />
          </div>
        )}

        {filterComponents('NumeralSystemConverter') && (
          <div className="w-full">
            <NumeralSystemConverter />
          </div>
        )}

        {filterComponents('SpeedConverter') && (
          <div className="w-full">
            <SpeedConverter />
          </div>
        )}

        {filterComponents('TempCalculator') && (
          <div className="w-full">
            <TempCalculator />
          </div>
        )}

        {filterComponents('TimeConverter') && (
          <div className="w-full">
            <TimeConverter />
          </div>
        )}

        {filterComponents('VolumeCalculator') && (
          <div className="w-full">
            <VolumeCalculator />
          </div>
        )}

      </div>
    </section>
  );
}
