'use client'

import Dropzone from '@/components/ui/dropzone';
import { useRef } from 'react'


export default function HeroSection() {
   const ref = useRef(null)
   return (
      <section
         id="hero"
         className="pt-10  pb-2 relative mx-auto mt-20 max-w-6xl px-6 text-center md:px-8"
      >
         <h1 className="animate-fade-in -translate-y-4 text-balance bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-5xl font-medium leading-none tracking-tighter text-transparent opacity-0 [--animation-delay:200ms] sm:text-5xl md:text-6xl lg:text-6xl dark:from-white dark:to-white/40">
            Local Convert
         </h1>
         <p className="animate-fade-in mb-12 -translate-y-4 text-balance text-lg tracking-tight text-gray-400 opacity-0 [--animation-delay:400ms] md:text-xl">
            An Elegant file convertion tool that converts files
            <br className="hidden md:block" />
            {' '}
            Locally without any Privacy concerns
         </p>
         <Dropzone />
         <div
            ref={ref}
            className="animate-fade-up relative mt-32 opacity-0 [--animation-delay:400ms] [perspective:2000px] after:absolute after:inset-0 after:z-50 after:[background:linear-gradient(to_top,hsl(var(--background))_30%,transparent)]"
         >

            </div>
      </section>
   )
}
