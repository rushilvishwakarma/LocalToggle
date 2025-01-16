'use client'

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
