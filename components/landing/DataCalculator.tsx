'use client'

import React, { useState, useEffect } from "react";
import { Database } from "lucide-react"; // Changed icon
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

const units = [
  { name: "Bytes", symbol: "B" },
  { name: "Kilobytes", symbol: "KB" },
  { name: "Megabytes", symbol: "MB" },
  { name: "Gigabytes", symbol: "GB" },
  { name: "Terabytes", symbol: "TB" },
  { name: "Petabytes", symbol: "PB" },
];

function convertData(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;

  // Convert to bytes first (base unit)
  let bytes: number;

  // Convert from any unit to bytes
  switch (fromUnit) {
    case "Bytes": bytes = value;
      break;
    case "Kilobytes": bytes = value * 1024;
      break;
    case "Megabytes": bytes = value * 1024 * 1024;
      break;
    case "Gigabytes": bytes = value * 1024 * 1024 * 1024;
      break;
    case "Terabytes": bytes = value * 1024 * 1024 * 1024 * 1024;
      break;
    case "Petabytes": bytes = value * 1024 * 1024 * 1024 * 1024 * 1024;
      break;
    default: throw new Error("Unsupported unit");
  }

  // Convert from bytes to target unit
  switch (toUnit) {
    case "Bytes": return bytes;
    case "Kilobytes": return bytes / 1024;
    case "Megabytes": return bytes / (1024 * 1024);
    case "Gigabytes": return bytes / (1024 * 1024 * 1024);
    case "Terabytes": return bytes / (1024 * 1024 * 1024 * 1024);
    case "Petabytes": return bytes / (1024 * 1024 * 1024 * 1024 * 1024);
    default: throw new Error("Unsupported unit");
  }
}

export function DataCalculator() {
  const [inputValue, setInputValue] = useState<string>("0");
  const [fromUnit, setFromUnit] = useState<string>("Megabytes");
  const [toUnit, setToUnit] = useState<string>("Gigabytes");
  const [convertedValue, setConvertedValue] = useState<number>(0);

  useEffect(() => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      const result = convertData(numericValue, fromUnit, toUnit);
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
              <Database className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
                    <MorphingDialogTitle className="text-md text-gray-700 dark:text-gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]">
            Data Storage Converter
          </MorphingDialogTitle>
          <button
            type="button"
            className=" relative ml-auto flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-gray-500 transition-colors hover:bg-zinc-100 hover:text-gray-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-gray-500 dark:hover:bg-zinc-800 dark:hover:bg-[opacity-0.01] dark:hover:text-gray-50 dark:focus-visible:ring-zinc-500"
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
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]"
        >
          {/* Dialog Content */}
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Data Storage Converter
            </MorphingDialogTitle>
            <div className="mt-4 flex flex-col gap-3 items-center">

              {/* From and To Unit Pickers with Swap Button */}
              <div className="flex items-center justify-between w-full gap-2">
                <div className="flex flex-col w-full">
                  <label className="pb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    From
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {fromUnit} {getUnitSymbol(fromUnit)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-2 max-h-[400px] overflow-y-auto" align="start">
                      <div className="grid grid-cols-2 gap-2">
                        {units.map((unit) => (
                          <Button
                            key={unit.name}
                            variant="ghost"
                            onClick={() => setFromUnit(unit.name)}
                            className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                          >
                            <span className="text-left">{unit.name}</span>
                            <span className="ml-2 text-gray-500 shrink-0">
                              {unit.symbol}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Swap Button */}
                <div className="pt-5">
                <Button 
                variant="ghost"
                onClick={handleSwapUnits} className="my-2">
                  <ArrowUpDown className="w-5 h-5" />
                </Button>
                </div>
                <div className="flex flex-col w-full">
                  <label className="pb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    To
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {toUnit} {getUnitSymbol(toUnit)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-2 max-h-[400px] overflow-y-auto" align="start">
                      <div className="grid grid-cols-2 gap-2">
                        {units.map((unit) => (
                          <Button
                            key={unit.name}
                            variant="ghost"
                            onClick={() => setToUnit(unit.name)}
                            className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                          >
                            <span className="text-left">{unit.name}</span>
                            <span className="ml-2 text-gray-500 shrink-0">
                              {unit.symbol}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Input Value */}
              <div className="flex items-center justify-between w-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Value
                </label>
                <Input
                  type="text"
                  placeholder="0"
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-[400px] p-2 border border-gray-300 rounded-md"
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

