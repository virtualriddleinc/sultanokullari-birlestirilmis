"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/cn";

export function TabsRoot({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tabs.Root defaultValue={defaultValue} className={cn("w-full", className)}>
      {children}
    </Tabs.Root>
  );
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tabs.List
      className={cn(
        "flex flex-wrap gap-2 border-b border-zinc-200 pb-2",
        className,
      )}
      aria-label="Sekmeler"
    >
      {children}
    </Tabs.List>
  );
}

export function TabsTrigger({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="rounded-md border border-transparent px-3 py-1.5 text-sm font-medium text-zinc-600 data-[state=active]:border-[var(--color-primary)] data-[state=active]:bg-[var(--color-primary-light)] data-[state=active]:text-[var(--color-primary)]"
    >
      {children}
    </Tabs.Trigger>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tabs.Content
      value={value}
      className={cn("mt-4 focus:outline-none", className)}
    >
      {children}
    </Tabs.Content>
  );
}
