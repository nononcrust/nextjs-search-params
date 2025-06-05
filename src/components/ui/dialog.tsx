"use client";

import { XIcon } from "lucide-react";
import { Dialog as DialogPrimitives } from "radix-ui";
import React, { useEffect } from "react";
import { createContextFactory } from "../../lib/context";
import { cn } from "../../lib/utils";
import { IconButton } from "./icon-button";

type DialogProps = Omit<DialogPrimitives.DialogProps, "open"> & {
  isOpen?: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

const Dialog = ({ children, isOpen, triggerRef, ...props }: DialogProps) => {
  return (
    <DialogContext value={{ triggerRef }}>
      <DialogPrimitives.Root open={isOpen} {...props}>
        {children}
      </DialogPrimitives.Root>
    </DialogContext>
  );
};

type DialogOverlayProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Overlay
>;

const DialogOverlay = ({
  className,
  children,
  ...props
}: DialogOverlayProps) => {
  const { triggerRef } = useDialogContext();
  const { animation } = useDialogContentContext();

  useEffect(() => {
    if (!triggerRef) return;

    const triggerElement = triggerRef.current;

    return () => {
      triggerElement?.focus();
    };
  }, [triggerRef]);

  return (
    <DialogPrimitives.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/70",
        animation !== "none" && "animate-in fade-in",
        className
      )}
      data-testid="overlay"
      {...props}
    >
      {children}
    </DialogPrimitives.Overlay>
  );
};

type DialogAnimation = "pop" | "slide" | "none";

type DialogContentProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Content
> & {
  animation?: DialogAnimation;
};

const animationStyle: Record<DialogAnimation, string> = {
  pop: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 duration-200",
  slide:
    "ease-out-expo data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-[37.5rem] duration-500!",
  none: "",
};

const DialogContent = ({
  className,
  children,
  animation = "pop",
  ...props
}: DialogContentProps) => {
  return (
    <DialogContentContext value={{ animation }}>
      <DialogPrimitives.Portal>
        <DialogOverlay />
        <DialogPrimitives.Content
          aria-modal
          className={cn(
            "bg-background fixed left-1/2 top-1/2 z-50 flex max-h-[calc(100%-4rem)] w-full max-w-[calc(100%-4rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-[0.75rem]",
            animationStyle[animation],
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitives.Close asChild className="absolute right-4 top-4">
            <IconButton variant="ghost" aria-label="닫기" size="xsmall">
              <XIcon className="size-4" />
            </IconButton>
          </DialogPrimitives.Close>
        </DialogPrimitives.Content>
      </DialogPrimitives.Portal>
    </DialogContentContext>
  );
};

type DialogHeaderProps = React.ComponentPropsWithRef<"div">;

const DialogHeader = ({ className, children, ...props }: DialogHeaderProps) => {
  return (
    <div className={cn("flex flex-col gap-1.5 p-5", className)} {...props}>
      {children}
    </div>
  );
};

type DialogBodyProps = React.ComponentPropsWithRef<"div">;

const DialogBody = ({ className, children, ...props }: DialogBodyProps) => {
  return (
    <div
      className={cn("flex flex-1 flex-col overflow-y-auto px-5", className)}
      {...props}
    >
      {children}
    </div>
  );
};

type DialogFooterProps = React.ComponentPropsWithRef<"div">;

const DialogFooter = ({ className, children, ...props }: DialogFooterProps) => {
  return (
    <div className={cn("flex justify-end gap-2 p-5", className)} {...props}>
      {children}
    </div>
  );
};

type DialogTitleProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Title
>;

const DialogTitle = ({ className, children, ...props }: DialogTitleProps) => {
  return (
    <DialogPrimitives.Title
      className={cn("text-lg font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </DialogPrimitives.Title>
  );
};

type DialogDescriptionProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Description
>;

const DialogDescription = ({
  className,
  children,
  ...props
}: DialogDescriptionProps) => {
  return (
    <DialogPrimitives.Description
      className={cn("text-sub text-sm", className)}
      {...props}
    >
      {children}
    </DialogPrimitives.Description>
  );
};

type DialogTriggerProps = React.ComponentPropsWithRef<
  typeof DialogPrimitives.Trigger
>;

const DialogTrigger = ({ children, ...props }: DialogTriggerProps) => {
  return (
    <DialogPrimitives.Trigger aria-controls={undefined} {...props}>
      {children}
    </DialogPrimitives.Trigger>
  );
};

type DialogContextValue = {
  triggerRef: DialogProps["triggerRef"];
};

const [DialogContext, useDialogContext] =
  createContextFactory<DialogContextValue>("Dialog");

type DialogContentContextValue = {
  animation: DialogContentProps["animation"];
};

const [DialogContentContext, useDialogContentContext] =
  createContextFactory<DialogContentContextValue>("DialogContent");

Dialog.Trigger = DialogTrigger;
Dialog.Close = DialogPrimitives.Close;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

export { Dialog };
