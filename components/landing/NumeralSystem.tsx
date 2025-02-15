'use client'

import React, { useState, useEffect } from "react";
import { Binary } from "lucide-react";  // Changed from Weight to Binary
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
import { Badge } from "@/components/ui/badge"
import { AuroraText } from "@/components/ui/aurora-text";
import SwapButton from "@/components/ui/swap-button";
const systems = [
  { name: "Binary", base: 2, prefix: "BIN", notation: "0–1" },
  { name: "Octal", base: 8, prefix: "OCT", notation: "0–7" },
  { name: "Decimal", base: 10, prefix: "DEC", notation: "0–9" },
  { name: "Hexadecimal", base: 16, prefix: "HEX", notation: "0–F" }
];

// Add this constant after the systems array
const MAX_INPUT_LENGTH = 16;

function formatWithSpaces(str: string): string {
  const parts = str.split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}

function convertNumber(value: string, fromBase: number, toBase: number): string {
  try {
    if (!value) return '0';
    
    const [intPart, fracPart] = value.split('.');
    
    // Convert integer part to decimal
    const intDecimal = intPart ? parseInt(intPart, fromBase) : 0;
    if (isNaN(intDecimal)) return '0';
    
    // Handle fractional part if exists
    let fracDecimal = 0;
    if (fracPart) {
      for (let i = 0; i < fracPart.length; i++) {
        const digit = parseInt(fracPart[i], fromBase);
        if (isNaN(digit)) continue;
        fracDecimal += digit * Math.pow(fromBase, -(i + 1));
      }
    }
    
    const totalDecimal = intDecimal + fracDecimal;
    
    // Convert to target base
    if (toBase === 10) {
      return totalDecimal.toString();
    }
    
    // Handle integer part conversion
    const resultIntPart = Math.floor(totalDecimal).toString(toBase);
    
    // Handle fractional part conversion
    let fracResult = '';
    let remainingFrac = totalDecimal % 1;
    const maxPrecision = 8;
    
    while (remainingFrac > 0 && fracResult.length < maxPrecision) {
      remainingFrac *= toBase;
      const digit = Math.floor(remainingFrac);
      fracResult += digit.toString(toBase);
      remainingFrac -= digit;
    }
    
    return fracResult ? `${resultIntPart}.${fracResult}` : resultIntPart;
  } catch (error) {
    return '0';
  }
}

function calculateBits(value: string): number {
  if (!value || value === '0') return 0;
  const [intPart, fracPart] = value.split('.');
  const intBits = intPart.replace(/^0+/, '').length;
  const fracBits = fracPart ? fracPart.length : 0;
  return intBits + (fracPart ? fracBits + 1 : 0); // +1 for decimal point
}

export function NumeralSystemConverter() {
  const [inputValue, setInputValue] = useState<string>("");
  const [fromSystem, setFromSystem] = useState<string>("Decimal");
  const [toSystem, setToSystem] = useState<string>("Binary");
  const [convertedValue, setConvertedValue] = useState<string>("0");

  useEffect(() => {
    const fromBase = systems.find(s => s.name === fromSystem)?.base || 10;
    const toBase = systems.find(s => s.name === toSystem)?.base || 2;
    const result = convertNumber(inputValue, fromBase, toBase);
    setConvertedValue(result);
  }, [inputValue, fromSystem, toSystem]);

  const getSystemPrefix = (systemName: string) => {
    const system = systems.find(s => s.name === systemName);
    return system ? system.prefix : '';
  };

  const handleSwapSystems = () => {
    setFromSystem(toSystem);
    setToSystem(fromSystem);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const fromBase = systems.find(s => s.name === fromSystem)?.base || 10;
    
    // Check input length
    if (value.length > MAX_INPUT_LENGTH) return;
    
    // Updated regex patterns to properly handle decimal points
    const validRegex = fromBase === 2 ? /^[01]*\.?[01]*$/ :
                      fromBase === 8 ? /^[0-7]*\.?[0-7]*$/ :
                      fromBase === 16 ? /^[0-9A-Fa-f]*\.?[0-9A-Fa-f]*$/ :
                      /^[0-9]*\.?[0-9]*$/;
    
    // Prevent multiple decimal points
    if ((value.match(/\./g) || []).length > 1) return;
    
    if (validRegex.test(value) || value === '') {
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
              <Binary className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]sm:whitespace-nowrap max-w-[6.5rem]">
            Number System
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
          <div className="relative px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Number System
            </MorphingDialogTitle>
            <div className="mt-6 flex flex-col gap-3 items-center">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-2">
                <div className="flex flex-col w-full">
                  <label className="pb-2 mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    From
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {fromSystem}
                        </Button>
                        <Badge variant="secondary" className="h-6 py-0.5 px-2.5 flex items-center justify-center min-w-[48px]">
                          {systems.find(s => s.name === fromSystem)?.notation}
                        </Badge>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <div className="p-2 flex flex-col gap-1">
                        {systems.map((system) => (
                          <Button
                            key={system.name}
                            variant="ghost"
                            onClick={() => setFromSystem(system.name)}
                            className="w-full justify-between items-center"
                          >
                            <span>{system.name}</span>
                            <span className="text-gray-400 text-xs">{system.prefix}</span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center w-full sm:w-auto py-2 sm:pt-9 px-3">
                  <SwapButton 
                    isVertical={true}
                    onClick={handleSwapSystems}
                    className="rotate-0 sm:rotate-90"
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className="pb-2 mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                    To
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex gap-2 items-center">
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {toSystem}
                        </Button>
                        <Badge variant="secondary" className="h-6 py-0.5 px-2.5 flex items-center justify-center min-w-[48px]">
                          {systems.find(s => s.name === toSystem)?.notation}
                        </Badge>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0" align="start">
                      <div className="p-2 flex flex-col gap-1">
                        {systems.map((system) => (
                          <Button
                            key={system.name}
                            variant="ghost"
                            onClick={() => setToSystem(system.name)}
                            className="w-full justify-between items-center"
                          >
                            <span>{system.name}</span>
                            <span className="text-gray-400 text-xs">{system.prefix}</span>
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
                  placeholder={`Enter number`}
                  value={inputValue}
                  onChange={handleInputChange}
                  className="w-full sm:w-[400px] p-2 border border-gray-300 rounded-md"
                  maxLength={MAX_INPUT_LENGTH}
                />
              </div>

              <div className="mt-4 mb-10 text-center">
                <AuroraText className="text-3xl font-bold">
                  {formatWithSpaces(convertedValue)}
                </AuroraText>
                <p className="pt-2 text-sm font-normal text-gray-50">
                  {toSystem} ({systems.find(s => s.name === toSystem)?.prefix})
                </p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="absolute bottom-4 right-4 text-xs"
            >
              Total {calculateBits(convertedValue)} bits
            </Badge>
          </div>
          <MorphingDialogClose className="text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

