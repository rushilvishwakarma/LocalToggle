'use client'

import { AgeCalculator } from '@/components/landing/AgeCalculator';
import { TempCalculator } from '@/components/landing/TempCalculator';

export default function HeroSection() {
   return (
<section
  className="pt-6 pb-2 relative mx-auto mt-20 max-w-5xl px-6 text-center md:px-8"
>
  <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
    {/* Age Calculator */}
    <div className="w-full">
      <AgeCalculator />
    </div>

    {/* Age Calculator */}
    <div className="w-full">
      <TempCalculator />
    </div>

        {/* Age Calculator */}
        <div className="w-full">
      <AgeCalculator />
    </div>

        {/* Age Calculator */}
        <div className="w-full">
      <AgeCalculator />
    </div>

        {/* Age Calculator */}
        <div className="w-full">
      <AgeCalculator />
    </div>

  </div>
</section>
   )
}
