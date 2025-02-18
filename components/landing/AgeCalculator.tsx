"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  format,
  differenceInYears,
  differenceInMonths,
  differenceInDays,
  addYears,
  addMonths,
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isSameDay,
  isAfter,
} from "date-fns";
import {
  CakeIcon,
  PlusIcon,
  CalendarIcon,
  LockIcon,
  UnlockIcon,
} from "lucide-react";
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
} from "@/components/ui/morphing-dialog";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownNavProps, DropdownProps } from "react-day-picker";

// Helper function (defined outside to keep stable)
const handleCalendarChange = (
  value: string | number,
  onChange: React.ChangeEventHandler<HTMLSelectElement>
) => {
  const event = {
    target: { value: String(value) },
  } as unknown as React.ChangeEvent<HTMLSelectElement>;
  onChange(event);
};

// ----------------------
// Memoized Subcomponents
// ----------------------

// Birth Date Picker – static because it uses birthDate (rarely changes)
const BirthDatePicker = React.memo(({
  birthDate,
  birthTime,
  handleBirthDateSelect,
  handleBirthTimeChange,
  isDateDisabled,
}: {
  birthDate?: Date;
  birthTime: string;
  handleBirthDateSelect: (date: Date | undefined) => void;
  handleBirthTimeChange: (time: string) => void;
  isDateDisabled: (date: Date) => boolean;
}) => (
  <div className="flex items-center justify-between w-full">
    <label className="mr-2 block text-sm font-medium text-gray-400 dark:text-gray-400 w-28">
      Date of Birth
    </label>
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {birthDate ? format(birthDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          required
          selected={birthDate}
          onSelect={handleBirthDateSelect}
          showTimePicker
          defaultTime={birthTime}
          onTimeChange={handleBirthTimeChange}
          disabled={isDateDisabled}
          className="[&_.rdp-day_button[aria-disabled=true]]:line-through [&_.rdp-day_button[aria-disabled=true]]:opacity-50"
          autoFocus
          captionLayout="dropdown"
          hideNavigation
          components={{
            DropdownNav: (props: DropdownNavProps) => (
              <div className="flex w-full items-center gap-2">
                {props.children}
              </div>
            ),
            Dropdown: (props: DropdownProps) => (
              <Select
                value={String(props.value)}
                onValueChange={(value) => {
                  if (props.onChange) {
                    handleCalendarChange(value, props.onChange);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-fit font-medium first:grow">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                  {props.options?.map((option) => (
                    <SelectItem
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                      key={option.value}
                      value={String(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  </div>
));

// Today Display – only this component updates every second.
const TodayDisplay = React.memo(({
  currentTime,
  manualTime,
  isRealtime,
  handleManualTimeChange,
  handleCurrentDateSelect,
}: {
  currentTime: Date;
  manualTime: string;
  isRealtime: boolean;
  handleManualTimeChange: (time: string) => void;
  handleCurrentDateSelect: (date: Date | undefined) => void;
}) => {
  if (isRealtime) {
    return (
      <Button variant="outline" className="w-[300px] justify-start text-left font-normal group relative">
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
    );
  } else {
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
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
        {open && (
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={currentTime}
              onSelect={handleCurrentDateSelect}
              showTimePicker
              defaultTime={manualTime}
              onTimeChange={handleManualTimeChange}
              captionLayout="dropdown"
              hideNavigation
              components={{
                DropdownNav: (props: DropdownNavProps) => (
                  <div className="flex w-full items-center gap-2">
                    {props.children}
                  </div>
                ),
                Dropdown: (props: DropdownProps) => (
                  <Select
                    value={String(props.value)}
                    onValueChange={(value) => {
                      if (props.onChange) {
                        handleCalendarChange(value, props.onChange);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-fit font-medium first:grow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                      {props.options?.map((option) => (
                        <SelectItem
                        onMouseEnter={(e) => e.stopPropagation()}
                        onMouseLeave={(e) => e.stopPropagation()}
                          key={option.value}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ),
              }}
            />
          </PopoverContent>
        )}
      </Popover>
    );
  }
});

// Age Summary – only re-renders when age values change
const AgeSummary = React.memo(({
  ageYears,
  ageMonths,
  ageDays,
  ageHours,
  ageMinutes,
  ageSeconds,
}: {
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  ageHours: number;
  ageMinutes: number;
  ageSeconds: number;
}) => (
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
              <AuroraText className="text-sm font-bold">{ageYears}</AuroraText>
            </div>
            <div>
              <p className="text-lg text-gray-50">Months</p>
              <AuroraText className="text-sm font-bold">{ageYears * 12 + ageMonths}</AuroraText>
            </div>
            <div>
              <p className="text-lg text-gray-50">Weeks</p>
              <AuroraText className="text-sm font-bold">
                {Math.floor((ageYears * 365.25 + ageMonths * 30.44 + ageDays) / 7)}
              </AuroraText>
            </div>
            <div>
              <p className="text-lg text-gray-50">Hours</p>
              <AuroraText className="text-sm font-bold">{ageHours}</AuroraText>
            </div>
            <div>
              <p className="text-lg text-gray-50">Minutes</p>
              <AuroraText className="text-sm font-bold">{ageMinutes}</AuroraText>
            </div>
            <div>
              <p className="text-lg text-gray-50">Seconds</p>
              <AuroraText className="text-sm font-bold">{ageSeconds}</AuroraText>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
));

// ----------------------
// New Memoized Component: NextBirthdayDisplay
// ----------------------

const NextBirthdayDisplay = React.memo(({
  nextBirthday,
  daysToNextBirthday,
}: {
  nextBirthday?: Date;
  daysToNextBirthday: number;
}) => (
  <div className="bg-neutral-950 dark:bg-neutral-900 rounded-r-3xl rounded-l-md p-6 text-center flex flex-col justify-between">
    <AuroraText className="w-full justify-center text-lg font-medium">
      Next Birthday
    </AuroraText>
    <div className="flex flex-col items-center mt-4">
      <CakeIcon className="w-7 h-7 mb-2" />
      <p className="text-2xl font-bold text-gray-50">
        {nextBirthday ? format(nextBirthday, "EEEE") : "--"}
      </p>
    </div>
    <p className="mt-6 text-sm text-gray-400">
      {nextBirthday ? `${daysToNextBirthday} days to go` : "days to go"}
    </p>
  </div>
));

// ----------------------
// New Dynamic Component
// ----------------------

// This component encapsulates all time‐dependent state and calculations so that only it re-renders every second.
const DynamicAgeInfo = React.memo(({
  birthDate,
  birthTime,
  defaultTime,
  convertTo24Hour,
}: {
  birthDate?: Date;
  birthTime: string;
  defaultTime: string;
  convertTo24Hour: (time12h: string) => string | null;
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isRealtime, setIsRealtime] = useState(true);
  const [manualTime, setManualTime] = useState<string>(defaultTime);

  useEffect(() => {
    if (isRealtime) {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    } else {
      const newDate = new Date();
      newDate.setHours(0, 0, 0);
      setManualTime(defaultTime);
      setCurrentTime(newDate);
    }
  }, [isRealtime, defaultTime]);

  const handleManualTimeChange = useCallback((newTime: string) => {
    const time24 = convertTo24Hour(newTime);
    if (!time24) {
      setManualTime(defaultTime);
      const newDate = new Date(currentTime);
      newDate.setHours(0, 0, 0);
      setCurrentTime(newDate);
      return;
    }
    const [hours, minutes, seconds] = time24.split(":").map(Number);
    const newDate = new Date(currentTime);
    newDate.setHours(hours, minutes, seconds);
    setCurrentTime(newDate);
    setManualTime(newTime);
  }, [convertTo24Hour, currentTime, defaultTime]);

  const handleCurrentDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      const time24 = convertTo24Hour(manualTime);
      if (!time24) {
        setManualTime(defaultTime);
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0);
        setCurrentTime(newDate);
        return;
      }
      const [hours, minutes, seconds] = time24.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, seconds);
      setCurrentTime(newDate);
    }
  }, [convertTo24Hour, manualTime, defaultTime]);

  // Compute age breakdown based on currentTime.
  const safeBirthDate = birthDate && birthDate <= currentTime ? birthDate : undefined;
  const ageYears = safeBirthDate ? differenceInYears(currentTime, safeBirthDate) : 0;
  const birthdayThisYear = safeBirthDate ? addYears(safeBirthDate, ageYears) : undefined;
  const ageMonths = safeBirthDate && birthdayThisYear ? differenceInMonths(currentTime, birthdayThisYear) : 0;
  const birthdayThisMonth = safeBirthDate && birthdayThisYear ? addMonths(birthdayThisYear, ageMonths) : undefined;
  const ageDays = safeBirthDate && birthdayThisMonth ? differenceInDays(currentTime, birthdayThisMonth) : 0;
  const nextBirthday = safeBirthDate && birthdayThisYear
    ? (currentTime < birthdayThisYear ? birthdayThisYear : addYears(birthdayThisYear, 1))
    : undefined;
  const daysToNextBirthday = nextBirthday ? differenceInCalendarDays(nextBirthday, currentTime) : 0;
  const ageHours = safeBirthDate ? differenceInHours(currentTime, safeBirthDate) : 0;
  const ageMinutes = safeBirthDate ? differenceInMinutes(currentTime, safeBirthDate) : 0;
  const ageSeconds = safeBirthDate ? differenceInSeconds(currentTime, safeBirthDate) : 0;

  return (
    <>
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
        <TodayDisplay
          currentTime={currentTime}
          manualTime={manualTime}
          isRealtime={isRealtime}
          handleManualTimeChange={handleManualTimeChange}
          handleCurrentDateSelect={handleCurrentDateSelect}
        />
      </div>
      <div className="mt-2 mb-3 grid w-full gap-2 grid-cols-2">
        <div className="bg-neutral-950 dark:bg-neutral-900 rounded-l-3xl rounded-r-md p-6 text-center flex flex-col justify-between">
          <p className="text-3xl font-medium text-gray-50">Age</p>
          <div className="mt-4">
            <AuroraText className="text-6xl font-bold">
              {birthDate ? ageYears : " "}
            </AuroraText>
            <span className="text-sm font-normal text-gray-50">
              {birthDate ? " years" : " years"}
            </span>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            {birthDate ? `${ageMonths} months | ${ageDays} days` : "months | days"}
          </p>
        </div>
        {/* Use the memoized NextBirthdayDisplay instead of inline markup */}
        <NextBirthdayDisplay
          nextBirthday={nextBirthday}
          daysToNextBirthday={daysToNextBirthday}
        />
      </div>
      {birthDate && (
        <AgeSummary
          ageYears={ageYears}
          ageMonths={ageMonths}
          ageDays={ageDays}
          ageHours={ageHours}
          ageMinutes={ageMinutes}
          ageSeconds={ageSeconds}
        />
      )}
    </>
  );
});

// ----------------------
// Main Component
// ----------------------

export function AgeCalculator() {
  const defaultTime = "12:00:00 AM";
  const [birthDate, setBirthDate] = useState<Date>();
  const [birthTime, setBirthTime] = useState<string>(defaultTime);

  // Memoize inline objects to avoid new references on each render.
  const dialogTransition = useMemo(
    () => ({ type: "spring", bounce: 0.05, duration: 0.25 }),
    []
  );
  const triggerStyle = useMemo(() => ({ borderRadius: "12px" }), []);
  const contentStyle = useMemo(() => ({ borderRadius: "24px" }), []);

  const convertTo24Hour = useCallback((time12h: string): string | null => {
    try {
      const [time, period] = time12h.split(" ");
      if (!time || !period) return null;
      const [hoursStr, minutes, seconds] = time.split(":");
      const hours = parseInt(hoursStr, 10);
      if (
        isNaN(hours) ||
        isNaN(parseInt(minutes, 10)) ||
        isNaN(parseInt(seconds, 10))
      )
        return null;
      let hour = hours;
      if (period.toLowerCase() === "pm" && hour < 12) hour += 12;
      if (period.toLowerCase() === "am" && hour === 12) hour = 0;
      if (
        hour < 0 ||
        hour > 23 ||
        parseInt(minutes, 10) < 0 ||
        parseInt(minutes, 10) > 59 ||
        parseInt(seconds, 10) < 0 ||
        parseInt(seconds, 10) > 59
      )
        return null;
      return `${hour.toString().padStart(2, "0")}:${minutes}:${seconds}`;
    } catch (error) {
      return null;
    }
  }, []);

  const convertTo12Hour = useCallback((time24h: string): string => {
    const [hours, minutes, seconds] = time24h.split(":");
    let hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, "0")}:${minutes}:${seconds} ${period}`;
  }, []);

  // When using the date picker we compare against the current date.
  // Since our dynamic time is handled in DynamicAgeInfo, here we use new Date()
  const isDateDisabled = useCallback((date: Date) => {
    const now = new Date();
    if (!date) return false;
    if (isSameDay(date, now)) {
      const [currentHours, currentMinutes, currentSeconds] = [
        now.getHours(),
        now.getMinutes(),
        now.getSeconds(),
      ];
      const selectedTime = birthTime || defaultTime;
      const time24 = convertTo24Hour(selectedTime);
      if (!time24) return false;
      const [selectedHours, selectedMinutes, selectedSeconds] = time24.split(":").map(Number);
      if (currentHours < selectedHours) return true;
      if (currentHours === selectedHours && currentMinutes < selectedMinutes) return true;
      if (currentHours === selectedHours && currentMinutes === selectedMinutes && currentSeconds < selectedSeconds) return true;
    }
    return isAfter(date, now);
  }, [birthTime, defaultTime, convertTo24Hour]);

  // Handle birth time changes.
  const handleBirthTimeChange = useCallback((newTime: string) => {
    const time24 = convertTo24Hour(newTime);
    if (!time24) {
      setBirthTime(defaultTime);
      return;
    }
    const [hours, minutes, seconds] = time24.split(":").map(Number);
    setBirthTime(newTime);
    if (birthDate) {
      const newDate = new Date(birthDate);
      newDate.setHours(hours, minutes, seconds);
      setBirthDate(newDate);
    }
  }, [birthDate, convertTo24Hour, defaultTime]);

  // Handle birth date selection.
  const handleBirthDateSelect = useCallback((date: Date | undefined) => {
    if (date) {
      const time24 = convertTo24Hour(birthTime);
      if (!time24) {
        setBirthTime(defaultTime);
        setBirthDate(date);
        return;
      }
      const [hours, minutes, seconds] = time24.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, seconds);
      setBirthDate(newDate);
    } else {
      setBirthDate(undefined);
    }
  }, [birthTime, convertTo24Hour, defaultTime]);

  return (
    <MorphingDialog transition={dialogTransition}>
      <MorphingDialogTrigger style={triggerStyle} className="flex flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-white dark:bg-opacity-[0.01]">
        <div className="py-3 px-3">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center justify-center bg-white bg-opacity-[0.05] w-16 h-16 rounded-full">
              <CakeIcon className="text-gray-400 w-7 h-7" />
            </div>
          </div>
        </div>
        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]">
            Age Calculator
          </MorphingDialogTitle>
          <button
            type="button"
            className="relative ml-auto flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-gray-400 transition-colors hover:bg-zinc-100 hover:text-gray-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-900 dark:hover:bg-[opacity-0.01] dark:hover:text-gray-50 dark:focus-visible:ring-zinc-500"
            aria-label="Open dialog"
          >
            <PlusIcon size={12} />
          </button>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          onOpenAutoFocus={(event) => event.preventDefault()}
          style={contentStyle}
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-neutral-950 sm:w-[500px]"
        >
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Age Calculator
            </MorphingDialogTitle>
            <div className="mt-6 flex flex-col gap-3 items-center">
              <BirthDatePicker
                birthDate={birthDate}
                birthTime={birthTime}
                handleBirthDateSelect={handleBirthDateSelect}
                handleBirthTimeChange={handleBirthTimeChange}
                isDateDisabled={isDateDisabled}
              />
              {/* Dynamic part is now isolated so only it updates every second */}
              <DynamicAgeInfo
                birthDate={birthDate}
                birthTime={birthTime}
                defaultTime={defaultTime}
                convertTo24Hour={convertTo24Hour}
              />
            </div>
          </div>
          <MorphingDialogClose className="text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
