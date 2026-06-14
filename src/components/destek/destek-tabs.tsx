"use client";

import { destekSekmeleri } from "@/content/destek";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs-radix";

export function DestekTabs() {
  const defaultId = destekSekmeleri[0]?.id ?? "yemekhane";
  return (
    <TabsRoot defaultValue={defaultId}>
      <TabsList>
        {destekSekmeleri.map((s) => (
          <TabsTrigger key={s.id} value={s.id}>
            {s.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {destekSekmeleri.map((s) => (
        <TabsContent key={s.id} value={s.id}>
          <ul className="list-disc space-y-3 pl-5 text-zinc-700">
            {s.body.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
