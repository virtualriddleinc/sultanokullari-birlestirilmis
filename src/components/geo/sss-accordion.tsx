"use client";

import {
  AccordionItem,
  AccordionRoot,
} from "@/components/ui/accordion-radix";
import { PageShell } from "@/components/page-shell";
import { SSS_CATEGORIES } from "@/content/sss";

export function SssAccordion() {
  return (
    <div className="space-y-10">
      {SSS_CATEGORIES.map((category) => (
        <section key={category.id}>
          <h2 className="font-cinzel text-charcoal text-xl font-bold">{category.title}</h2>
          <AccordionRoot type="multiple" className="mt-4">
            {category.items.map((item, index) => (
              <AccordionItem
                key={`${category.id}-${index}`}
                value={`${category.id}-${index}`}
                title={item.question}
              >
                {item.answer}
              </AccordionItem>
            ))}
          </AccordionRoot>
        </section>
      ))}
    </div>
  );
}
