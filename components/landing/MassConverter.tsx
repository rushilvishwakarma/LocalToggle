'use client'

import React, { useState, useEffect } from "react";
import { Weight } from "lucide-react";  // Changed from Ruler to Weight
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
import { AuroraText } from "@/components/ui/aurora-text";
import SwapButton from "@/components/ui/swap-button";

const units = [
  { name: "Metric Tons", symbol: "t" },
  { name: "Kilograms", symbol: "kg" },
  { name: "Grams", symbol: "g" },
  { name: "Milligrams", symbol: "mg" },
  { name: "Micrograms", symbol: "µg" },
  { name: "Quintal", symbol: "q" },
  { name: "Pounds", symbol: "lb" },
  { name: "Ounces", symbol: "oz" },
  { name: "Carats", symbol: "ct" },
  { name: "Grains", symbol: "gr" },
  { name: "Long Tons", symbol: "l.t" },
  { name: "Short Tons", symbol: "sh.t" },
  { name: "US Hundredweight", symbol: "cwt (US)" },
  { name: "UK Hundredweight", symbol: "cwt (UK)" },
  { name: "Stone", symbol: "st" },
  { name: "Dram", symbol: "dr" },
  { name: "Dan", symbol: "dan" },
  { name: "Jin", symbol: "jin" },
  { name: "Qian", symbol: "qian" },
  { name: "Liang", symbol: "liang" },
  { name: "Jin (Taiwan)", symbol: "jin (TW)" }
];

function convertMass(value: number, fromUnit: string, toUnit: string): number {
  // Convert everything to grams first
  const toGrams: { [key: string]: number } = {
    "Metric Tons": 1000000,
    "Kilograms": 1000,
    "Grams": 1,
    "Milligrams": 0.001,
    "Micrograms": 0.000001,
    "Quintal": 100000,
    "Pounds": 453.59237,
    "Ounces": 28.349523125,
    "Carats": 0.2,
    "Grains": 0.06479891,
    "Long Tons": 1016046.9088,
    "Short Tons": 907184.74,
    "US Hundredweight": 45359.237,
    "UK Hundredweight": 50802.34544,
    "Stone": 6350.29318,
    "Dram": 1.7718451953125,
    "Dan": 50000,
    "Jin": 500,
    "Qian": 5,
    "Liang": 50,
    "Jin (Taiwan)": 600
  };

  const grams = value * toGrams[fromUnit];
  return grams / toGrams[toUnit];
}

export function MassCalculator() {
  const [inputValue, setInputValue] = useState<string>("");  // Changed from "0" to ""
  const [fromUnit, setFromUnit] = useState<string>("Kilograms");
  const [toUnit, setToUnit] = useState<string>("Pounds");
  const [convertedValue, setConvertedValue] = useState<number>(0);

  useEffect(() => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      const result = convertMass(numericValue, fromUnit, toUnit);
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
              <Weight className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]sm:whitespace-nowrap max-w-[6.5rem]">
            Mass Converter
          </MorphingDialogTitle>
          <button
            type="button"
            className=" relative ml-auto flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-gray-400 transition-colors hover:bg-zinc-100 hover:text-gray-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-900 dark:hover:bg-[opacity-0.01] dark:hover:text-gray-50 dark:focus-visible:ring-zinc-500"
            aria-label="Open dialog"
          >
            <PlusIcon size={12} />
          </button>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          onOpenAutoFocus={(event) => event.preventDefault()}
          style={{
            borderRadius: "24px",
          }}
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-neutral-950 sm:w-[500px]"
        >
          {/* Dialog Content */}
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Mass Converter
            </MorphingDialogTitle>
            <div className="mt-6 flex flex-col gap-3 items-center">

              {/* From and To Unit Pickers with Swap Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                <div className="flex flex-col w-full">
                  <label className="pb-2 mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    From
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                                            <Button
                                              variant="outline"
                                              className="w-[180px] w-full justify-start text-left font-normal"
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
                        <ScrollArea className="h-[350px] p-4">
                          <div className="grid grid-cols-1 gap-2">
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
                        <div className="grid grid-cols-3 gap-2">
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
                <div className="flex justify-center w-full sm:w-auto py-2 sm:pt-9 px-3">
                  <SwapButton 
                    isVertical={true}
                    onClick={handleSwapUnits}
                    className="rotate-0 sm:rotate-90"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="pb-2 mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    To
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[180px] w-full justify-start text-left font-normal"
                      >
                        {toUnit}
                        <span className="text-xs text-gray-400">
                        {getUnitSymbol(toUnit)}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] sm:w-[600px] p-0" align="start">
                      {/* Mobile view with ScrollArea */}
                      <div className="block sm:hidden">
                        <ScrollArea className="h-[350px] p-4">
                          <div className="grid grid-cols-1 gap-2">
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
                      {/* Desktop view without ScrollArea */}
                      <div className="hidden sm:block p-4">
                        <div className="grid grid-cols-3 gap-2">
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
                <label className="mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                  Value
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter mass"  // Added meaningful placeholder
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Converted Value */}
              <div className="mt-4 mb-4 text-center">
                <AuroraText className="text-3xl font-bold">
                  {convertedValue} {getUnitSymbol(toUnit)}
                </AuroraText>
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

