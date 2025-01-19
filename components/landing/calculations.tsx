'use client'

import { AgeCalculator } from '@/components/landing/AgeCalculator';
import { TempCalculator } from '@/components/landing/TempCalculator';
import { AreaCalculator } from '@/components/landing/AreaCalculator';
import { DataCalculator } from '@/components/landing/DataCalculator';
import { BMICalculator } from '@/components/landing/BMICalculator';

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
      <TempCalculator />
    </div>

        <div className="w-full">
      <AreaCalculator />
    </div>


        <div className="w-full">
      <DataCalculator />
    </div>


        <div className="w-full">
      <BMICalculator />
    </div>

  </div>
</section>
   )
}
