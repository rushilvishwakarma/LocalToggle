'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SiteHeader() {
   const router = useRouter()
   const pathname = usePathname()
   const [currentTab, setCurrentTab] = useState('account')

   const tabsConfig: { [key: string]: { path: string, label: string } } = {
      account: { path: '/', label: 'File Conversion' },
      password: { path: '/calculations', label: 'Unit Conversions' },
      // Add more tabs here
   }

   const handleTabChange = (value: string) => {
      const tab = tabsConfig[value]
      if (tab) {
         router.push(tab.path)
      }
   }

   useEffect(() => {
      const currentPath = Object.entries(tabsConfig).find(([, tab]) => tab.path === pathname)
      setCurrentTab(currentPath ? currentPath[0] : 'account')
   }, [pathname])

   return (
      <header className="fixed left-1/2 top-4 z-50 w-[90%] max-w-5xl bg-background/50 -translate-x-1/2 rounded-2xl border px-5 py-2 shadow-lg backdrop-blur-lg">
         <div className="flex items-center justify-between h-10">
            <Link className="text-sm font-semibold" href="/">
               Local Convert
            </Link>
            <div className="flex items-center">
               <Tabs value={currentTab} onValueChange={handleTabChange}>
                  <TabsList>
                     {Object.keys(tabsConfig).map((tab) => (
                        <TabsTrigger key={tab} value={tab}>{tabsConfig[tab].label}</TabsTrigger>
                     ))}
                  </TabsList>
               </Tabs>
            </div>
         </div>
      </header>
   )
}
