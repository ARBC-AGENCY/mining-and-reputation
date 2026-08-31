"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";
import { TAB_VALUES, type TabValue } from "@/lib/insights-tabs";


/**
 * Tabs are URL-driven rather than client-state: each one navigates, so the
 * server re-queries and every view is linkable and shareable. Arriving at
 * ?type=article from the homepage therefore lands with Articles highlighted.
 */
export function InsightsTabs({ current }: { current: TabValue }) {
  const t = useTranslations("formats");
  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  // Landing on ?type=resource puts the active tab off-screen on a phone, so
  // bring it into view horizontally without scrolling the page vertically.
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[data-state="active"]');
    if (!list || !active) return;
    const target =
      active.offsetLeft - list.clientWidth / 2 + active.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [current]);

  return (
    <Tabs
      value={current}
      onValueChange={(value) =>
        router.push(value === "all" ? "/insights" : `/insights?type=${value}`)
      }
      className="w-full"
    >
      {/* Scrolls horizontally rather than wrapping — a wrapped tab bar reads
          as two rows of unrelated buttons on a phone. */}
      <TabsList
        ref={listRef}
        className="flex h-auto w-full max-w-full justify-start gap-1 overflow-x-auto rounded-[18px] border border-white/10 bg-white/4 p-2 backdrop-blur-xl [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {TAB_VALUES.map((value) => (
          <TabsTrigger
            key={value}
            value={value}
            className="text-grey-light/70 shrink-0 cursor-pointer rounded-[12px] my-2 px-4 py-3 text-sm whitespace-nowrap transition-colors hover:text-white data-[state=active]:bg-white/10 data-[state=active]:text-gold data-[state=active]:shadow-none"
          >
            {t(value)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
