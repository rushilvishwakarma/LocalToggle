'use client'

import React, { useState } from "react";
import { format, sub } from "date-fns";
import { CakeIcon, PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AuroraText } from "@/components/ui/aurora-text";
import { MorphingDialog, MorphingDialogTrigger, MorphingDialogContent, MorphingDialogTitle, MorphingDialogClose, MorphingDialogContainer } from '@/components/ui/morphing-dialog';

export function DateOfBirthCalculator() {
  const [age, setAge] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Calculate birth year based on age with validation
  const currentYear = new Date().getFullYear();

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numeric input and maximum 4 characters
    if (value && (!/^\d+$/.test(value) || value.length > 4)) {
      return;
    }

    const numAge = parseInt(value);

    // Clear error if input is empty
    if (!value) {
      setAge("");
      setError("");
      return;
    }

    // Validate age range (0-130 years)
    if (numAge < 0 || numAge > 130) {
      setError("Please enter a valid age between 0 and 130");
      setAge(value);
      return;
    }

    setError("");
    setAge(value);
  };

  const birthYear = age && !error ?
    (currentYear - parseInt(age)).toString() :
    currentYear.toString();

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <MorphingDialogTrigger
        style={{ borderRadius: "12px" }}
        className="flex flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-white dark:bg-opacity-[0.01]"
      >
        <div className="py-3 px-3">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center justify-center bg-white bg-opacity-[0.05] w-16 h-16 rounded-full">
              <CakeIcon className="text-gray-400 w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]">
            Birth Year Calculator
          </MorphingDialogTitle>
          <button
            type="button"
            className="relative ml-auto flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-gray-400 transition-colors hover:bg-zinc-100 hover:text-gray-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-900 dark:hover:bg-[opacity-0.01] dark:hover:text-gray-50 dark:focus-visible:ring-zinc-500"
          >
            <PlusIcon size={12} />
          </button>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{ borderRadius: "24px" }}
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-neutral-950 sm:w-[600px]"
        >
          <div className="flex flex-col p-6">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50 mb-6">
              Birth Year Calculator
            </MorphingDialogTitle>
            
            <label className="mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400 mb-2">
              Enter your age
            </label>
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              value={age}
              onChange={handleAgeChange}
              placeholder="Enter age (0-130)"
              className="mb-2"
              min="0"
              max="130"
              maxLength={3}
            />
            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div className="mt-2 bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-4 text-center">
              <p className="text-sm font-medium text-gray-400 mb-1">Birth Year</p>
              <AuroraText className="text-3xl font-bold">{birthYear}</AuroraText>
            </div>
          </div>
          <MorphingDialogClose className="absolute top-6 right-6 text-gray-400 hover:text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
