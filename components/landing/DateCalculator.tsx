'use client'

import React, { useState } from "react";
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
} from "date-fns";
import { CakeIcon } from "lucide-react";;
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { AuroraText } from "@/components/ui/aurora-text";

export function DateCalculator() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("12:00:00");

  const handleTimeChange = (newTime: string) => {
    setTime(newTime);
    if (date) {
      const [hours, minutes, seconds] = newTime.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, seconds);
      setDate(newDate);
    }
  };

  // Calculate differences
  const yearsDiff = date && new Date(date) ? differenceInYears(new Date(date), date) : 0;
  const monthsDiff = date && new Date(date) ? differenceInMonths(new Date(date), date) % 12 : 0;
  const daysDiff = date && new Date(date) ? differenceInDays(new Date(date), date) % 30 : 0;

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
              <CakeIcon className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]">
            Date Calculator
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
          style={{
            borderRadius: "24px",
          }}
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-neutral-950 sm:w-[500px]"
        >
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Date Calculator
            </MorphingDialogTitle>
            
                        {/* Date inputs responsive layout */}
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-medium text-gray-400 dark:text-gray-400">
                  Date
                </label>
                <div className="rounded-lg border border-border">
                  <Calendar 
                    mode="single" 
                    selected={date} 
                    onSelect={setDate} 
                    showTimePicker={true}
                    defaultTime={time}
                    onTimeChange={handleTimeChange}
                  />
                </div>
              </div>
            </div>


            {/* Three containers for Year, Month, Days */}
            <div className="mt-6 grid grid-cols-3 gap-1.5 pb-4">
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-l-3xl rounded-r-md p-4 text-center">
                <p className="text-lg text-gray-50">Years</p>
                <AuroraText className="text-3xl font-bold mt-2">{yearsDiff}</AuroraText>
              </div>
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-md p-4 text-center">
                <p className="text-lg text-gray-50">Months</p>
                <AuroraText className="text-3xl font-bold mt-2">{monthsDiff}</AuroraText>
              </div>
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-r-3xl rounded-l-md p-4 text-center">
                <p className="text-lg text-gray-50">Days</p>
                <AuroraText className="text-3xl font-bold mt-2">{daysDiff}</AuroraText>
              </div>
            </div>


          </div>
          <MorphingDialogClose className="text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

