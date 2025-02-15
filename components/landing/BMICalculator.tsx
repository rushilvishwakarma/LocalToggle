'use client'

import React, { useState, useEffect, useId } from "react";
import { Calculator, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CakeIcon } from "lucide-react";;
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { AuroraText } from "@/components/ui/aurora-text"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog';
import { PlusIcon } from 'lucide-react';

const weightUnits = [
  { name: "Kilograms", symbol: "kg" },
  { name: "Pounds", symbol: "lbs" },
];

const heightUnits = [
  { name: "Centimeters", symbol: "cm" },
  { name: "Meters", symbol: "m" },
  { name: "Feet", symbol: "ft" },
  { name: "Inches", symbol: "in" },
];

export function BMICalculator() {
  const weightId = useId();
  const heightId = useId();
  const [weightValue, setWeightValue] = useState<string>("");
  const [heightValue, setHeightValue] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<string>("Kilograms");
  const [heightUnit, setHeightUnit] = useState<string>("Centimeters");
  const [bmi, setBMI] = useState<number>(0);

  const getUnitSymbol = (unitName: string) => {
    const unit = [...weightUnits, ...heightUnits].find(u => u.name === unitName);
    return unit ? unit.symbol : "";
  };

  const convertToMetric = (value: number, unit: string): number => {
    switch(unit) {
      case "Pounds": return value * 0.453592; // to kg
      case "Feet": return value * 30.48; // to cm
      case "Inches": return value * 2.54; // to cm
      case "Meters": return value * 100; // to cm
      default: return value;
    }
  };

  const validateNumericInput = (value: string): string => {
    // Allow empty string, digits, and one decimal point
    const regex = /^\d*\.?\d*$/;
    return regex.test(value) ? value : weightValue;
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = validateNumericInput(e.target.value);
    setWeightValue(newValue);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = validateNumericInput(e.target.value);
    setHeightValue(newValue);
  };

  useEffect(() => {
    if (weightValue && heightValue) {
      const weightNum = parseFloat(weightValue);
      const heightNum = parseFloat(heightValue);
      
      if (!isNaN(weightNum) && !isNaN(heightNum) && weightNum > 0 && heightNum > 0) {
        const weightInKg = convertToMetric(weightNum, weightUnit);
        const heightInCm = convertToMetric(heightNum, heightUnit);
        const heightInM = heightInCm / 100;
        const bmiValue = weightInKg / (heightInM * heightInM);
        setBMI(Math.round(bmiValue * 10) / 10);
      } else {
        setBMI(0);
      }
    } else {
      setBMI(0);
    }
  }, [weightValue, heightValue, weightUnit, heightUnit]);

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
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
              <Calculator className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
           <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]sm:whitespace-nowrap max-w-[6.5rem]">
            BMI Calculator
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
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50 text-left">
              BMI Calculator
            </MorphingDialogTitle>
            <div className="mt-6 flex flex-col gap-3 items-center">
              {/* Weight Input */}
              <div className="space-y-2 w-full">
                <label htmlFor={weightId} className="mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400 mb-2">
                  Weight
                </label>
                <div className="relative">
                  <Input
                    id={weightId}
                    className="pe-24"
                    placeholder="Enter weight"
                    type="text"
                    inputMode="numeric"
                    value={weightValue}
                    onChange={handleWeightChange}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-24 items-center justify-between rounded-e-lg border-l border-input bg-transparent px-3 text-sm text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>{getUnitSymbol(weightUnit)}</span>
                        <ChevronDown size={16} strokeWidth={2} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[140px] p-2 max-h-[400px] overflow-y-auto" align="end">
                      <div className="grid grid-cols-1 gap-2">
                        {weightUnits.map((unit) => (
                          <Button
                            key={unit.name}
                            variant="ghost"
                            onClick={() => setWeightUnit(unit.name)}
                            className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                          >
                            <span className="text-left">{unit.name}</span>
                            <span className="ml-2 text-gray-400 shrink-0">
                              {unit.symbol}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Height Input */}
              <div className="space-y-2 w-full">
                <label htmlFor={heightId} className="mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400 mb-2">
                  Height
                </label>
                <div className="relative">
                  <Input
                    id={heightId}
                    className="pe-24"
                    placeholder="Enter height"
                    type="text"
                    inputMode="numeric"
                    value={heightValue}
                    onChange={handleHeightChange}
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-24 items-center justify-between rounded-e-lg border-l border-input bg-transparent px-3 text-sm text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>{getUnitSymbol(heightUnit)}</span>
                        <ChevronDown size={16} strokeWidth={2} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[140px] p-2 max-h-[400px] overflow-y-auto" align="end">
                      <div className="grid grid-cols-1 gap-2">
                        {heightUnits.map((unit) => (
                          <Button
                            key={unit.name}
                            variant="ghost"
                            onClick={() => setHeightUnit(unit.name)}
                            className="justify-between text-xs h-auto py-2 px-3 whitespace-normal"
                          >
                            <span className="text-left">{unit.name}</span>
                            <span className="ml-2 text-gray-400 shrink-0">
                              {unit.symbol}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* BMI Result */}
              <div className="mt-4 mb-4 text-center">
                <AuroraText className="text-3xl font-bold">
                  BMI: {bmi}
                </AuroraText>
                <p className="pt-2 text-sm font-semibold tracking-wide text-gray-50/90">
                  {weightValue && heightValue ? getBMICategory(bmi) : "Body mass index"}
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

