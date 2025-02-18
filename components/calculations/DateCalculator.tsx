'use client'

import React, { useState } from "react";
import { format, differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { CalendarDate, parseDate } from "@internationalized/date";
import { CakeIcon, PlusIcon } from "lucide-react";
import { DateRangePicker, Group, I18nProvider } from "react-aria-components";
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac";
import { MorphingDialog, MorphingDialogTrigger, MorphingDialogContent, MorphingDialogTitle, MorphingDialogClose, MorphingDialogContainer } from '@/components/ui/morphing-dialog';
import { AuroraText } from "@/components/ui/aurora-text";
import { cn } from "@/lib/utils";

type DateRange = {
  start: CalendarDate;
  end: CalendarDate;
} | null;

export function DateCalculator() {
  const [fromDate, setFromDate] = useState<CalendarDate | null>(null);
  const [toDate, setToDate] = useState<CalendarDate | null>(null);

  // Calculate differences using the native Date objects, handling null values
  const calculateDifference = () => {
    if (!fromDate || !toDate) return { years: 0, months: 0, days: 0 };
    
    try {
      const fromNativeDate = new Date(fromDate.year, fromDate.month - 1, fromDate.day);
      const toNativeDate = new Date(toDate.year, toDate.month - 1, toDate.day);
      
      return {
        years: differenceInYears(toNativeDate, fromNativeDate),
        months: differenceInMonths(toNativeDate, fromNativeDate) % 12,
        days: differenceInDays(toNativeDate, fromNativeDate) % 30
      };
    } catch {
      return { years: 0, months: 0, days: 0 };
    }
  };

  const { years, months, days } = calculateDifference();

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
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]sm:whitespace-nowrap max-w-[6.5rem]">
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
          onOpenAutoFocus={(event) => event.preventDefault()}
          style={{
            borderRadius: "24px",
          }}
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-neutral-950 sm:w-[600px]"
        >
          <div className="flex flex-col p-6">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50 mb-6">
              Date Calculator
            </MorphingDialogTitle>
            <label className="mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
              Date Range (From - To)
            </label>
            
            {/* Date Range Picker */}
            <I18nProvider locale="hi-IN-u-ca">
              <DateRangePicker 
                className="space-y-2 mb-6 mt-2"
                value={fromDate && toDate ? { start: fromDate, end: toDate } : null}
                onChange={(range: DateRange) => {
                  if (range) {
                    setFromDate(range.start);
                    setToDate(range.end);
                  } else {
                    setFromDate(null);
                    setToDate(null);
                  }
                }}
                placeholderValue={undefined}
                isRequired={false}
                granularity="day"
              >
                <Group className={cn(dateInputStyle, "pe-9")}>
                  <DateInput slot="start" unstyled />
                  <span aria-hidden="true" className="px-2 text-muted-foreground/70">
                    -
                  </span>
                  <DateInput slot="end" unstyled />
                </Group>
              </DateRangePicker>
            </I18nProvider>
            {/* Results section */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-gray-400 mb-1">Days</p>
                <AuroraText className="text-3xl font-bold" disableAnimation={true}>{days}</AuroraText>
              </div>
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-gray-400 mb-1">Months</p>
                <AuroraText className="text-3xl font-bold" disableAnimation={true}>{months}</AuroraText>
              </div>
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-gray-400 mb-1">Years</p>
                <AuroraText className="text-3xl font-bold" disableAnimation={true}>{years}</AuroraText>
              </div>
            </div>
          </div>
          <MorphingDialogClose className="absolute top-6 right-6 text-gray-400 hover:text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

