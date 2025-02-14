'use client'

import React, { useState, useEffect } from "react";
import { Gauge } from "lucide-react";  // Changed to Gauge icon
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
import { AuroraText } from "@/components/ui/aurora-text";

const speedUnits = [
  { name: "Light Speed", symbol: "c", factor: 299792458 },
  { name: "Mach", symbol: "Ma", factor: 340.3 },
  { name: "Meters per Second", symbol: "m/s", factor: 1 },
  { name: "Kilometers per Hour", symbol: "km/h", factor: 1/3.6 },
  { name: "Kilometers per Second", symbol: "km/s", factor: 1000 },
  { name: "Knots", symbol: "kn", factor: 0.514444 },
  { name: "Miles per Hour", symbol: "mph", factor: 0.44704 },
  { name: "Feet per Second", symbol: "fps", factor: 0.3048 },
  { name: "Inches per Second", symbol: "ips", factor: 0.0254 }
];

function convertSpeed(value: number, fromUnit: string, toUnit: string): number {
  const fromFactor = speedUnits.find(u => u.symbol === fromUnit)?.factor || 1;
  const toFactor = speedUnits.find(u => u.symbol === toUnit)?.factor || 1;
  return (value * fromFactor) / toFactor;
}

export function SpeedConverter() {
  const [inputValue, setInputValue] = useState<string>("");  // Changed from "0" to ""
  const [fromUnit, setFromUnit] = useState<string>("m/s");
  const [toUnit, setToUnit] = useState<string>("km/h");
  const [convertedValue, setConvertedValue] = useState<string>("0");

  useEffect(() => {
    const numValue = parseFloat(inputValue) || 0;
    const result = convertSpeed(numValue, fromUnit, toUnit);
    setConvertedValue(result.toFixed(6));
  }, [inputValue, fromUnit, toUnit]);

  const handleSwapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value) || value === '') {
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
            <div className="flex items-center justify-center bg-white bg-opacity-[0.05] w-16 h-16 rounded-full">
              <Gauge className="text-gray-400 w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]sm:whitespace-nowrap max-w-[6.5rem]">
            Speed Converter
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
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Speed Converter
            </MorphingDialogTitle>
            <div className="mt-6 flex flex-col gap-3 items-center">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                <div className="flex flex-col w-full">
                  <label className="pb-2 mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    From
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex gap-2 items-center w-full">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <div className="flex flex-col w-full overflow-hidden">
                            <span className="truncate">
                              {speedUnits.find(u => u.symbol === fromUnit)?.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {fromUnit}
                            </span>
                          </div>
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0" align="start">
                      <div className="p-2 grid grid-cols-2 gap-1">
                        {speedUnits.map((unit) => (
                          <Button
                            key={unit.symbol}
                            variant="ghost"
                            onClick={() => setFromUnit(unit.symbol)}
                            className="w-full justify-start px-3 py-2 text-left"
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium truncate">{unit.name}</span>
                              <span className="text-gray-400 text-xs">{unit.symbol}</span>
                            </div>
                          </Button>
                        ))}
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
                  <label className="pb-2 mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    To
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex gap-2 items-center w-full">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <div className="flex flex-col w-full overflow-hidden">
                            <span className="truncate">
                              {speedUnits.find(u => u.symbol === toUnit)?.name}
                            </span>
                            <span className="text-xs text-gray-400">
                              {toUnit}
                            </span>
                          </div>
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[350px] p-0" align="start">
                      <div className="p-2 grid grid-cols-2 gap-1">
                        {speedUnits.map((unit) => (
                          <Button
                            key={unit.symbol}
                            variant="ghost"
                            onClick={() => setToUnit(unit.symbol)}
                            className="w-full justify-start px-3 py-2 text-left"
                          >
                            <div className="flex flex-col items-start">
                              <span className="font-medium truncate">{unit.name}</span>
                              <span className="text-gray-400 text-xs">{unit.symbol}</span>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-2">
                <label className="mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                  Value
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter speed"  // Added meaningful placeholder
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full sm:w-[400px] p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="mt-4 mb-4 text-center">
                <AuroraText className="text-3xl font-bold">
                  {convertedValue} {toUnit}
                </AuroraText>
                <p className="pt-2 text-sm font-normal text-gray-50">
                  {speedUnits.find(u => u.symbol === toUnit)?.name}
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

