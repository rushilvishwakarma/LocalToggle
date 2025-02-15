"use client"

import React from "react"
import {
  AnimatePresence,
  type MotionProps,
  type Variants,
  motion,
} from "framer-motion"
import type { ElementType } from "react"
import { cn } from "@/lib/utils"

// Custom hook to detect small devices (sm: max-width: 640px)
function useIsSmallDevice(threshold: number = 640) {
  const [isSmall, setIsSmall] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${threshold}px)`)
    setIsSmall(mq.matches)
    const handleChange = (e: MediaQueryListEvent) => setIsSmall(e.matches)
    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
  }, [threshold])
  return isSmall
}

type AnimationType = "text" | "word" | "character" | "line"

interface AuroraTextProps extends MotionProps {
  children: React.ReactNode
  className?: string
  segmentClassName?: string
  delay?: number
  duration?: number
  as?: ElementType
  by?: AnimationType
  startOnView?: boolean
  once?: boolean
  disableAnimation?: boolean
  viewport?: {
    once?: boolean
    margin?: string
  }
}

const staggerTimings: Record<AnimationType, number> = {
  text: 0.06,
  word: 0.05,
  character: 0.03,
  line: 0.06,
}

const defaultContainerVariants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
}

const defaultItemAnimationVariants: Record<
  "blurInUp",
  { container: Variants; item: Variants }
> = {
  blurInUp: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
      show: (customDelay: number) => ({
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          delay: customDelay,
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      }),
      exit: {
        opacity: 0,
        filter: "blur(10px)",
        y: 20,
        transition: {
          y: { duration: 0.3 },
          opacity: { duration: 0.4 },
          filter: { duration: 0.3 },
        },
      },
    },
  },
}

export function AuroraText({
  children,
  delay = 0,
  duration = 0.3,
  className,
  segmentClassName,
  as: Component = "p",
  startOnView = true,
  once = false,
  by = "word",
  disableAnimation = false,
  viewport,
  ...props
}: AuroraTextProps) {
  // Determine if the current device is small (e.g. "sm")
  const isSmallDevice = useIsSmallDevice()
  // If either the disableAnimation prop is true or we are on a small device, disable animations
  const shouldDisableAnimation = disableAnimation || isSmallDevice

  const MotionComponent = motion(Component)
  const isString = typeof children === "string"

  // Compute segments
  const segments = React.useMemo(() => {
    if (!isString) return [children]
    switch (by) {
      case "word":
        return children.split(/(\s+)/)
      case "character":
        return children.split("")
      case "line":
        return children.split("\n")
      case "text":
      default:
        return [children]
    }
  }, [children, by, isString])

  // Memoize final variants
  const finalVariants = React.useMemo(() => ({
    container: {
      ...defaultItemAnimationVariants.blurInUp.container,
      show: {
        ...defaultItemAnimationVariants.blurInUp.container.show,
        transition: { staggerChildren: staggerTimings[by] },
      },
      exit: {
        ...defaultItemAnimationVariants.blurInUp.container.exit,
        transition: { staggerChildren: staggerTimings[by], staggerDirection: -1 },
      },
    },
    item: defaultItemAnimationVariants.blurInUp.item,
  }), [by])

  // Memoize rendered segments
  const renderedSegments = React.useMemo(() => {
    if (!isString) return children
    return segments.map((segment, i) => (
      <motion.span
        key={`${by}-${segment}-${i}`}
        {...(!shouldDisableAnimation && {
          variants: finalVariants.item,
          custom: i * staggerTimings[by],
        })}
        style={{ overflow: "visible" }}
        className={cn(
          by === "line" ? "block" : "inline-block whitespace-pre",
          segmentClassName,
        )}
      >
        {segment}
      </motion.span>
    ))
  }, [segments, by, shouldDisableAnimation, segmentClassName, finalVariants, children, isString])

  return (
    <AnimatePresence mode="wait">
      <MotionComponent
        {...(!shouldDisableAnimation && {
          variants: finalVariants.container,
          initial: "hidden",
          whileInView: startOnView ? "show" : undefined,
          animate: startOnView ? undefined : "show",
          exit: "exit",
          viewport: viewport || (startOnView ? { once } : undefined),
        })}
        className={cn("whitespace-pre-wrap relative inline-flex", className)}
        {...props}
      >
        {isString ? (
          <div style={{ overflow: "visible" }}>{renderedSegments}</div>
        ) : (
          renderedSegments
        )}
        {/* Aurora Overlay */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-lighten dark:mix-blend-darken">
          <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]" />
          <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]" />
          <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]" />
        </span>
      </MotionComponent>
    </AnimatePresence>
  )
}
