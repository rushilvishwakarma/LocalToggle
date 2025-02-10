'use client'

import React, { useState, useEffect } from "react";
import { Calculator } from "lucide-react";  // Changed icon
import { MoneyWavy, HandCoins, Coins, CoinVertical } from "@phosphor-icons/react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog';
import { PlusIcon } from 'lucide-react';
import { AuroraText } from "@/components/ui/aurora-text"

export function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);

  useEffect(() => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);

    if (!isNaN(price) && !isNaN(discount)) {
      const saving = (price * discount) / 100;
      const final = price - saving;
      setFinalPrice(final);
      setSavings(saving);
    } else {
      setFinalPrice(0);
      setSavings(0);
    }
  }, [originalPrice, discountPercent]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) && value.length <= 15) {
      setOriginalPrice(value);
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) && parseFloat(value) <= 100) {
      setDiscountPercent(value);
    }
  };

  const shouldWrapResults = () => {
    const finalPriceStr = finalPrice.toFixed(2).toString();
    const savingsStr = savings.toFixed(2).toString();
    return finalPriceStr.length > 8 || savingsStr.length > 8;
  };

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: "12px",
        }}
        className="flex flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-white dark:bg-opacity-[0.01]"
      >
        <div className="py-3 px-3">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center justify-center bg-white bg-opacity-[0.05] w-16 h-16 rounded-full">
              <Calculator className="text-gray-400 w-7 h-7 strokeWidth={1}" />
            </div>
          </div>
        </div>

        <div className="flex flex-grow flex-row items-end px-3 sm:px-4 p-3">
          <MorphingDialogTitle className="text-md text-gray-400 dark:gray-400 text-left whitespace-normal sm:whitespace-nowrap max-w-[6.5rem]">
            Discount Calculator
          </MorphingDialogTitle>
          <button
            type="button"
            className="relative ml-auto flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-gray-400 transition-colors hover:bg-zinc-100 hover:text-gray-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-transparent dark:text-gray-400 dark:hover:bg-neutral-900 dark:hover:bg-[opacity-0.01] dark:hover:text-gray-50 dark:focus-visible:ring-zinc-500"
            aria-label="Open dialog"
          >
            <PlusIcon size={12} />
          </button>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: "24px",
          }}
          className="mx-3 pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-neutral-950 sm:w-[500px]"
        >
          <div className="px-6 pt-6 pb-3">
            <MorphingDialogTitle className="text-2xl text-gray-950 dark:text-gray-50">
              Discount Calculator
            </MorphingDialogTitle>
            <div className="mt-4 flex flex-col gap-3">
              {/* Original Price Input */}
              <div className="flex flex-col w-full">
                <label className="pb-2 block text-sm font-medium text-gray-400 dark:text-gray-400 flex items-center gap-1">
                  Original Price <HandCoins size={16} />
                </label>
                <Input
                  type="text"
                  placeholder="Enter price"
                  value={originalPrice}
                  onChange={handlePriceChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Discount Percentage Input */}
              <div className="flex flex-col w-full">
                <label className="pb-2 block text-sm font-medium text-gray-400 dark:text-gray-400">
                  Discount (%)
                </label>
                <Input
                  type="text"
                  placeholder="Enter discount percentage"
                  value={discountPercent}
                  onChange={handleDiscountChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Results */}
              <div className={`mt-4 mb-4 flex gap-4 ${shouldWrapResults() ? 'flex-col' : 'flex-row'}`}>
              <div className={`text-center ${shouldWrapResults() ? 'w-full' : 'flex-1'}`}>
                  <AuroraText className="text-2xl sm:text-3xl font-bold flex items-center justify-center gap-1">
                    <Coins size={32} className="shrink-0" />
                    <span className="break-words">
                      {finalPrice.toFixed(2)}
                    </span>
                  </AuroraText>
                  <p className="pt-2 text-sm font-normal text-gray-50">
                    Final Price
                  </p>
                </div>
                <div className={`text-center ${shouldWrapResults() ? 'w-full' : 'flex-1'}`}>
                  <p className="text-2xl sm:text-3xl font-bold text-green-400 flex items-center justify-center gap-1">
                    <Coins size={32} className="shrink-0" />
                    <span className="break-words">
                      {savings.toFixed(2)}
                    </span>
                  </p>
                  <p className="pt-2 text-sm font-normal text-gray-50">
                    You Save
                  </p>
                </div>
              </div>
            </div>
          </div>
          <MorphingDialogClose className="text-gray-50" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

