"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { smoothScrollTo } from "@/lib/smoothScroll";
import { Menu, X } from "lucide-react";

export const Navbar = ({ children, className }) => {
  const ref = useRef(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 0) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={cn("fixed inset-x-0 top-2.5 z-[100] w-full pointer-events-none px-4", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { visible: child.props.visible !== undefined ? child.props.visible : visible })
          : child
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(12px)" : "none",
        boxShadow: visible
          ? "0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)"
          : "none",
        width: visible ? "85%" : "100%",
        y: visible ? 8 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 50,
        duration: 1,
      }}
      style={{
        minWidth: "820px",
      }}
      className={cn(
        "pointer-events-auto relative z-[60] mx-auto hidden w-full max-w-6xl flex-row items-center justify-between self-start rounded-bl-2xl rounded-br-2xl bg-transparent px-6 py-3.5 lg:flex transition-colors duration-300 text-[#111827]",
        visible && "bg-white/95 rounded-full text-[#111827] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06)] border border-slate-100",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick, isScrolled }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-1 lg:space-x-1.5 text-sm font-medium transition duration-200 lg:flex",
        className
      )}
    >
      <LayoutGroup id="hrm-navbar-pill">
        {items.map((item, idx) => (
          <a
            onMouseEnter={() => setHovered(idx)}
            onClick={(e) => {
              if (item.link?.startsWith("#")) {
                e.preventDefault();
                smoothScrollTo(item.link);
              }
              if (onItemClick) onItemClick();
            }}
            className="relative px-3 py-1.5 font-medium z-10 select-none cursor-pointer"
            key={`link-${idx}`}
            href={item.link}
          >
            {hovered === idx && (
              <motion.div
                layoutId="nav-item-hover"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute inset-0 h-full w-full rounded-full bg-slate-100 -z-10"
              />
            )}
            <span className="relative z-20 flex items-start text-[#111827]">
              <span className="font-extrabold uppercase tracking-tight text-[12.5px] text-[#111827] hover:text-[#1B5CFE] transition-colors">
                {item.name}
              </span>
              <span className="text-[9.5px] font-bold ml-0.5 text-[#1B5CFE]">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </span>
          </a>
        ))}
      </LayoutGroup>
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible, isOpen }) => {
  const isCard = visible || isOpen;
  return (
    <motion.div
      animate={{
        backdropFilter: isCard ? "blur(16px)" : "none",
        boxShadow: isCard
          ? "0 20px 45px -12px rgba(0, 0, 0, 0.14), 0 0 0 1px rgba(0, 0, 0, 0.05)"
          : "none",
        width: isCard ? (isOpen ? "100%" : "92%") : "100%",
        paddingRight: isCard ? (isOpen ? "20px" : "16px") : "0px",
        paddingLeft: isCard ? (isOpen ? "20px" : "16px") : "0px",
        paddingTop: isCard ? (isOpen ? "16px" : "12px") : "8px",
        paddingBottom: isCard ? (isOpen ? "16px" : "12px") : "8px",
        borderRadius: isCard ? (isOpen ? "28px" : "32px") : "0px",
        y: isCard ? (isOpen ? 4 : 16) : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 32,
      }}
      className={cn(
        "pointer-events-auto relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between transition-colors overflow-hidden text-[#111827] lg:hidden",
        isCard
          ? "bg-white text-[#111827] border border-slate-100 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.14),0_0_0_1px_rgba(0,0,0,0.05)] rounded-[28px]"
          : "bg-transparent text-[#111827]",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-row items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-full flex flex-col items-start justify-start pt-5 pb-1 text-[#111827]",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick, className }) => {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer size-9 rounded-full flex items-center justify-center text-[#111827] hover:bg-slate-100 active:bg-slate-200 transition-colors shrink-0",
        className
      )}
      onClick={onClick}
      aria-label={isOpen ? "Tutup navigasi" : "Buka navigasi"}
    >
      {isOpen ? (
        <X className="size-5.5 stroke-[2.3]" />
      ) : (
        <Menu className="size-5.5 stroke-[2.3]" />
      )}
    </button>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4.5 py-1.5 rounded-full text-xs font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-flex items-center justify-center text-center";

  const variantStyles = {
    primary:
      "bg-white text-[#1B5CFE] border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-slate-50",
    secondary: "bg-transparent shadow-none text-[#111827]",
    dark: "bg-[#161924] hover:bg-[#232738] text-white shadow-xs",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
    outline: "border border-current bg-transparent",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};
