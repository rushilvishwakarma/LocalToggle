"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeftRight, ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface SwapButtonProps {
  isVertical?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SwapButton({ isVertical = false, onClick, className }: SwapButtonProps) {
  const [open, setOpen] = useState<boolean>(false);
  const Icon = isVertical ? ArrowUpDown : ArrowLeftRight;

  return (
    <Button
      className={`group rounded-full ${className || ''}`}
      variant="outline"
      size="icon"
      onClick={() => {
        setOpen((prevState) => !prevState);
        onClick?.();
      }}
      aria-expanded={open}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      <Icon
        className="transition-transform duration-500 [transition-timing-function:cubic-bezier(0.68,-0.6,0.32,1.6)] group-aria-expanded:rotate-180"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}
