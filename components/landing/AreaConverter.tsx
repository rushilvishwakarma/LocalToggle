'use client'

import React, { useState, useEffect } from "react";
import { Scaling } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog';
import { PlusIcon, ArrowUpDown } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const units = [
  { name: "Square Kilometers", symbol: "km²" },
  { name: "Hectares", symbol: "ha" },
  { name: "Ares", symbol: "a" },
  { name: "Square Meters", symbol: "m²" },
  { name: "Square Decimeters", symbol: "dm²" },
  { name: "Square Centimeters", symbol: "cm²" },
  { name: "Square Millimeters", symbol: "mm²" },
  { name: "Square Microns", symbol: "µm²" },
  { name: "Acres", symbol: "ac" },
  { name: "Square Miles", symbol: "mi²" },
  { name: "Square Yards", symbol: "yd²" },
  { name: "Square Feet", symbol: "ft²" },
  { name: "Square Inches", symbol: "in²" },
  { name: "Square Rods", symbol: "rd²" },
  { name: "Qing", symbol: "qing" },
  { name: "Mu", symbol: "mu" },
  { name: "Square Chi", symbol: "chi²" },
  { name: "Square Cun", symbol: "cun²" },
  { name: "Square Gongli", symbol: "gongli²" }
];

function convertArea(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;

  // Convert to square meters first (base unit)
  let squareMeters: number;

  // Convert from any unit to square meters
  switch (fromUnit) {
    case "Square Kilometers": squareMeters = value * 1000000;
      break;
    case "Hectares": squareMeters = value * 10000;
      break;
    case "Ares": squareMeters = value * 100;
      break;
    case "Square Meters": squareMeters = value;
      break;
    case "Square Decimeters": squareMeters = value * 0.01;
      break;
    case "Square Centimeters": squareMeters = value * 0.0001;
      break;
    case "Square Millimeters": squareMeters = value * 0.000001;
      break;
    case "Square Microns": squareMeters = value * 1e-12;
      break;
    case "Acres": squareMeters = value * 4046.86;
      break;
    case "Square Miles": squareMeters = value * 2589988.11;
      break;
    case "Square Yards": squareMeters = value * 0.836127;
      break;
    case "Square Feet": squareMeters = value * 0.092903;
      break;
    case "Square Inches": squareMeters = value * 0.00064516;
      break;
    case "Square Rods": squareMeters = value * 25.2929;
      break;
    case "Qing": squareMeters = value * 66666.67;
      break;
    case "Mu": squareMeters = value * 666.67;
      break;
    case "Square Chi": squareMeters = value * 0.1111;
      break;
    case "Square Cun": squareMeters = value * 0.001111;
      break;
    case "Square Gongli": squareMeters = value * 1000000;
      break;
    default: throw new Error("Unsupported unit");
  }

  // Convert from square meters to target unit
  switch (toUnit) {
    case "Square Kilometers": return squareMeters / 1000000;
    case "Hectares": return squareMeters / 10000;
    case "Ares": return squareMeters / 100;
    case "Square Meters": return squareMeters;
    case "Square Decimeters": return squareMeters * 100;
    case "Square Centimeters": return squareMeters * 10000;
    case "Square Millimeters": return squareMeters * 1000000;
    case "Square Microns": return squareMeters * 1e12;
    case "Acres": return squareMeters / 4046.86;
    case "Square Miles": return squareMeters / 2589988.11;
    case "Square Yards": return squareMeters / 0.836127;
    case "Square Feet": return squareMeters / 0.092903;
    case "Square Inches": return squareMeters / 0.00064516;
    case "Square Rods": return squareMeters / 25.2929;
    case "Qing": return squareMeters / 66666.67;
    case "Mu": return squareMeters / 666.67;
    case "Square Chi": return squareMeters / 0.1111;
    case "Square Cun": return squareMeters / 0.001111;
    case "Square Gongli": return squareMeters / 1000000;
    default: throw new Error("Unsupported unit");
  }
}

export function AreaCalculator() {
  const [inputValue, setInputValue] = useState<string>("");  // Changed from "0" to ""
  const [fromUnit, setFromUnit] = useState<string>("Square Meters");
  const [toUnit, setToUnit] = useState<string>("Square Feet");
  const [convertedValue, setConvertedValue] = useState<number>(0);

  useEffect(() => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      const result = convertArea(numericValue, fromUnit, toUnit);
      setConvertedValue(result);
    } else {
      setConvertedValue(0);
    }
  }, [inputValue, fromUnit, toUnit]);

  const getUnitSymbol = (unitName: string) => {
    const unit = units.find(u => u.name === unitName);
    return unit ? unit.symbol : '';
  };

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[+-]?\d*\.?\d*$/.test(value) || value === '' || value === '-' || value === '+') {
      setInputValue(value);
    }
  };

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: "12px",
        }}
        className="flex flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-white dark:bg-opacity-[0.01]"
      >
        <div className="py-3 px-3">
          <div className="flex flex-col gap-1 text-left">
            {/* Title */}
            <div className="flex items-center justify-center bg-white bg-opacity-[0.05] w-16 h-16 rounded-full">
              <Scaling className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
             <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]">
            Area Converter
          </MorphingDialogTitle>
          <button
            type="button"
            className=" relative ml-auto flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-gray-400 transition-colors hover:bg-zinc-100 hover:text-gray-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-800 dark:hover:bg-[opacity-0.01] dark:hover:text-gray-50 dark:focus-visible:ring-zinc-500"
            aria-label="Open dialog"
          >
            <PlusIcon size={12} />
          </button>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: "24px",
          }}
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-neutral-950 sm:w-[500px]"
        >
          {/* Dialog Content */}
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Area Converter
            </MorphingDialogTitle>
            <div className="mt-4 flex flex-col gap-3 items-center">

              {/* From and To Unit Pickers with Swap Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                <div className="flex flex-col w-full">
                  <label className="pb-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    From
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {fromUnit} 
                        <span className="text-xs text-gray-400">
                        {getUnitSymbol(fromUnit)}
                            </span>
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-[280px] sm:w-[600px] p-0" align="start">
                      {/* Mobile view with ScrollArea */}
                      <div className="block sm:hidden">
                        <ScrollArea className="h-[300px] p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {units.map((unit) => (
                              <Button
                                key={unit.name}
                                variant="ghost"
                                onClick={() => setFromUnit(unit.name)}
                                className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                              >
                                <span className="text-left">{unit.name}</span>
                                <span className="ml-2 text-gray-400 shrink-0">
                                  {unit.symbol}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      {/* Desktop view without ScrollArea */}
                      <div className="hidden sm:block p-4">
                        <div className="grid grid-cols-4 gap-2">
                          {units.map((unit) => (
                            <Button
                              key={unit.name}
                              variant="ghost"
                              onClick={() => setFromUnit(unit.name)}
                              className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                            >
                              <span className="text-left">{unit.name}</span>
                              <span className="ml-2 text-gray-400 shrink-0">
                                {unit.symbol}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center w-full sm:w-auto py-2 sm:pt-5">
                  <Button 
                    variant="ghost"
                    onClick={handleSwapUnits}
                    className="rotate-90 sm:rotate-0"
                  >
                    <ArrowUpDown className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex flex-col w-full">
                  <label className="pb-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    To
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {toUnit} 
                        <span className="text-xs text-gray-400">
                        {getUnitSymbol(toUnit)}
                            </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] sm:w-[600px] p-0" align="start">
                      <div className="block sm:hidden">
                        <ScrollArea className="h-[300px] p-4">
                          <div className="grid grid-cols-2 gap-2">
                            {units.map((unit) => (
                              <Button
                                key={unit.name}
                                variant="ghost"
                                onClick={() => setToUnit(unit.name)}
                                className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                              >
                                <span className="text-left">{unit.name}</span>
                                <span className="ml-2 text-gray-400 shrink-0">
                                  {unit.symbol}
                                </span>
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                      <div className="hidden sm:block p-4">
                        <div className="grid grid-cols-4 gap-2">
                          {units.map((unit) => (
                            <Button
                              key={unit.name}
                              variant="ghost"
                              onClick={() => setToUnit(unit.name)}
                              className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                            >
                              <span className="text-left">{unit.name}</span>
                              <span className="ml-2 text-gray-400 shrink-0">
                                {unit.symbol}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Input Value */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
                <label className="block text-sm font-medium text-gray-400 dark:text-gray-400">
                  Value
                </label>
                <Input
                  type="text"
                  placeholder="Enter area"  // Added meaningful placeholder
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full sm:w-[400px] p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Converted Value */}
              <div className="mt-4 mb-4 text-center">
                <p className="text-3xl font-bold text-amber-400">
                  {convertedValue} {getUnitSymbol(toUnit)}
                </p>
                <p className="pt-2 text-sm font-normal text-gray-50">
                  {toUnit}
                </p>
              </div>
            </div>
          </div>
          <MorphingDialogClose className="text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

