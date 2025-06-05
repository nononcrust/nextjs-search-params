import { cn } from "../../lib/utils";

type InputProps = React.ComponentPropsWithRef<"input">;

const Input = ({ className, ["aria-invalid"]: ariaInvalid, ...props }: InputProps) => {
  return (
    <input
      className={cn(
        "border-border bg-background text-main shadow-xs flex h-9 w-full rounded-md border px-3 text-sm",
        "focus-visible:focus-input-ring",
        "placeholder-placeholder",
        "disabled:bg-background-100 disabled:pointer-events-none disabled:opacity-50",
        "read-only:bg-background-100",
        ariaInvalid && "focus-visible:focus-input-ring-error border-error",
        className,
      )}
      aria-invalid={ariaInvalid}
      {...props}
    />
  );
};

export { Input };
