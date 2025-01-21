'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState, useMemo } from 'react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SiteHeader() {
   const router = useRouter()
   const pathname = usePathname()
   const [currentTab, setCurrentTab] = useState('account')

   // Memoize tabsConfig to prevent unnecessary re-renders
   type TabsConfig = {
      [key: string]: { path: string; label: string }
   }

   const tabsConfig: TabsConfig = useMemo(() => ({
      account: { path: '/', label: 'File Conversion' },
      password: { path: '/calculations', label: 'Unit Conversions' },
   }), [])

   const handleTabChange = (value: string) => {
      const tab = tabsConfig[value]
      if (tab) {
         router.push(tab.path)
      }
   }

   useEffect(() => {
      const currentPath = Object.entries(tabsConfig).find(([, tab]) => tab.path === pathname)
      setCurrentTab(currentPath ? currentPath[0] : 'account')
   }, [pathname, tabsConfig]) // tabsConfig is now stable due to useMemo

   return (
      <header className="fixed left-1/2 top-4 z-10 w-[95%] max-w-5xl bg-background/15 -translate-x-1/2 rounded-2xl border px-5 py-2 shadow-xl backdrop-blur-lg">
         <div className="flex items-center justify-center md:justify-between h-8">
            <Link className="text-sm font-semibold hidden md:block" href="/">
                                    <Image
                                       src="/orange-slice-white.svg"
                                       alt="Lemon Convert"
                                       className="text-primary size-8"
                                       width={40}
                                       height={40}
                                    />
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
