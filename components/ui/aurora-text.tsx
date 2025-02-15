"use client"

import {
  AnimatePresence,
  type MotionProps,
  type Variants,
  motion,
} from "motion/react"
import type { ElementType } from "react"
import { cn } from '@/lib/utils'
import * as React from "react";

type AnimationType = "text" | "word" | "character" | "line"

interface AuroraTextProps extends MotionProps {
  /**
   * The text content to animate or any React node.
   */
  children: React.ReactNode
  /**
   * The class name to be applied to the container
   */
  className?: string
  /**
   * The class name to be applied to each segment
   */
  segmentClassName?: string
  /**
   * The delay before the animation starts
   */
  delay?: number
  /**
   * The duration of the animation
   */
  duration?: number
  /**
   * The element type to render
   */
  as?: ElementType
  /**
   * How to split the text ("text", "word", "character", "line")
   */
  by?: AnimationType
  /**
   * Whether to start animation when component enters viewport
   */
  startOnView?: boolean
  /**
   * Whether to animate only once
   */
  once?: boolean
  /**
   * If true, disable the animation (text appears instantly)
   */
  disableAnimation?: boolean
}

// Same stagger timings as before:
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
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
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
  ...props
}: AuroraTextProps) {
  const MotionComponent = motion.create(Component)

  // If children is not a string, render it directly without text splitting animation.
  if (typeof children !== "string") {
    return (
      <MotionComponent
        className={cn("whitespace-pre-wrap relative inline-flex", className)}
        {...props}
      >
        {children}
        {/* Aurora Overlay */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-lighten dark:mix-blend-darken">
          <span className="pointer-events-none absolute -top-1/2 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-1_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-1))] mix-blend-overlay blur-[1rem]" />
          <span className="pointer-events-none absolute right-0 top-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-2_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-2))] mix-blend-overlay blur-[1rem]" />
          <span className="pointer-events-none absolute bottom-0 left-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-3_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-3))] mix-blend-overlay blur-[1rem]" />
          <span className="pointer-events-none absolute -bottom-1/2 right-0 h-[30vw] w-[30vw] animate-[aurora-border_6s_ease-in-out_infinite,aurora-4_12s_ease-in-out_infinite_alternate] bg-[hsl(var(--color-4))] mix-blend-overlay blur-[1rem]" />
        </span>
      </MotionComponent>
    )
  }

  // Memoize the text splitting into segments.
  const segments = React.useMemo(() => {
    const text = children
    switch (by) {
      case "word":
        return text.split(/(\s+)/)
      case "character":
        return text.split("")
      case "line":
        return text.split("\n")
      case "text":
      default:
        return [text]
    }
  }, [children, by])

  // Memoize final variants based on the "by" prop.
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

  // Memoize the rendered segments.
  const renderedSegments = React.useMemo(() => {
    return segments.map((segment, i) => (
      <motion.span
        key={`${by}-${segment}-${i}`}
        {...(!disableAnimation && {
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
  }, [segments, by, disableAnimation, segmentClassName, finalVariants])

  return (
    <AnimatePresence mode="popLayout">
      <MotionComponent
        {...(!disableAnimation && {
          variants: finalVariants.container,
          initial: "hidden",
          whileInView: startOnView ? "show" : undefined,
          animate: startOnView ? undefined : "show",
          exit: "exit",
        })}
        className={cn("whitespace-pre-wrap relative inline-flex", className)}
        {...props}
      >
        <div style={{ overflow: "visible" }}>
          {renderedSegments}
        </div>
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
