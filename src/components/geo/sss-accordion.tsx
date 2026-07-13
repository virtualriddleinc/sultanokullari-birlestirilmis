"use client";

import {
  AccordionItem,
  AccordionRoot,
} from "@/components/ui/accordion-radix";
import { SSS_CATEGORIES } from "@/content/sss";

export function SssAccordion() {
  return (
    <div className="space-y-fluid-8">
      {SSS_CATEGORIES.map((category) => (
        <section key={category.id}>
          <h2 className="font-cinzel text-charcoal text-[length:var(--text-xl)] font-bold md:text-[length:var(--text-2xl)]">
            {category.title}
          </h2>
          <AccordionRoot type="multiple" className="mt-fluid-4">
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
