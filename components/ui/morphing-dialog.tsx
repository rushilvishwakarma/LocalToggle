"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hook to detect mobile devices
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mobileCheck = /Mobi|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);
  }, []);
  return isMobile;
}

// Hook to detect prefers-reduced-motion setting
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return prefersReducedMotion;
}

// Centralized animation props based on reduced motion setting
function useAnimationProps() {
  const prefersReducedMotion = usePrefersReducedMotion();
  return React.useMemo(
    () =>
      prefersReducedMotion
        ? {}
        : { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 } },
    [prefersReducedMotion]
  );
}

const DEFAULT_TRANSITION = { type: "spring", duration: 0.5, bounce: 0 };

export type MorphingDialogContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement>;
};

const MorphingDialogContext = React.createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const context = React.useContext(MorphingDialogContext);
  if (!context) {
    throw new Error("useMorphingDialog must be used within a MorphingDialogProvider");
  }
  return context;
}

export type MorphingDialogProviderProps = {
  children: React.ReactNode;
  transition?: typeof DEFAULT_TRANSITION;
};

function MorphingDialogProvider({ children }: MorphingDialogProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const uniqueId = React.useId();
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const contextValue = React.useMemo(() => ({ isOpen, setIsOpen, uniqueId, triggerRef }), [isOpen, uniqueId]);

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      {children}
    </MorphingDialogContext.Provider>
  );
}

export type MorphingDialogProps = {
  children: React.ReactNode;
  transition?: typeof DEFAULT_TRANSITION;
};

function MorphingDialog({ children }: MorphingDialogProps) {
  return <MorphingDialogProvider>{children}</MorphingDialogProvider>;
}

export type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogTrigger({ children, className, style }: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  const animationProps = useAnimationProps();
  const [isVisible, setIsVisible] = React.useState(true);

  const toggleDialog = React.useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) setIsVisible(false);
      return !prev;
    });
  }, [setIsOpen]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleDialog();
      }
    },
    [toggleDialog]
  );

  const handleMouseEnter = React.useCallback(() => {
    if (!isOpen) setIsVisible(true);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) setIsVisible(true);
  }, [isOpen]);

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative cursor-pointer", className, { invisible: !isVisible })}
      onClick={toggleDialog}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onAnimationComplete={() => !isOpen && setIsVisible(true)}
      style={{ ...style, willChange: "transform, opacity" }}
      role="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label={`Open dialog ${uniqueId}`}
      transition={DEFAULT_TRANSITION}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onOpenAutoFocus?: (event: { defaultPrevented: boolean; preventDefault: () => void }) => void;
};

function MorphingDialogContent({ children, className, style, onOpenAutoFocus }: MorphingDialogContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  const animationProps = useAnimationProps();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [firstFocusableElement, setFirstFocusableElement] = React.useState<HTMLElement | null>(null);
  const [lastFocusableElement, setLastFocusableElement] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
      if (event.key === "Tab" && firstFocusableElement && lastFocusableElement) {
        if (event.shiftKey && document.activeElement === firstFocusableElement) {
          event.preventDefault();
          lastFocusableElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setIsOpen, firstFocusableElement, lastFocusableElement]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");

      if (onOpenAutoFocus) {
        const syntheticEvent = {
          defaultPrevented: false,
          preventDefault() {
            this.defaultPrevented = true;
          },
        };
        onOpenAutoFocus(syntheticEvent);
        if (syntheticEvent.defaultPrevented) return;
      }

      const focusable = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        setFirstFocusableElement(focusable[0] as HTMLElement);
        setLastFocusableElement(focusable[focusable.length - 1] as HTMLElement);
        (focusable[0] as HTMLElement).focus();
      }
    } else {
      document.body.classList.remove("overflow-hidden");
      const timeoutId = setTimeout(() => triggerRef.current?.focus(), 200);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, triggerRef, onOpenAutoFocus]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("overflow-hidden border border-zinc-950/10 bg-[#080a0a]", className)}
      style={{ ...style, willChange: "transform, opacity" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
      transition={DEFAULT_TRANSITION}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen, uniqueId } = useMorphingDialog();
  const animationProps = useAnimationProps();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 h-full w-full bg-black/90 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ willChange: "opacity" }}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            {...animationProps}
            style={{ willChange: "transform, opacity" }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export type MorphingDialogTitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogTitle({ children, className, style }: MorphingDialogTitleProps) {
  return <div className={className} style={style}>{children}</div>;
}

export type MorphingDialogSubtitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogSubtitle({ children, className, style }: MorphingDialogSubtitleProps) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div layoutId={`dialog-subtitle-container-${uniqueId}`} className={className} style={style}>
      {children}
    </motion.div>
  );
}

export type MorphingDialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: { initial: any; animate: any; exit: any };
};

function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}: MorphingDialogDescriptionProps) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={disableLayoutAnimation ? undefined : `dialog-description-content-${uniqueId}`}
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogImageProps = {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogImage({ src, alt, className, style }: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
    />
  );
}

export type MorphingDialogCloseProps = {
  children?: React.ReactNode;
  className?: string;
  variants?: { initial: any; animate: any; exit: any };
};

function MorphingDialogClose({ children, className, variants }: MorphingDialogCloseProps) {
  const { setIsOpen, uniqueId } = useMorphingDialog();
  const handleClose = React.useCallback(() => setIsOpen(false), [setIsOpen]);
  return (
    <motion.div
      key={`dialog-close-${uniqueId}`}
      className={cn("absolute right-6 top-6", className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      <Button onClick={handleClose} className="rounded-full" variant="outline" size="icon" aria-label="Close dialog">
        {children || <XIcon size={16} strokeWidth={2} aria-hidden="true" />}
      </Button>
    </motion.div>
  );
}

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogImage,
};

// Demo usage component that conditionally passes onOpenAutoFocus only on mobile devices
function MyDialogComponent() {
  const isMobile = useIsMobile();

  return (
    <MorphingDialog>
      <MorphingDialogTrigger>
        Open Dialog
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          // onOpenAutoFocus is only provided on mobile devices
          onOpenAutoFocus={isMobile ? (event) => event.preventDefault() : undefined}
        >
          <div style={{ padding: "20px", color: "#fff" }}>
            <MorphingDialogTitle>Dialog Title</MorphingDialogTitle>
            <MorphingDialogSubtitle>Dialog Subtitle</MorphingDialogSubtitle>
            <MorphingDialogDescription>
              This is the dialog content. The autofocus behavior is prevented only on mobile devices.
            </MorphingDialogDescription>
            <MorphingDialogClose />
          </div>
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

export default MyDialogComponent;
