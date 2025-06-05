import { Slot } from "radix-ui";
import React from "react";
import { tv, VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

export type ButtonProps = React.ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const buttonVariant = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  primaryLow:
    "bg-primary-lighter text-primary hover:bg-primary-lighter-hover dark:bg-primary-darker dark:text-white dark:hover:bg-primary-darker-hover",
  primaryOutlined: "bg-background border border-border text-primary hover:bg-background-hover",
  primaryLowOutlined:
    "border border-primary text-primary bg-primary-lighter hover:bg-primary-lighter-hover dark:bg-primary-darker dark:text-white dark:border-primary-dark dark:hover:bg-primary-darker-hover",
  secondary: "bg-secondary text-main hover:bg-secondary-dark",
  contained: "bg-neutral text-background hover:bg-neutral-dark",
  outlined: "border border-border text-main hover:bg-background-hover",
  ghost: "hover:bg-background-hover",
  error: "bg-error text-white hover:bg-error-dark",
};

const buttonVariants = tv({
  base: cn(
    "inline-flex justify-center items-center gap-2 font-semibold outline-hidden whitespace-nowrap text-foreground transition-colors",
    "disabled:opacity-50 disabled:pointer-events-none",
  ),
  variants: {
    variant: buttonVariant,
    size: {
      small: "px-[0.625rem] h-8 text-xs rounded-[0.5rem]",
      medium: "px-3 h-9 text-sm rounded-md",
      large: "px-[0.875rem] h-10 text-[0.9375rem] rounded-md",
      xlarge: "px-[1.25rem] h-[3.5rem] rounded-xl text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

const Button = ({
  className,
  variant,
  size,
  children,
  asChild = false,
  disabled,
  ...props
}: ButtonProps) => {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      type={asChild ? undefined : "button"}
      className={cn(buttonVariants({ size, variant, className }))}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
};

export { Button };
