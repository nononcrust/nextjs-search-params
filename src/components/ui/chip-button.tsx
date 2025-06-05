import { Slot } from "radix-ui";
import { tv, VariantProps } from "tailwind-variants";
import { buttonVariant } from "./button";
import { cn } from "../../lib/utils";

const chipButtonVariants = tv({
  base: "inline-flex items-center justify-center rounded-full border border-transparent font-medium transition-colors",
  variants: {
    variant: buttonVariant,
    size: {
      xsmall: "h-7 gap-1 px-2.5 text-xs",
      small: "h-8 gap-1 px-3 text-[0.8125rem]",
      medium: "h-9 gap-1.5 px-3.5 text-sm",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "medium",
  },
});

type ChipButtonProps = React.ComponentPropsWithRef<"button"> &
  VariantProps<typeof chipButtonVariants> & {
    asChild?: boolean;
  };

const ChipButton = ({
  className,
  asChild = false,
  disabled,
  variant,
  size,
  children,
  ...props
}: ChipButtonProps) => {
  const Component = asChild ? Slot.Root : "button";

  return (
    <Component
      type={asChild ? undefined : "button"}
      className={cn(chipButtonVariants({ variant, size, className }))}
      disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
};

export { ChipButton };
