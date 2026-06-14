import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type SectionGridProps = {
  children: ReactNode;
  innerClassName?: string;
  variant?: "default" | "accent" | "honey" | "white";
  as?: ElementType;
  "data-section"?: string;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "className"> & {
    className?: string;
  };

const variantClasses: Record<
  NonNullable<SectionGridProps["variant"]>,
  string
> = {
  default: "bg-background",
  accent: "bg-brand-green text-charcoal",
  honey: "bg-brand-honey/35",
  white: "bg-white/90",
};

export const SectionGrid = forwardRef<HTMLElement, SectionGridProps>(
  function SectionGrid(
    {
      children,
      className,
      innerClassName,
      variant = "default",
      as: Tag = "section",
      "data-section": dataSection,
      id,
      ...rest
    },
    ref,
  ) {
    return (
      <Tag
        ref={ref}
        id={id}
        data-section={dataSection}
        className={cn(
          "py-fluid-8 sm:py-fluid-16 relative w-full",
          variantClasses[variant],
          className,
        )}
        {...rest}
      >
        <div className="section-page-grid">
          <div className={cn("section-page-grid__content", innerClassName)}>
            {children}
          </div>
        </div>
      </Tag>
    );
  },
);
