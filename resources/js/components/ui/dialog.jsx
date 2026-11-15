import * as React from "react"
import { cn } from "cn"
import { XIcon } from "lucide-react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { Button } from "@/components/ui/button"

function Dialog({
  ...props
}) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-[10000] bg-black/50 backdrop-blur-xs duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function MobileDragHandle({ onClose }) {
  const handleTouchStart = (e) => {
    const startY = e.touches[0].clientY;
    const content = e.currentTarget.closest('[data-slot="dialog-content"]');
    if (!content) return;

    let currentDelta = 0;

    const handleTouchMove = (ev) => {
      const deltaY = ev.touches[0].clientY - startY;
      if (deltaY > 0) {
        currentDelta = deltaY;
        content.style.transform = `translateY(${deltaY}px)`;
        content.style.transition = "none";
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      if (currentDelta > 80) {
        content.style.transition = "transform 0.22s cubic-bezier(0.32, 0.72, 0, 1)";
        content.style.transform = "translateY(100%)";
        setTimeout(() => {
          onClose?.();
        }, 160);
      } else {
        content.style.transition = "transform 0.24s cubic-bezier(0.16, 1, 0.3, 1)";
        content.style.transform = "translateY(0)";
        setTimeout(() => {
          if (content) {
            content.style.transform = "";
            content.style.transition = "";
          }
        }, 250);
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      className="mx-auto -mt-2 mb-2 h-6 w-24 flex items-center justify-center sm:hidden shrink-0 cursor-grab active:cursor-grabbing touch-none select-none"
      aria-label="Tarik ke bawah untuk menutup"
    >
      <div className="h-1.5 w-12 rounded-full bg-muted-foreground/35" />
    </div>
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  const closeRef = React.useRef(null);

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          // Base & Desktop Centered Modal
          "fixed top-[50%] left-[50%] z-[10001] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-2xl border bg-background p-6 shadow-2xl duration-200 outline-none sm:max-w-lg",
          className,
          // Mobile Bottom Sheet Mode (< 640px) matching Gambar 2
          "max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:translate-x-0 max-sm:translate-y-0 max-sm:max-w-none max-sm:rounded-t-[28px] max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 max-sm:border-t max-sm:max-h-[88vh] max-sm:overflow-y-auto max-sm:p-5 max-sm:pb-8"
        )}
        {...props}
      >
        {/* Interactive Mobile Pull / Drag Down to Dismiss Handle */}
        <MobileDragHandle onClose={() => closeRef.current?.click()} />
        {children}
        <DialogPrimitive.Close
          ref={closeRef}
          data-slot="dialog-close"
          className={cn(
            "absolute top-4 right-4 rounded-xl opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none cursor-pointer data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
            !showCloseButton && "sr-only"
          )}
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({
  className,
  ...props
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
