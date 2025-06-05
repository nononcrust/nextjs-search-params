"use client";

import { RadioGroup as RadioGroupPrimitives } from "radix-ui";
import React, { useId } from "react";
import { tv, VariantProps } from "tailwind-variants";
import { createContextFactory } from "../../lib/context";
import { cn } from "../../lib/utils";
import { Label } from "./label";

const radioGroupVariants = tv({
  slots: {
    root: "grid",
    item: cn(
      "aspect-sqaure border-border size-4 shrink-0 rounded-full border shadow-xs outline-hidden",
      "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white",
      "disabled:pointer-events-none disabled:opacity-50"
    ),
    indicator: "",
    label: "",
    option: "flex items-center",
  },
  variants: {
    size: {
      small: {
        root: "gap-2",
        item: "size-4",
        indicator: "size-[0.375rem]",
        label: "text-sm",
        option: "gap-2",
      },
      medium: {
        root: "gap-3",
        item: "size-5",
        indicator: "size-[0.5rem]",
        label: "text-[0.9375rem]",
        option: "gap-2.5",
      },
      large: {
        root: "gap-4",
        item: "size-6",
        indicator: "size-[0.625rem]",
        label: "text-base w-full",
        option: "gap-3",
      },
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

type RadioGroupProps<T extends string> = Omit<
  RadioGroupPrimitives.RadioGroupProps,
  "value" | "onValueChange" | "onChange"
> &
  VariantProps<typeof radioGroupVariants> & {
    value?: T;
    onChange?: (value: T) => void;
  };

const RadioGroup = <T extends string>({
  className,
  children,
  ["aria-invalid"]: ariaInvalid,
  size,
  value,
  onChange,
  ...props
}: RadioGroupProps<T>) => {
  return (
    <RadioGroupContext value={{ ariaInvalid, size }}>
      <RadioGroupPrimitives.Root
        className={cn(radioGroupVariants({ size, className }).root())}
        value={value}
        onValueChange={onChange}
        {...props}
      >
        {children}
      </RadioGroupPrimitives.Root>
    </RadioGroupContext>
  );
};

type RadioGroupItemProps = React.ComponentPropsWithRef<
  typeof RadioGroupPrimitives.Item
>;

const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps) => {
  const id = useId();
  const { ariaInvalid, size } = useRadioGroupContext();

  return (
    <RadioGroupPrimitives.Item
      id={id}
      className={cn(
        radioGroupVariants({ size, className }).item(),
        ariaInvalid &&
          "border-error focus-visible:ring-ring-error data-[state=checked]:bg-error data-[state=checked]:border-error"
      )}
      {...props}
    >
      <RadioGroupPrimitives.Indicator className="flex items-center justify-center">
        <svg
          className={cn(radioGroupVariants({ size, className }).indicator())}
          viewBox="0 0 6 6"
          fill="currentcolor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="3" cy="3" r="3" />
        </svg>
      </RadioGroupPrimitives.Indicator>
    </RadioGroupPrimitives.Item>
  );
};

const RadioGroupLabel = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithRef<"label">) => {
  const { size } = useRadioGroupContext();

  return (
    <Label
      className={radioGroupVariants({ size, className }).label()}
      {...props}
    >
      {children}
    </Label>
  );
};

type RadioGroupOptionProps = RadioGroupItemProps;

const RadioGroupOption = ({
  className,
  children,
  ...props
}: RadioGroupOptionProps) => {
  const { size } = useRadioGroupContext();
  const id = useId();

  return (
    <div className={cn(radioGroupVariants({ size, className }).option())}>
      <RadioGroupItem id={id} {...props} />
      <RadioGroupLabel htmlFor={id}>{children}</RadioGroupLabel>
    </div>
  );
};

RadioGroup.Item = RadioGroupItem;
RadioGroup.Option = RadioGroupOption;

type RadioGroupContextValue = {
  ariaInvalid?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
  size: VariantProps<typeof radioGroupVariants>["size"];
};

const [RadioGroupContext, useRadioGroupContext] =
  createContextFactory<RadioGroupContextValue>("RadioGroup");

export { RadioGroup };
