import { Slot } from "radix-ui";
import React from "react";
import { tv, VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { buttonVariant } from "./button";

export type IconButtonProps = React.ComponentPropsWithRef<"button"> &
  VariantProps<typeof iconButtonVariants> & {
    ["aria-label"]: string;
    asChild?: boolean;
  };

const iconButtonVariants = tv({
  base: cn(
    "inline-flex justify-center items-center border border-transparent whitespace-nowrap transition-colors",
    "disabled:opacity-50 disabled:pointer-events-none"
  ),

  variants: {
    variant: buttonVariant,
    size: {
      xsmall: "size-7 text-xs rounded-[0.5rem]",
      small: "size-8 text-sm rounded-[0.5rem]",
      medium: "size-9 text-base rounded-md",
      large: "size-10 text-lg rounded-md",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

const IconButton = ({
  className,
  children,
  variant,
  size,
  asChild = false,
  disabled,
  "aria-label": ariaLabel,
  ...props
}: IconButtonProps) => {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      type={asChild ? undefined : "button"}
      className={cn(iconButtonVariants({ size, variant, className }))}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </Component>
  );
};

export { IconButton };
