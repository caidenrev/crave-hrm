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
                const target = document.querySelector(item.link);
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({ behavior: "smooth" });
                }
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
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(12px)" : "none",
        boxShadow: visible
          ? "0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)"
          : "none",
        width: visible ? "92%" : "100%",
        paddingRight: visible ? "14px" : "0px",
        paddingLeft: visible ? "14px" : "0px",
        borderRadius: visible ? (isOpen ? "24px" : "32px") : "0px",
        y: visible ? 16 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "pointer-events-auto relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-3.5 lg:hidden transition-colors overflow-hidden text-[#111827]",
        visible && "bg-white/95 text-[#111827] shadow-md border border-slate-100",
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
          className={cn(
            "w-full flex flex-col items-start justify-start pt-6 pb-2 text-[#111827]",
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
    <div
      className={cn("cursor-pointer relative flex items-center justify-center text-[#111827] p-1.5", className)}
      onClick={onClick}
      aria-label="Toggle navigation"
    >
      <svg
        viewBox="0 0 32 32"
        className={cn(
          "h-6.5 w-6.5 transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
          isOpen ? "-rotate-45" : ""
        )}
      >
        <path
          className="fill-none stroke-current stroke-[3] rounded-full [stroke-linecap:round] [stroke-linejoin:round] transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            strokeDasharray: isOpen ? "20 300" : "12 63",
            strokeDashoffset: isOpen ? "-32.42" : "0",
          }}
          d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
        />
        <path
          className="fill-none stroke-current stroke-[3] rounded-full [stroke-linecap:round] [stroke-linejoin:round]"
          d="M7 16 27 16"
        />
      </svg>
    </div>
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
