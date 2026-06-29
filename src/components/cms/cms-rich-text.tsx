import React from "react";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
});

type Props = {
  data: Record<string, unknown> | null | undefined;
  className?: string;
};

/** CMS Lexical zengin metin — kurumsal sayfa blokları */
export function CmsRichText({ data, className }: Props) {
  if (!data) return null;

  return (
    <div className={className ?? "prose prose-zinc max-w-none text-zinc-700"}>
      <RichText
        converters={converters}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={data as any}
      />
    </div>
  );
}
