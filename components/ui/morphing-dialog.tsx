'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  Transition,
  Variant,
} from 'motion/react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { XIcon } from 'lucide-react';


export type MorphingDialogContextType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  triggerRef: React.RefObject<HTMLDivElement>;
};

const MorphingDialogContext =
  React.createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error(
      'useMorphingDialog must be used within a MorphingDialogProvider'
    );
  }
  return context;
}

export type MorphingDialogProviderProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function MorphingDialogProvider({
  children,
  transition,
}: MorphingDialogProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef<HTMLDivElement>(null!);

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      uniqueId,
      triggerRef,
    }),
    [isOpen, uniqueId]
  );

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

export type MorphingDialogProps = {
  children: React.ReactNode;
  transition?: Transition;
};

function MorphingDialog({ children, transition }: MorphingDialogProps) {
  return (
    <MorphingDialogProvider>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogProvider>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);

    return () => {
      window.removeEventListener('resize', updateIsMobile);
    };
  }, []);

  return isMobile;
}

export type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  triggerRef?: React.RefObject<HTMLDivElement>;
};

function MorphingDialogTrigger({
  children,
  className,
  style,
  triggerRef,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, isOpen, uniqueId } = useMorphingDialog();
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useIsMobile();

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsVisible(false);
    }
  }, [isOpen, setIsOpen]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setIsOpen(!isOpen);
        if (!isOpen) {
          setIsVisible(false);
        }
      }
    },
    [isOpen, setIsOpen]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleAnimationComplete = useCallback(() => {
    if (!isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('relative cursor-pointer', className, { 'invisible': !isVisible })}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onAnimationComplete={handleAnimationComplete}
      style={style}
      role='button'
      aria-haspopup='dialog'
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label={`Open dialog ${uniqueId}`}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }} // Adjusted transition
      initial={isMobile ? { opacity: 0, scale: 0.9 } : undefined}
      animate={isMobile ? { opacity: 1, scale: 1 } : undefined}
      exit={isMobile ? { opacity: 0, scale: 0.9 } : undefined}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogContent({
  children,
  className,
  style,
}: MorphingDialogContentProps) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null!);
  const [firstFocusableElement, setFirstFocusableElement] =
    useState<HTMLElement | null>(null);
  const [lastFocusableElement, setLastFocusableElement] =
    useState<HTMLElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
      if (event.key === 'Tab') {
        if (!firstFocusableElement || !lastFocusableElement) return;

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
          }
        } else {
          if (document.activeElement === lastFocusableElement) {
            event.preventDefault();
            firstFocusableElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setIsOpen, firstFocusableElement, lastFocusableElement]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      const focusableElements = containerRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        setFirstFocusableElement(focusableElements[0] as HTMLElement);
        setLastFocusableElement(
          focusableElements[focusableElements.length - 1] as HTMLElement
        );
        (focusableElements[0] as HTMLElement).focus();
      }
    } else {
      document.body.classList.remove('overflow-hidden');
      const timeoutId = setTimeout(() => triggerRef.current?.focus(), 200); // Adjust the timeout duration to match the animation duration
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn('overflow-hidden', className)}
      style={style}
      role='dialog'
      aria-modal='true'
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
      transition={{ type: "spring", duration: 0.4, bounce: 0 }} // Adjusted transition
      initial={isMobile ? { opacity: 0, scale: 0.9 } : undefined}
      animate={isMobile ? { opacity: 1, scale: 1 } : undefined}
      exit={isMobile ? { opacity: 0, scale: 0.9 } : undefined}
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
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false} mode='sync'>
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className='fixed inset-0 h-full w-full bg-black/50' // Dim the background without blur
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} // Reduce transition duration for better performance
          />
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center'
            initial={isMobile ? { opacity: 0, scale: 0.9 } : undefined}
            animate={isMobile ? { opacity: 1, scale: 1 } : undefined}
            exit={isMobile ? { opacity: 0, scale: 0.9 } : undefined}
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

function MorphingDialogTitle({
  children,
  className,
  style,
}: MorphingDialogTitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-title-container-${uniqueId}`}
      className={className}
      style={style}
      layout
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogSubtitleProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

function MorphingDialogSubtitle({
  children,
  className,
  style,
}: MorphingDialogSubtitleProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export type MorphingDialogDescriptionProps = {
  children: React.ReactNode;
  className?: string;
  disableLayoutAnimation?: boolean;
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
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
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial='initial'
      animate='animate'
      exit='exit'
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

function MorphingDialogImage({
  src,
  alt,
  className,
  style,
}: MorphingDialogImageProps) {
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
  variants?: {
    initial: Variant;
    animate: Variant;
    exit: Variant;
  };
};

function MorphingDialogClose({
  children,
  className,
  variants,
}: MorphingDialogCloseProps) {
  const { setIsOpen, uniqueId } = useMorphingDialog();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <motion.button
      onClick={handleClose}
      type='button'
      aria-label='Close dialog'
      key={`dialog-close-${uniqueId}`}
      className={cn('absolute right-6 top-6', className)}
      initial='initial'
      animate='animate'
      exit='exit'
      variants={variants}
    >
      {children || <XIcon size={24} />}
    </motion.button>
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
