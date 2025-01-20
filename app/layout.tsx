import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

const fontSans = FontSans({
   subsets: ['latin'],
   variable: '--font-sans',
})
export const metadata: Metadata = {
   title: 'Lemon Convert',
   description: 'Locally convert between different files formats, units and measurements.',
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
            className={cn(
               'bg-background min-h-screen font-sans antialiased',
               fontSans.variable,
            )}
         >
            <ThemeProvider
               attribute="class"
               defaultTheme="dark"
               disableTransitionOnChange
            >
               {children}
               <Toaster />
            </ThemeProvider>
         </body>
      </html>
   )
}
