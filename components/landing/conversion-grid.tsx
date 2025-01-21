'use client'

import { AgeCalculator } from '@/components/landing/AgeCalculator';
import { TempCalculator } from '@/components/landing/TempConverter';
import { AreaCalculator } from '@/components/landing/AreaConverter';
import { DataCalculator } from '@/components/landing/DataCalculator';
import { DateCalculator } from '@/components/landing/DateCalculator';
import { BMICalculator } from '@/components/landing/BMICalculator';
import { DiscountCalculator } from '@/components/landing/DiscountCalculator';
import { LengthCalculator } from '@/components/landing/LengthConverter';
import { MassCalculator } from '@/components/landing/MassConverter';
import { NumeralSystemConverter } from '@/components/landing/NumeralSystem';
import { SpeedConverter } from '@/components/landing/SpeedConverter';
import { VolumeCalculator } from '@/components/landing/VolumeConverter';
import { TimeConverter } from '@/components/landing/TimeConverter';

export default function HeroSection() {
   return (
<section
  className="min-h-screen pt-6 pb-2 relative mx-auto mt-20 max-w-5xl px-6 text-center md:px-8"
>
  <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
    <div className="w-full">
      <AgeCalculator />
    </div>

    <div className="w-full">
      <AreaCalculator />
    </div>

    <div className="w-full">
      <BMICalculator />
    </div>

    <div className="w-full">
      <DataCalculator />
    </div>

    <div className="w-full">
      <DateCalculator />
    </div>

    <div className="w-full">
      <DiscountCalculator />
    </div>

    <div className="w-full">
      <LengthCalculator />
    </div>

    <div className="w-full">
      <MassCalculator />
    </div>

    <div className="w-full">
      <NumeralSystemConverter />
    </div>

    <div className="w-full">
      <SpeedConverter />
    </div>

    <div className="w-full">
      <TempCalculator />
    </div>

    <div className="w-full">
      <TimeConverter />
    </div>

    <div className="w-full">
      <VolumeCalculator />
    </div>

  </div>
</section>
   )
}
