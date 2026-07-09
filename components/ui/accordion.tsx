"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border rounded-2xl transition-all duration-300 overflow-hidden", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex w-full">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-center justify-between py-5 text-left text-base font-bold text-foreground transition-all outline-none cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
        <div
          data-slot="accordion-trigger-icon"
          className="h-8 w-8 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 border-border bg-muted text-muted-foreground group-hover:border-sio-blue/30 group-hover:text-sio-blue dark:group-hover:border-sio-teal/30 dark:group-hover:text-sio-teal group-data-[state=open]/accordion-trigger:border-sio-blue group-data-[state=open]/accordion-trigger:bg-sio-blue group-data-[state=open]/accordion-trigger:text-white dark:group-data-[state=open]/accordion-trigger:border-sio-teal dark:group-data-[state=open]/accordion-trigger:bg-sio-teal dark:group-data-[state=open]/accordion-trigger:text-sio-navy"
        >
          <CaretDown
            size={14}
            weight="bold"
            className="pointer-events-none shrink-0 group-data-[state=open]/accordion-trigger:hidden"
          />
          <CaretUp
            size={14}
            weight="bold"
            className="pointer-events-none hidden shrink-0 group-data-[state=open]/accordion-trigger:inline"
          />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "pt-0 pb-5 pr-4 pl-14 text-sm text-muted-foreground leading-relaxed",
          className,
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
