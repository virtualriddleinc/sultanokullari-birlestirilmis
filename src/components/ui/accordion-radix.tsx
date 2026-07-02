"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export function AccordionRoot({
  children,
  className,
  type = "single",
  collapsible = true,
}: {
  children: React.ReactNode;
  className?: string;
  type?: "single" | "multiple";
  collapsible?: boolean;
}) {
  return (
    <Accordion.Root
      type={type}
      {...(type === "single" ? { collapsible } : {})}
      className={cn(
        "divide-y divide-zinc-200 rounded-lg border border-zinc-200",
        className,
      )}
    >
      {children}
    </Accordion.Root>
  );
}

export function AccordionItem({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion.Item value={value} className="bg-white">
      <Accordion.Header>
        <Accordion.Trigger className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-zinc-900 hover:bg-zinc-50 data-[state=open]:bg-[var(--color-primary-light)]">
          {title}
          <ChevronDown
            className="size-4 shrink-0 text-zinc-500 transition-transform duration-200 data-[state=open]:rotate-180"
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=closed]:hidden data-[state=open]:block">
        <div className="border-t border-zinc-100 px-4 py-3 text-sm leading-relaxed text-zinc-700">
          {children}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}
