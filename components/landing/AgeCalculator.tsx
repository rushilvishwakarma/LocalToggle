'use client';

import React, { useState, useEffect } from "react";
import {
  format,
  parse,
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
  isAfter,
  set,
} from "date-fns";
import { CakeIcon, PlusIcon, CalendarIcon, Clock, LockIcon, UnlockIcon } from "lucide-react";
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
import { AuroraText } from "@/components/ui/aurora-text";

export function AgeCalculator() {
  const defaultTime = "12:00:00 AM";
  const [birthDate, setBirthDate] = useState<Date>();
  const [birthTime, setBirthTime] = useState<string>(defaultTime);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isRealtime, setIsRealtime] = useState(true);
  const [manualTime, setManualTime] = useState<string>(defaultTime);

  // Function to check if a date is disabled (future date)
  const isDateDisabled = (date: Date) => {
    if (!date) return false;
    
    // For the current date, check the time as well
    if (isSameDay(date, currentTime)) {
      const [currentHours, currentMinutes, currentSeconds] = [
        currentTime.getHours(),
        currentTime.getMinutes(),
        currentTime.getSeconds()
      ];
      
      const selectedTime = birthTime || defaultTime;
      const time24 = convertTo24Hour(selectedTime);
      if (!time24) return false;
      
      const [selectedHours, selectedMinutes, selectedSeconds] = time24.split(':').map(Number);
      
      // Compare times for the same day
      if (currentHours < selectedHours) return true;
      if (currentHours === selectedHours && currentMinutes < selectedMinutes) return true;
      if (currentHours === selectedHours && currentMinutes === selectedMinutes && currentSeconds < selectedSeconds) return true;
    }
    
    // For different dates, just check if it's in the future
    return isAfter(date, currentTime);
  };

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h: string): string | null => {
    try {
      const [time, period] = time12h.split(' ');
      if (!time || !period) return null;
      
      const [hoursStr, minutes, seconds] = time.split(':');
      const hours = parseInt(hoursStr, 10);
      if (isNaN(hours) || isNaN(parseInt(minutes, 10)) || isNaN(parseInt(seconds, 10))) return null;
      
      let hour = hours;
      
      if (period.toLowerCase() === 'pm' && hour < 12) {
        hour += 12;
      }
      if (period.toLowerCase() === 'am' && hour === 12) {
        hour = 0;
      }
      
      if (hour < 0 || hour > 23 || parseInt(minutes, 10) < 0 || parseInt(minutes, 10) > 59 || parseInt(seconds, 10) < 0 || parseInt(seconds, 10) > 59) {
        return null;
      }
      
      return `${hour.toString().padStart(2, '0')}:${minutes}:${seconds}`;
    } catch (error) {
      return null;
    }
  };

  // Convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24h: string): string => {
    const [hours, minutes, seconds] = time24h.split(':');
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    
    return `${hour.toString().padStart(2, '0')}:${minutes}:${seconds} ${period}`;
  };

  // Update current time every second when in realtime mode
  useEffect(() => {
    if (isRealtime) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      return () => clearInterval(timer);
    } else {
      // When switching to manual mode, reset time to 12 AM
      const newDate = new Date();
      newDate.setHours(0, 0, 0);
      setManualTime(defaultTime);
      setCurrentTime(newDate);
    }
  }, [isRealtime, defaultTime]); // Remove currentTime from dependencies

  // Handle manual time changes
  const handleManualTimeChange = (newTime: string) => {
    try {
      const time24 = convertTo24Hour(newTime);
      if (!time24) {
        setManualTime(defaultTime);
        const newDate = new Date(currentTime);
        newDate.setHours(0, 0, 0);
        setCurrentTime(newDate);
        return;
      }
      
      const [hours, minutes, seconds] = time24.split(':').map(Number);
      const newDate = new Date(currentTime);
      newDate.setHours(hours, minutes, seconds);
      setCurrentTime(newDate);
      setManualTime(newTime);
    } catch (error) {
      setManualTime(defaultTime);
      const newDate = new Date(currentTime);
      newDate.setHours(0, 0, 0);
      setCurrentTime(newDate);
    }
  };

  // Handle birth time changes
  const handleBirthTimeChange = (newTime: string) => {
    try {
      const time24 = convertTo24Hour(newTime);
      if (!time24) {
        setBirthTime(defaultTime);
        return;
      }
      
      const [hours, minutes, seconds] = time24.split(':').map(Number);
      setBirthTime(newTime);
      
      if (birthDate) {
        const newDate = new Date(birthDate);
        newDate.setHours(hours, minutes, seconds);
        setBirthDate(newDate);
      }
    } catch (error) {
      setBirthTime(defaultTime);
    }
  };

  // Handle birth date selection with time
  const handleBirthDateSelect = (date: Date | undefined) => {
    if (date) {
      const time24 = convertTo24Hour(birthTime);
      if (!time24) {
        setBirthTime(defaultTime);
        setBirthDate(date);
        return;
      }
      
      const [hours, minutes, seconds] = time24.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, seconds);
      setBirthDate(newDate);
    } else {
      setBirthDate(undefined);
    }
  };

  // Handle current date selection
  const handleCurrentDateSelect = (date: Date | undefined) => {
    if (date) {
      const time24 = convertTo24Hour(manualTime);
      if (!time24) {
        setManualTime(defaultTime);
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0);
        setCurrentTime(newDate);
        return;
      }
      
      const [hours, minutes, seconds] = time24.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, seconds);
      setCurrentTime(newDate);
    }
  };

  // Ensure birthDate is not in the future
  const safeBirthDate = birthDate && birthDate <= currentTime ? birthDate : undefined;

  // Calculate age breakdown using safeBirthDate
  const ageYears = safeBirthDate ? differenceInYears(currentTime, safeBirthDate) : 0;
  const birthdayThisYear = safeBirthDate ? addYears(safeBirthDate, ageYears) : undefined;
  const ageMonths = safeBirthDate && birthdayThisYear ? differenceInMonths(currentTime, birthdayThisYear) : 0;
  const birthdayThisMonth = safeBirthDate && birthdayThisYear ? addMonths(birthdayThisYear, ageMonths) : undefined;
  const ageDays = safeBirthDate && birthdayThisMonth ? differenceInDays(currentTime, birthdayThisMonth) : 0;
  
  // Calculate next birthday based on whether this year's birthday has passed
  const nextBirthday = safeBirthDate && birthdayThisYear
    ? currentTime < birthdayThisYear
      ? birthdayThisYear
      : addYears(birthdayThisYear, 1)
    : undefined;
  const daysToNextBirthday = nextBirthday ? differenceInCalendarDays(nextBirthday, currentTime) : 0;
  
  // Age in hours, minutes, and seconds based on safeBirthDate
  const ageHours = safeBirthDate ? differenceInHours(currentTime, safeBirthDate) : 0;
  const ageMinutes = safeBirthDate ? differenceInMinutes(currentTime, safeBirthDate) : 0;
  const ageSeconds = safeBirthDate ? differenceInSeconds(currentTime, safeBirthDate) : 0;

  // Add this function before the return statement
  const shouldShowSummary = () => {
    if (!birthDate) return false;
    
    // Check if the numbers would be too large
    const totalSeconds = ageSeconds;
    const totalMinutes = ageMinutes;
    const totalHours = ageHours;
    const totalWeeks = Math.floor((ageYears * 365.25 + ageMonths * 30.44 + ageDays) / 7);
    
    // Check if any value exceeds safe integer limits or might cause display issues
    if (
      totalSeconds > Number.MAX_SAFE_INTEGER ||
      totalMinutes > Number.MAX_SAFE_INTEGER ||
      totalHours > Number.MAX_SAFE_INTEGER ||
      totalWeeks > Number.MAX_SAFE_INTEGER ||
      !Number.isFinite(totalSeconds) ||
      !Number.isFinite(totalMinutes) ||
      !Number.isFinite(totalHours) ||
      !Number.isFinite(totalWeeks)
    ) {
      return false;
    }

    return true;
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
              <CakeIcon className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]sm:whitespace-nowrap max-w-[6.5rem]">
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
          onOpenAutoFocus={(event) => event.preventDefault()}
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
            <div className="mt-6 flex flex-col gap-3 items-center">
              {/* Date of Birth Picker */}
              <div className="flex items-center justify-between w-full">
                <label className="mr-2 mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400 w-28">
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
                        ? `${format(birthDate, "PPP")}`
                        : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      required={true}
                      selected={birthDate}
                      onSelect={handleBirthDateSelect}
                      showTimePicker={true}
                      defaultTime={birthTime}
                      onTimeChange={handleBirthTimeChange}
                      disabled={isDateDisabled}
                      className="[&_.rdp-day_button[aria-disabled=true]]:line-through [&_.rdp-day_button[aria-disabled=true]]:opacity-50"
                      autoFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Today Date Display */}
              <div className="flex items-center justify-between w-full">
                <div className="mr-2 flex items-center gap-2 w-28">
                  <label className="block text-sm font-medium text-gray-400 dark:text-gray-400">
                    Today
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setIsRealtime(!isRealtime)}
                  >
                    {isRealtime ? (
                      <LockIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <UnlockIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {isRealtime ? (
                <Button
                  variant="outline"
                  className="w-[300px] justify-start text-left font-normal group relative"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="flex items-center gap-2">
                    <span className="hidden sm:inline">
                      {format(currentTime, "MMM d")} {format(currentTime, "hh:mm:ss aa")}
                    </span>
                  </span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-70 sm:hidden">
                    Current Date & Time
                  </span>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground opacity-70 hidden sm:inline">
                    Current Time
                  </span>
                </Button>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[300px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        <span className="flex items-center gap-2">
                          <span className="hidden sm:inline">
                            {format(currentTime, "PPP")} {manualTime}
                          </span>
                          <span className="sm:hidden">
                            {format(currentTime, "PPP")}
                          </span>
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={currentTime}
                        onSelect={handleCurrentDateSelect}
                        showTimePicker={true}
                        defaultTime={manualTime}
                        onTimeChange={handleManualTimeChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="mt-2 mb-3 grid w-full gap-2 grid-cols-2">
                {/* Age Section */}
                <div className="bg-neutral-950 dark:bg-neutral-900 rounded-l-3xl rounded-r-md p-6 text-center flex flex-col justify-between">
                  <p className="text-3xl font-medium text-gray-50">Age</p>
                  <div className="mt-4">
                    <AuroraText className="text-6xl font-bold" disableAnimation={true}>
                      {birthDate ? `${ageYears}` : ' '}
                    </AuroraText>
                    <span className="text-sm font-normal text-gray-50">
                      {birthDate ? " years" : " years"}
                    </span>
                  </div>
                  <p className="mt-6 text-sm text-gray-400">
                    {birthDate ? `${ageMonths} months | ${ageDays} days` : 'months | days'}
                  </p>
                </div>

                {/* Next Birthday Section */}
                <div className="bg-neutral-950 dark:bg-neutral-900 rounded-r-3xl rounded-l-md p-6 text-center flex flex-col justify-between">
                  <AuroraText className="w-full justify-center text-lg font-medium" disableAnimation={true}>
                    Next Birthday
                  </AuroraText>
                  <div className="flex flex-col items-center mt-4">
                    <CakeIcon className="w-7 h-7 mb-2" />
                    <p className="text-2xl font-bold text-gray-50">
                      {nextBirthday ? `${format(nextBirthday, "EEEE")}` : '--'}
                    </p>
                  </div>
                  <p className="mt-6 text-sm text-gray-400">
                    {nextBirthday ? `${daysToNextBirthday} days to go` : 'days to go'}
                  </p>
                </div>
              </div>

              {birthDate && shouldShowSummary() && (
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
                            <AuroraText className="text-sm font-bold" disableAnimation={true}> 
                              {`${ageYears}`}
                            </AuroraText>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Months</p>
                            <AuroraText className="text-sm font-bold" disableAnimation={true}>
                              {`${ageYears * 12 + ageMonths}`}
                            </AuroraText>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Weeks</p>
                            <AuroraText className="text-sm font-bold" disableAnimation={true}>
                              {`${Math.floor((ageYears * 365.25 + ageMonths * 30.44 + ageDays) / 7)}`}
                            </AuroraText>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Hours</p>
                            <AuroraText className="text-sm font-bold" disableAnimation={true}>
                              {`${ageHours}`}
                            </AuroraText>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Minutes</p>
                            <AuroraText className="text-sm font-bold" disableAnimation={true}>
                              {`${ageMinutes}`}
                            </AuroraText>
                          </div>
                          <div>
                            <p className="text-lg text-gray-50">Seconds</p>
                            <AuroraText className="text-sm font-bold" disableAnimation={true}>
                              {`${ageSeconds}`}
                            </AuroraText>
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
