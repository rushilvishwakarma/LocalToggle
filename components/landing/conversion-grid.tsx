'use client'

import { AgeCalculator } from '@/components/landing/AgeCalculator';
import { TempCalculator } from '@/components/landing/TempConverter';
import { AreaCalculator } from '@/components/landing/AreaConverter';
import { DataCalculator } from '@/components/landing/DataCalculator';
import { DateCalculator } from '@/components/landing/DateCalculator';
import { BMICalculator } from '@/components/landing/BMICalculator';
import { DiscountCalculator } from '@/components/landing/DiscountCalculator';
import { LengthCalculator } from '@/components/landing/LengthConverter';
import { MassCalculator } from '@/components/landing/MassConverter';
import { NumeralSystemConverter } from '@/components/landing/NumeralSystem';
import { SpeedConverter } from '@/components/landing/SpeedConverter';
import { VolumeCalculator } from '@/components/landing/VolumeConverter';
import { TimeConverter } from '@/components/landing/TimeConverter';
import TagSearch from '@/components/tag-search';
import { useState } from 'react';
import { Option } from '@/components/ui/multiselect';

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
  seconds: 'TimeConverter',
  minutes: 'TimeConverter',
  hours: 'TimeConverter',
  days: 'TimeConverter',
  
  // Temperature
  celsius: 'TempCalculator',
  fahrenheit: 'TempCalculator',
  kelvin: 'TempCalculator',
  
  // Length
  meters: 'LengthCalculator',
  feet: 'LengthCalculator',
  inches: 'LengthCalculator',
  
  // Mass
  kilograms: 'MassCalculator',
  pounds: 'MassCalculator',
  
  // Data
  bytes: 'DataCalculator',
  kilobytes: 'DataCalculator',
  megabytes: 'DataCalculator',
  
  // Area
  'square meters': 'AreaCalculator',
  'square feet': 'AreaCalculator',
  
  // Volume
  liters: 'VolumeCalculator',
  gallons: 'VolumeCalculator',
  
  // Speed
  'meters per second': 'SpeedConverter',
  'kilometers per hour': 'SpeedConverter',
  'miles per hour': 'SpeedConverter'
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
  AgeCalculator: ['calculator', 'personal', 'time', 'date'],
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
  VolumeCalculator: ['converter', 'math', 'volume', 'metric', 'imperial']
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
    
    // Check if the query contains any known units
    const lowercaseQuery = query.toLowerCase();
    const matchedUnit = Object.keys(unitMappings).find(unit => 
      lowercaseQuery.includes(unit.toLowerCase())
    );

    if (matchedUnit) {
      setActiveComponent(unitMappings[matchedUnit as keyof typeof unitMappings]);
    } else {
      setActiveComponent(null);
    }
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
    <section className="min-h-screen pt-6 pb-2 relative mx-auto mt-16 max-w-5xl px-6 text-center md:px-8">
      <div className="mb-8 max-w-md mx-auto">
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
