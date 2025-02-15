'use client'

import React, { useState } from "react";
import { format, differenceInYears, differenceInMonths, differenceInDays } from "date-fns";
import { CalendarDate, parseDate } from "@internationalized/date";
import { CakeIcon, CalendarIcon, PlusIcon } from "lucide-react";
import { DateRangePicker, Group, Dialog, Button, Popover, Label } from "react-aria-components";
import { RangeCalendar } from "@/components/ui/calendar-rac";
import { DateInput, dateInputStyle } from "@/components/ui/datefield-rac";
import { MorphingDialog, MorphingDialogTrigger, MorphingDialogContent, MorphingDialogTitle, MorphingDialogClose, MorphingDialogContainer } from '@/components/ui/morphing-dialog';
import { AuroraText } from "@/components/ui/aurora-text";
import { cn } from "@/lib/utils";

export function DateCalculator() {
  const [fromDate, setFromDate] = useState<CalendarDate>(parseDate(format(new Date(), 'yyyy-MM-dd')));
  const [toDate, setToDate] = useState<CalendarDate>(parseDate(format(new Date(), 'yyyy-MM-dd')));

  // Calculate differences using the native Date objects
  const fromNativeDate = fromDate ? new Date(fromDate.year, fromDate.month - 1, fromDate.day) : new Date();
  const toNativeDate = toDate ? new Date(toDate.year, toDate.month - 1, toDate.day) : new Date();

  const yearsDiff = differenceInYears(toNativeDate, fromNativeDate);
  const monthsDiff = differenceInMonths(toNativeDate, fromNativeDate) % 12;
  const daysDiff = differenceInDays(toNativeDate, fromNativeDate) % 30;

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
            <DateRangePicker className="space-y-2 mb-6 mt-2">
              <div className="flex">
                <Group className={cn(dateInputStyle, "pe-9")}>
                  <DateInput slot="start" unstyled />
                  <span aria-hidden="true" className="px-2 text-muted-foreground/70">
                    -
                  </span>
                  <DateInput slot="end" unstyled />
                </Group>
                <Button className="z-10 -me-px -ms-9 flex w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus-visible:outline-none data-[focus-visible]:outline data-[focus-visible]:outline-2 data-[focus-visible]:outline-ring/70">
                  <CalendarIcon size={16} strokeWidth={2} />
                </Button>
              </div>
              <Popover
                className="z-50 rounded-lg border border-border bg-background text-popover-foreground shadow-lg shadow-black/5 outline-none data-[entering]:animate-in data-[exiting]:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2"
                offset={4}
              >
                <Dialog className="max-h-[inherit] overflow-auto p-2">
                  <RangeCalendar />
                </Dialog>
              </Popover>
            </DateRangePicker>

            {/* Results section */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-gray-400 mb-1">Years</p>
                <AuroraText className="text-3xl font-bold">{`${yearsDiff}`}</AuroraText>
              </div>
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-gray-400 mb-1">Months</p>
                <AuroraText className="text-3xl font-bold">{`${monthsDiff}`}</AuroraText>
              </div>
              <div className="bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-4 text-center">
                <p className="text-sm font-medium text-gray-400 mb-1">Days</p>
                <AuroraText className="text-3xl font-bold">{`${daysDiff}`}</AuroraText>
              </div>
            </div>
          </div>
          <MorphingDialogClose className="absolute top-6 right-6 text-gray-400 hover:text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

