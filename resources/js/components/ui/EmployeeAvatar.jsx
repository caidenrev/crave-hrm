import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getEmployeeAvatar } from "@/lib/avatars";
import { getInitials } from "@/lib/formatters";
import { cn } from "@/lib/utils";

/**
 * Avatar Karyawan & Pengguna Terstandar (Shadcn UI)
 * Menampilkan foto kustom atau avatar kartun deterministik, dengan inisial sebagai pengaman fallback.
 */
export function EmployeeAvatar({
  person,
  name,
  src,
  size = "default",
  className,
  imageClassName,
  fallbackClassName,
  ...props
}) {
  const displayName =
    name ||
    (typeof person === "string"
      ? person
      : person?.nama_lengkap || person?.full_name || person?.name || "Karyawan");

  const avatarSrc = src || getEmployeeAvatar(person || displayName);

  return (
    <Avatar
      size={size}
      className={cn("shrink-0 bg-white ring-1 ring-border/60", className)}
      {...props}
    >
      <AvatarImage
        src={avatarSrc}
        alt={displayName}
        decoding="async"
        className={cn("object-cover object-center", imageClassName)}
      />
      <AvatarFallback
        className={cn(
          "bg-primary/10 text-xs font-bold text-primary uppercase",
          fallbackClassName
        )}
      >
        {getInitials(displayName)}
      </AvatarFallback>
    </Avatar>
  );
}
