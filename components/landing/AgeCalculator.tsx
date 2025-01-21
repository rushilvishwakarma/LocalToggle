'use client';

import React, { useState } from "react";
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
  addDays,
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isSameDay,
} from "date-fns";
import { CakeIcon, PlusIcon, CalendarIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog';

export function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<Date>();
  const [todayDate, setTodayDate] = useState<Date>(new Date());

  const currentTime = new Date(); // Current exact time

  // Calculate age
  const ageYears = birthDate ? differenceInYears(currentTime, birthDate) : 0;
  const adjustedBirthDate = birthDate ? addYears(birthDate, ageYears) : undefined;
  const ageMonths = birthDate && adjustedBirthDate
    ? differenceInMonths(currentTime, adjustedBirthDate)
    : 0;
  const adjustedMonthDate = birthDate && adjustedBirthDate
    ? addMonths(adjustedBirthDate, ageMonths)
    : undefined;
  const ageDays = birthDate && adjustedMonthDate
    ? differenceInDays(currentTime, adjustedMonthDate)
    : 0;

  // Calculate next birthday
  const nextBirthday = birthDate
    ? addYears(birthDate, ageYears + (isSameDay(birthDate, currentTime) ? 1 : 0))
    : undefined;
  const daysToNextBirthday = nextBirthday
    ? differenceInCalendarDays(nextBirthday, currentTime)
    : 0;

  // Age in hours, minutes, and seconds
  const ageHours = birthDate
    ? differenceInHours(currentTime, birthDate)
    : 0;
  const ageMinutes = birthDate
    ? differenceInMinutes(currentTime, birthDate)
    : 0;
  const ageSeconds = birthDate
    ? differenceInSeconds(currentTime, birthDate)
    : 0;

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
            Age Calculator
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
          {/* Dialog Content */}
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Age Calculator
            </MorphingDialogTitle>
            <div className="mt-4 flex flex-col gap-3 items-center">
              {/* Date of Birth Picker */}
              <div className="flex items-center justify-between w-full">
                <label className="block text-sm font-medium text-gray-400 dark:text-gray-400">
                  Date of Birth
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[300px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate
                        ? format(birthDate, "PPP")
                        : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      required={true}
                      selected={birthDate}
                      onSelect={setBirthDate}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Today Date Picker */}
              <div className="flex items-center justify-between w-full">
                <label className="block text-sm font-medium text-gray-400 dark:text-gray-400">
                  Today
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[300px] justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {todayDate
                        ? format(todayDate, "PPP")
                        : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      required={true}
                      selected={todayDate}
                      onSelect={setTodayDate}
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="mt-2 mb-3 grid w-full gap-2 grid-cols-2">
                {/* Age Section */}
                <div className="bg-neutral-950 dark:bg-neutral-900 rounded-l-3xl rounded-r-md p-6 text-center flex flex-col justify-between">
                  <p className="text-3xl font-medium text-gray-50">Age</p>
                  <p className="mt-4 text-6xl font-bold text-amber-400">
                    {birthDate ? ageYears : ' '}
                    <span className="text-sm font-normal text-gray-50">
                      {birthDate ? " years" : " years"}
                    </span>
                  </p>
                  <p className="mt-6 text-sm text-gray-400">
                    {birthDate ? `${ageMonths} months | ${ageDays} days` : 'months | days'}
                  </p>
                </div>

                {/* Next Birthday Section */}
                <div className="bg-neutral-950 dark:bg-neutral-900 rounded-r-3xl rounded-l-md p-6 text-center flex flex-col justify-between">
                  <p className="text-lg font-medium text-amber-400">Next Birthday</p>
                  <div className="flex flex-col items-center mt-4">
                    <CakeIcon className="text-amber-400 w-7 h-7 mb-2" />
                    <p className="text-2xl font-bold text-gray-50">
                      {nextBirthday ? `${format(nextBirthday, "EEEE")}` : '--'}
                    </p>
                  </div>
                  <p className="mt-6 text-sm text-gray-400">
                    {nextBirthday ? `${daysToNextBirthday} days to go` : 'days to go'}
                  </p>
                </div>
              </div>

              {birthDate && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="age" className="border-transparent">
                    <AccordionTrigger className="text-lg font-medium text-gray-50 no-underline hover:no-underline focus:no-underline">
                      Summary
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="w-full bg-neutral-950 dark:bg-neutral-900 rounded-2xl p-6">
                        <div className="grid grid-cols-3 gap-y-4 text-center">
                          <div>
                            <p className="text-lg text-gray-50">Years</p>
                            <p className="text-sm font-bold text-amber-400">{ageYears}</p>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Months</p>
                            <p className="text-sm font-bold text-amber-400">{ageYears * 12 + ageMonths}</p>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Weeks</p>
                            <p className="text-sm font-bold text-amber-400">
                              {Math.floor((ageYears * 365.25 + ageMonths * 30.44 + ageDays) / 7)}
                            </p>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Hours</p>
                            <p className="text-sm font-bold text-amber-400">{ageHours}</p>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Minutes</p>
                            <p className="text-sm font-bold text-amber-400">{ageMinutes}</p>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Seconds</p>
                            <p className="text-sm font-bold text-amber-400">{ageSeconds}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
          <MorphingDialogClose className="text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
