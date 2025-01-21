import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { GradientBackground } from "@/components/ui/gradient-background";
interface MarketingLayoutProps {
   children: React.ReactNode
}

export default async function MarketingLayout({
   children,
}: MarketingLayoutProps) {
   return (
      <>
         <SiteHeader />
         <GradientBackground />
         <main className="mx-auto flex-1 overflow-hidden">{children}</main>
         <SiteFooter />
      </>
   )
}
