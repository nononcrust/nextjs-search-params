"use client";

import { CheckIcon, MinusIcon } from "lucide-react";
import { Checkbox as CheckboxPrimitives } from "radix-ui";
import React, { useId } from "react";
import { tv, VariantProps } from "tailwind-variants";
import { createContextFactory } from "../../lib/context";
import { cn } from "../../lib/utils";
import { Label } from "./label";

const DEFAULT_SIZE = "medium";

type CheckboxProps = Omit<
  React.ComponentPropsWithRef<typeof CheckboxPrimitives.Root>,
  "onChange" | "onCheckedChange"
> &
  VariantProps<typeof checkboxVariants> & {
    onChange?: (checked: boolean) => void;
  };

const checkboxVariants = tv({
  slots: {
    root: "",
    icon: "",
    label: "flex items-center",
  },
  variants: {
    size: {
      small: {
        root: "size-4 rounded-[0.25rem]",
        icon: "size-[0.75rem]",
        label: "ml-2 text-sm",
      },
      medium: {
        root: "size-5 rounded-[0.3125rem]",
        icon: "size-[0.875rem]",
        label: "ml-2.5 text-[0.9375rem]",
      },
      large: {
        root: "size-6 rounded-[0.375rem]",
        icon: "size-[1.125rem]",
        label: "ml-3 text-base",
      },
    },
  },
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
});

const Checkbox = ({
  className,
  checked,
  ["aria-invalid"]: ariaInvalid,
  size,
  id: idProp,
  children,
  onChange,
  ...props
}: CheckboxProps) => {
  const generatedId = useId();

  const checkboxId = idProp ?? generatedId;

  const variants = checkboxVariants({ size });

  return (
    <CheckboxContext value={{ size, checkboxId }}>
      <div className={cn("flex items-center", className)}>
        <CheckboxPrimitives.Root
          id={checkboxId}
          className={cn(
            "border-border shadow-xs outline-hidden peer size-4 shrink-0 border",
            "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white",
            "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-white",
            "disabled:pointer-events-none disabled:opacity-50",
            variants.root(),
            ariaInvalid &&
              "border-error focus-visible:ring-ring-error data-[state=checked]:border-error data-[state=checked]:bg-error"
          )}
          checked={checked}
          aria-invalid={ariaInvalid}
          onCheckedChange={onChange}
          {...props}
        >
          <CheckboxPrimitives.Indicator className="flex items-center justify-center">
            {checked === "indeterminate" ? (
              <MinusIcon className={variants.icon()} strokeWidth={3} />
            ) : (
              <CheckIcon className={variants.icon()} strokeWidth={3} />
            )}
          </CheckboxPrimitives.Indicator>
        </CheckboxPrimitives.Root>
        {children}
      </div>
    </CheckboxContext>
  );
};

type CheckboxLabelProps = React.ComponentPropsWithRef<typeof Label>;

const CheckboxLabel = ({
  className,
  children,
  ...props
}: CheckboxLabelProps) => {
  const { size, checkboxId } = useCheckboxContext();

  return (
    <Label
      htmlFor={checkboxId}
      className={cn(checkboxVariants({ size }).label(), className)}
      {...props}
    >
      {children}
    </Label>
  );
};

type CheckboxGroupProps = React.ComponentPropsWithRef<"div">;

const CheckboxGroup = ({ children, ...props }: CheckboxGroupProps) => {
  return (
    <div role="group" {...props}>
      {children}
    </div>
  );
};

Checkbox.Label = CheckboxLabel;
Checkbox.Group = CheckboxGroup;

export { Checkbox };

type CheckboxContextValue = {
  checkboxId: string;
  size: VariantProps<typeof checkboxVariants>["size"];
};

const [CheckboxContext, useCheckboxContext] =
  createContextFactory<CheckboxContextValue>("Checkbox");
