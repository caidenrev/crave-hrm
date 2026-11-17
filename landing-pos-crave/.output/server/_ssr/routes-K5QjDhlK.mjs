import { i as __toESM } from "../_runtime.mjs";
import { a as AnimatePresence, i as LayoutGroup, n as useMotionValueEvent, r as motion, t as useScroll } from "../_libs/framer-motion+[...].mjs";
import { n as gsapWithCSS, r as require_react } from "../_libs/gsap+gsap__react+react.mjs";
import { a as Trigger2, h as require_jsx_runtime, i as Root2, n as Header, p as Slot, r as Item, t as Content2 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Store, c as Lock, d as Instagram, f as Image, h as ArrowLeft, i as TrendingUp, l as Linkedin, m as ArrowRight, n as UserCog, o as Quote, p as Check, r as TriangleAlert, s as Plus, t as Users, u as LayoutTemplate } from "../_libs/lucide-react.mjs";
import { t as motion$1 } from "../_libs/motion.mjs";
import { t as require_matter } from "../_libs/matter-js.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-K5QjDhlK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_matter = /* @__PURE__ */ __toESM(require_matter());
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var POS_URL = "/pos-system";
function Logo({ isScrolled, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: "/",
		className: cn("relative z-50 flex items-center gap-2 cursor-pointer", className),
		onClick: (e) => {
			e.preventDefault();
			window.dispatchEvent(new CustomEvent("start-page-transition", { detail: {
				href: "/",
				name: "Crave",
				isHome: true
			} }));
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: isScrolled ? "/image/logo/light-mode-logo.png" : "/image/logo/dark-mode-logo.png",
			alt: "Crave Logo",
			className: "h-6 w-auto"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("text-xl font-bold tracking-tight", isScrolled ? "text-slate-900" : "text-white"),
			children: "Crave"
		})]
	});
}
var Navbar = ({ children, className }) => {
	const ref = (0, import_react.useRef)(null);
	const { scrollY } = useScroll({
		target: ref,
		offset: ["start start", "end start"]
	});
	const [visible, setVisible] = (0, import_react.useState)(false);
	useMotionValueEvent(scrollY, "change", (latest) => {
		if (latest > 0) setVisible(true);
		else setVisible(false);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		ref,
		className: cn("fixed inset-x-0 top-2.5 z-[100] w-full", className),
		children: import_react.Children.map(children, (child) => import_react.isValidElement(child) ? import_react.cloneElement(child, { visible }) : child)
	});
};
var NavBody = ({ children, className, visible }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		animate: {
			backdropFilter: visible ? "blur(10px)" : "none",
			boxShadow: visible ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset" : "none",
			width: visible ? "80%" : "100%",
			y: visible ? 10 : 0
		},
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 50,
			duration: 1
		},
		style: { minWidth: "800px" },
		className: cn("relative z-[60] mx-auto hidden w-full max-w-6xl flex-row items-center justify-between self-start rounded-bl-2xl rounded-br-2xl bg-transparent px-6 py-4 lg:flex dark:bg-frame transition-colors duration-300 text-white", visible && "bg-white/90 dark:bg-[#0a0a0a] rounded-full text-slate-900", className),
		children
	});
};
var NavItems = ({ items, className, onItemClick, isScrolled }) => {
	const [hovered, setHovered] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		onMouseLeave: () => setHovered(null),
		className: cn("absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium transition duration-200 lg:flex lg:space-x-4", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGroup, { children: items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			onMouseEnter: () => setHovered(idx),
			onClick: (e) => {
				if (item.link.startsWith("#")) {
					e.preventDefault();
					window.dispatchEvent(new CustomEvent("start-page-transition", { detail: {
						href: item.link,
						name: item.name
					} }));
				}
				if (onItemClick) onItemClick();
			},
			className: "relative px-4 py-2 font-medium z-10",
			href: item.link,
			children: [hovered === idx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				layoutId: "nav-item-hover",
				transition: {
					type: "spring",
					stiffness: 400,
					damping: 30
				},
				className: "absolute inset-0 h-full w-full rounded-full bg-white/20 dark:bg-neutral-800 -z-10"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "relative z-20 flex items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-black uppercase tracking-tight",
					children: item.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[10px] font-bold ml-0.5 mt-0.5", isScrolled ? "text-[#1B5CFE]" : "text-white/60"),
					children: String(idx + 1).padStart(2, "0")
				})]
			})]
		}, `link-${idx}`)) })
	});
};
var MobileNav = ({ children, className, visible, isOpen }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		animate: {
			backdropFilter: visible ? "blur(10px)" : "none",
			boxShadow: visible ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset" : "none",
			width: visible ? "90%" : "100%",
			paddingRight: visible ? "12px" : "0px",
			paddingLeft: visible ? "12px" : "0px",
			borderRadius: visible ? isOpen ? "24px" : "32px" : "0px",
			y: visible ? 20 : 0
		},
		transition: {
			type: "spring",
			stiffness: 200,
			damping: 50
		},
		className: cn("relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-4 lg:hidden transition-colors overflow-hidden", visible && "bg-white/90 dark:bg-frame", className),
		children
	});
};
var MobileNavHeader = ({ children, className }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex w-full flex-row items-center justify-between", className),
		children
	});
};
var MobileNavMenu = ({ children, className, isOpen, onClose }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		initial: {
			opacity: 0,
			height: 0
		},
		animate: {
			opacity: 1,
			height: "auto"
		},
		exit: {
			opacity: 0,
			height: 0
		},
		className: cn("w-full flex flex-col items-start justify-start pt-6 pb-2", className),
		children
	}) });
};
var MobileNavToggle = ({ isOpen, onClick, className }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("cursor-pointer relative flex items-center justify-center", className),
		onClick,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 32 32",
			className: cn("h-7 w-7 transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]", isOpen ? "-rotate-45" : ""),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: "fill-none stroke-current stroke-[3] rounded-full [stroke-linecap:round] [stroke-linejoin:round] transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
				style: {
					strokeDasharray: isOpen ? "20 300" : "12 63",
					strokeDashoffset: isOpen ? "-32.42" : "0"
				},
				d: "M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				className: "fill-none stroke-current stroke-[3] rounded-full [stroke-linecap:round] [stroke-linejoin:round]",
				d: "M7 16 27 16"
			})]
		})
	});
};
var NavbarButton = ({ href, as: Tag = "a", children, className, variant = "primary", ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
		href: href || void 0,
		className: cn("px-5 py-2 rounded-full text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center", {
			primary: "bg-white text-[#1B5CFE] shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
			secondary: "bg-transparent shadow-none dark:text-white",
			dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06)]",
			gradient: "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
			outline: "border border-current bg-transparent"
		}[variant], className),
		onClick: (e) => {
			if (href && href.startsWith("#")) {
				e.preventDefault();
				window.dispatchEvent(new CustomEvent("start-page-transition", { detail: {
					href,
					name: typeof children === "string" ? children : "Action"
				} }));
			}
			if (props.onClick) props.onClick(e);
		},
		...props,
		children
	});
};
var NAV = [
	"Produk",
	"Solusi",
	"Fitur",
	"Testimoni",
	"FAQ"
];
function LandingNavbar() {
	const [isScrolled, setIsScrolled] = (0, import_react.useState)(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Navbar, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NavBody, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { isScrolled }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItems, {
			items: NAV.map((item) => ({
				name: item,
				link: `#${item.toLowerCase()}`
			})),
			isScrolled
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end hidden lg:flex",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavbarButton, {
				href: POS_URL,
				children: "Coba Sekarang"
			})
		})
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileNav, {
		isOpen: isMobileMenuOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MobileNavHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { isScrolled }), isScrolled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNavToggle, {
			isOpen: isMobileMenuOpen,
			onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
			className: "text-slate-900"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavbarButton, {
			href: POS_URL,
			variant: "outline",
			className: "text-white border-white/50 hover:bg-white/10 px-4 py-1.5 text-xs",
			children: "Coba Sekarang"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNavMenu, {
			isOpen: isMobileMenuOpen,
			onClose: () => setIsMobileMenuOpen(false),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				className: "flex flex-col gap-2 w-full",
				initial: "hidden",
				animate: "visible",
				exit: "hidden",
				variants: {
					visible: { transition: { staggerChildren: .08 } },
					hidden: { transition: {
						staggerChildren: .05,
						staggerDirection: -1
					} }
				},
				children: [NAV.map((item, idx) => {
					const num = String(idx + 1).padStart(2, "0");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.a, {
						variants: {
							hidden: {
								opacity: 0,
								y: 20
							},
							visible: {
								opacity: 1,
								y: 0,
								transition: {
									type: "spring",
									stiffness: 300,
									damping: 24
								}
							}
						},
						href: `#${item.toLowerCase()}`,
						onClick: (e) => {
							e.preventDefault();
							setIsMobileMenuOpen(false);
							window.dispatchEvent(new CustomEvent("start-page-transition", { detail: {
								href: `#${item.toLowerCase()}`,
								name: item
							} }));
						},
						className: "flex flex-col py-2 relative overflow-hidden group text-slate-900 dark:text-slate-100 hover:text-[#1B5CFE] transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-none",
								children: item
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm sm:text-base font-semibold text-[#1B5CFE] ml-1 mt-1",
								children: num
							})]
						})
					}, item);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					variants: {
						hidden: {
							opacity: 0,
							y: 20
						},
						visible: {
							opacity: 1,
							y: 0,
							transition: {
								type: "spring",
								stiffness: 300,
								damping: 24
							}
						}
					},
					className: "mt-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavbarButton, {
						href: POS_URL,
						onClick: () => setIsMobileMenuOpen(false),
						className: "w-full",
						children: "Coba Sekarang"
					})
				})]
			})
		})]
	})] });
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function ImageFrame({ label = "your image", ratio = "16 / 9", className, src, alt }) {
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: alt ?? label,
		loading: "lazy",
		style: { aspectRatio: ratio },
		className: cn("w-full rounded-xl object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { aspectRatio: ratio },
		className: cn("frame-placeholder w-full rounded-xl", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2 px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
				className: "h-6 w-6 opacity-60",
				"aria-hidden": true
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-semibold tracking-[0.18em] uppercase opacity-80",
				children: label
			})]
		})
	});
}
function HeroSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "bg-hero relative overflow-hidden pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/image/cloud.png",
						alt: "",
						className: "absolute -top-[5%] -left-[5%] w-[500px] opacity-20 blur-[2px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/image/cloud (2).png",
						alt: "",
						className: "absolute top-[10%] right-[-5%] w-[400px] opacity-30"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/image/cloud.png",
						alt: "",
						className: "absolute top-[30%] left-[10%] w-[300px] opacity-15 blur-[1px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/image/cloud (2).png",
						alt: "",
						className: "absolute top-[40%] right-[15%] w-[450px] opacity-20 blur-[3px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/image/cloud.png",
						alt: "",
						className: "absolute top-[60%] left-[-10%] w-[600px] opacity-25"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/image/cloud (2).png",
						alt: "",
						className: "absolute top-[75%] right-[-10%] w-[550px] opacity-20 blur-[2px]"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/image/cloud.png",
						alt: "",
						className: "absolute top-[80%] left-[20%] w-[350px] opacity-30 blur-[1px]"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-auto max-w-3xl px-6 pt-32 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl leading-[1.05] font-bold tracking-tight text-brand-foreground sm:text-5xl md:text-6xl",
						children: "Kelola bisnis anda di dalam #1 Software"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-6 max-w-xl text-sm text-brand-foreground/85 sm:text-base",
						children: "Otomatisasi pengelolaan bisnis ada dengan crave yang mampu memangkas waktu workflow dan managemen dengan satu software yang anda bisa kelola dimanapun"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "h-11 rounded-full bg-white px-7 text-sm font-bold text-[#1B5CFE] hover:bg-slate-50 shadow-md transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: POS_URL,
								children: "Coba Sekarang"
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-10 mx-auto mt-14 max-w-[1120px] px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] relative rounded-[2rem] border border-white/10 bg-white/10 p-2 backdrop-blur-2xl sm:p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/5 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative z-10 overflow-hidden rounded-[1.25rem] bg-card shadow-2xl border border-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageFrame, {
							src: "/image/hero.png",
							ratio: "16 / 10",
							className: "w-full"
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-[250px] w-full bg-gradient-to-t from-background via-background/95 to-transparent" })
		]
	});
}
var LOGOS = [
	{
		src: "/logo/AWS Logo - Colored - zonalogo.com.svg",
		alt: "AWS"
	},
	{
		src: "/logo/Azure Logo - Colored - zonalogo.com.svg",
		alt: "Azure"
	},
	{
		src: "/logo/Google Cloud Icon - Colored - zonalogo.com.svg",
		alt: "Google Cloud"
	},
	{
		src: "/logo/Supabase Icon - Colored - zonalogo.com.svg",
		alt: "Supabase"
	}
];
function LogosSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border bg-background py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-center text-[11px] font-bold tracking-[0.25em] text-brand uppercase",
			children: "Trusted by leaders"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-10 px-6 sm:gap-20",
			children: LOGOS.map((logo) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: logo.src,
				alt: logo.alt,
				className: "h-10 w-auto opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:brightness-200 dark:contrast-200 dark:grayscale dark:hover:brightness-100 dark:hover:contrast-100 dark:hover:grayscale-0"
			}, logo.alt))
		})]
	});
}
function GridCross({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className: cn("absolute text-foreground/25 hidden md:block", className),
		width: "31",
		height: "31",
		viewBox: "0 0 31 31",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M15.5 0V31M0 15.5H31",
			stroke: "currentColor",
			strokeWidth: "3"
		})
	});
}
function StripedPattern({ direction = "left", className, width = 10, height = 10, ...props }) {
	const id = (0, import_react.useId)();
	const w = Number(width);
	const h = Number(height);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		"aria-hidden": "true",
		className: cn("pointer-events-none absolute inset-0 z-10 h-full w-full stroke-[0.5]", className),
		xmlns: "http://www.w3.org/2000/svg",
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
			id,
			width: w,
			height: h,
			patternUnits: "userSpaceOnUse",
			children: direction === "left" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "0",
					y1: h,
					x2: w,
					y2: "0",
					stroke: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: -w,
					y1: h,
					x2: "0",
					y2: "0",
					stroke: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: w,
					y1: h,
					x2: w * 2,
					y2: "0",
					stroke: "currentColor"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "0",
					y1: "0",
					x2: w,
					y2: h,
					stroke: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: -w,
					y1: "0",
					x2: "0",
					y2: h,
					stroke: "currentColor"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: w,
					y1: "0",
					x2: w * 2,
					y2: h,
					stroke: "currentColor"
				})
			] })
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "100%",
			height: "100%",
			fill: `url(#${id})`
		})]
	});
}
var SOLUTIONS = [
	{
		icon: "/3D-icon/3D-icon-2/listbook.png",
		body: "Catat pemasukan dan pengeluaran otomatis dari penjualan tanpa harus klik"
	},
	{
		icon: "/3D-icon/3D-icon-2/calendar.png",
		body: "Pantau stok dan penjualan item atau manajemen barang secara cepat di perangkat anda"
	},
	{
		icon: "/3D-icon/3D-icon-2/invoice.png",
		body: "Invoice otomatis dengan PDF atau struk yang bisa di koneksi kan ke perangkat cetak pribadi mu"
	}
];
function SolutionsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "solusi",
		className: "relative border-b border-foreground/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl overflow-hidden md:border-x border-foreground/15 px-6 pb-0 pt-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripedPattern, { className: "!-z-10 text-foreground/20 [mask-image:linear-gradient(to_bottom,black_5%,transparent_25%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs font-medium text-[#1B5CFE]",
						children: "Solusi"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mx-auto mt-8 max-w-xl text-center text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl",
					children: "Masih kelola bisnis pakai cara manual?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-3 max-w-xl text-center text-sm text-muted-foreground sm:text-base",
					children: "Hadirnya crave mampu memberikan kemudahan bagi para pelaku UMKM dalam mengelola bisnis dengan lebih efisien dan efektif."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative -mx-6 mt-14 grid border-y border-foreground/30 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-[1.5px] -left-[1.5px] z-10 hidden h-4 w-4 border-l-[3px] border-t-[3px] border-foreground/40 md:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-[1.5px] -right-[1.5px] z-10 hidden h-4 w-4 border-r-[3px] border-t-[3px] border-foreground/40 md:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -top-[1.5px] left-[calc(33.333%-15.5px)] z-10 hidden h-[15.5px] w-[31px] justify-center md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 h-[3px] w-full bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[3px] bg-foreground/40" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -top-[1.5px] left-[calc(66.667%-15.5px)] z-10 hidden h-[15.5px] w-[31px] justify-center md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 h-[3px] w-full bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[3px] bg-foreground/40" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-[1.5px] -left-[1.5px] z-10 hidden h-4 w-4 border-b-[3px] border-l-[3px] border-foreground/40 md:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-[1.5px] -right-[1.5px] z-10 hidden h-4 w-4 border-b-[3px] border-r-[3px] border-foreground/40 md:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -bottom-[1.5px] left-[calc(33.333%-15.5px)] z-10 hidden h-[15.5px] w-[31px] justify-center md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 h-[3px] w-full bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[3px] bg-foreground/40" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute -bottom-[1.5px] left-[calc(66.667%-15.5px)] z-10 hidden h-[15.5px] w-[31px] justify-center md:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 h-[3px] w-full bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-[3px] bg-foreground/40" })]
						}),
						SOLUTIONS.map(({ icon, body }, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("px-6 py-10 md:px-12", idx > 0 && "md:border-l md:border-foreground/30"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: icon,
								alt: "",
								className: "h-16 w-16 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm leading-relaxed text-muted-foreground",
								children: body
							})]
						}, body))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto mt-14 max-w-5xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/3D-icon/calendar.png",
							alt: "Calendar",
							className: "absolute -left-6 top-[35%] z-20 w-24 -rotate-6 transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:rotate-0 drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)] drop-shadow-[0_5px_10px_rgba(0,0,0,0.2)] sm:-left-16 sm:w-40"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/3D-icon/business-report.png",
							alt: "Business Report",
							className: "absolute -right-4 top-[25%] z-20 w-20 rotate-6 transition-transform duration-300 hover:-translate-y-2 hover:scale-105 hover:rotate-0 drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)] drop-shadow-[0_5px_10px_rgba(0,0,0,0.2)] sm:-right-14 sm:w-36"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 overflow-hidden rounded-t-[2.5rem] bg-gradient-to-b from-[#24b2ff] to-[#018df8] px-4 pt-4 sm:px-10 sm:pt-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative mx-auto w-full max-w-4xl overflow-hidden rounded-t-2xl shadow-2xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/solution.png",
									alt: "App Dashboard",
									className: "w-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent z-20" })]
						})
					]
				})
			]
		})
	});
}
function BentoFeaturesSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-foreground/15 bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15 px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripedPattern, { className: "!-z-10 text-foreground/20 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_100%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "border border-foreground/15 rounded-full bg-card px-4 py-1.5 text-xs font-medium text-[#1B5CFE]",
						children: "Fitur Unggulan"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
					children: "Lakukan semua di satu tempat"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-center text-sm text-muted-foreground",
					children: "Kelola toko kamu cukup dari satu aplikasi kasir yang lengkap"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 grid gap-6 lg:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "shadow-card flex flex-col justify-between rounded-3xl bg-card p-8 lg:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 flex items-center justify-center mb-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/features/card.png",
									alt: "",
									className: "w-11/12 h-auto object-contain drop-shadow-xl"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-center text-xl font-bold text-foreground",
								children: "Update Stok"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-sm text-muted-foreground",
								children: "Peringatan update stok cepat untuk kamu yang sering lupa update stok item update progress in real-time."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "shadow-card relative overflow-hidden flex flex-col rounded-3xl bg-card lg:col-span-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-8 pb-0 z-10 w-full sm:w-2/3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold text-foreground",
									children: "Spreadsheet Data"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground",
									children: "Ga perlu lagi buka tutup excel untuk cek laporan. Kamu bisa import file CSV/Excel langsung di aplikasi!"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 flex items-end justify-end mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/features/spreadsheet.png",
									alt: "",
									className: "w-11/12 sm:w-[85%] max-w-none h-auto object-cover object-left-top rounded-tl-2xl drop-shadow-xl"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "shadow-card relative overflow-hidden flex flex-col rounded-3xl bg-card lg:col-span-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-8 pb-0 z-10 w-full sm:w-2/3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold text-foreground",
									children: "Buku Kas (Pengeluaran)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground",
									children: "Catat biaya operasional dan bahan baku agar laba bersih toko kamu terhitung akurat."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 flex items-end justify-end mt-8",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/features/kartu-stok.png",
									alt: "",
									className: "w-11/12 sm:w-[70%] max-w-none h-auto object-contain object-left-top rounded-tl-2xl drop-shadow-xl"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "relative overflow-hidden flex flex-col justify-center items-center rounded-3xl lg:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-8 pb-0 z-10 w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-center text-xl font-bold text-foreground",
									children: "Akses Karyawan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-center text-sm text-muted-foreground",
									children: [
										"Lindungi akses kasir ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										" menggunakan PIN aman"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/image/features/terlaris.png",
								alt: "",
								className: "mt-8 w-full h-auto object-cover drop-shadow-md"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-10 text-center text-sm text-muted-foreground",
					children: "dan masih banyak fitur lainnya..."
				})
			]
		})
	});
}
function DotPattern({ width = 16, height = 16, x = 0, y = 0, cx = 1, cy = 1, cr = 1, className, glow = false, ...props }) {
	const id = (0, import_react.useId)();
	const patternId = `${id}-pattern`;
	const w = Number(width);
	const h = Number(height);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		"aria-hidden": "true",
		className: cn("pointer-events-none absolute inset-0 h-full w-full text-neutral-400/80", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("radialGradient", {
			id: `${id}-gradient`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
				offset: "0%",
				stopColor: "currentColor",
				stopOpacity: "1"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
				offset: "100%",
				stopColor: "currentColor",
				stopOpacity: "0"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
			id: patternId,
			width: w,
			height: h,
			patternUnits: "userSpaceOnUse",
			x,
			y,
			children: glow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion$1.circle, {
				cx,
				cy,
				r: cr,
				fill: `url(#${id}-gradient)`,
				initial: {
					opacity: .4,
					scale: 1
				},
				animate: {
					opacity: [
						.4,
						1,
						.4
					],
					scale: [
						1,
						1.5,
						1
					]
				},
				transition: {
					duration: Math.random() * 3 + 2,
					repeat: Infinity,
					repeatType: "reverse",
					delay: Math.random() * 5,
					ease: "easeInOut"
				}
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx,
				cy,
				r: cr,
				fill: "currentColor"
			})
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "100%",
			height: "100%",
			fill: `url(#${patternId})`
		})]
	});
}
function AboutSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "about",
		className: "border-b border-foreground/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15 px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DotPattern, { className: "!-z-10 text-foreground/60 [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs font-medium text-[#1B5CFE]",
						children: "Tentang Kami"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mx-auto mt-4 max-w-2xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight",
					children: "Misi Kami: Membantu Pelaku UMKM Naik Kelas dengan Digitalisasi Sederhana"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-14 grid gap-10 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "text-center group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-card shadow-card flex flex-col items-center justify-center p-8 border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-tr from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 aspect-[4/3] relative overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-red-500/5 blur-xl pointer-events-none rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-16 text-red-500/80 relative z-10 drop-shadow-sm group-hover:rotate-12 transition-transform duration-300" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-8 text-lg font-bold text-foreground",
									children: "Tantangan Pembukuan Manual"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground",
									children: "Banyak pelaku UMKM kehilangan profit akibat kesalahan hitung manual, catatan utang kertas yang terselip, dan minimnya kontrol stok barang."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "text-center group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-card shadow-card flex items-center justify-center p-8 border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-tr from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 aspect-[4/3] relative overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-blue-500/10 blur-2xl pointer-events-none rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/light-mode-logo.png",
										alt: "Crave Logo",
										className: "h-16 w-auto relative z-10 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-8 text-lg font-bold text-foreground",
									children: "Mengapa Crave Dibuat?"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground",
									children: "Crave hadir untuk merombak pencatatan konvensional menjadi digital secara gratis, instan, dan super mudah digunakan oleh siapa saja."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "text-center group",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl bg-card shadow-card flex flex-col items-center justify-center p-8 border border-slate-200/50 dark:border-slate-800/50 bg-gradient-to-tr from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 aspect-[4/3] relative overflow-hidden",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-green-500/5 blur-xl pointer-events-none rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-16 text-green-500/80 relative z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-8 text-lg font-bold text-foreground",
									children: "Bisnis Lebih Terkontrol"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground",
									children: "Pantau laporan keuangan harian, riwayat stok masuk-keluar secara otomatis, dan kelola utang pelanggan langsung dari satu dashboard."
								})
							]
						})
					]
				})
			]
		})
	});
}
var blueClasses = [
	"bg-blue-100 text-blue-900 border-blue-200",
	"bg-blue-200 text-blue-950 border-blue-300",
	"bg-blue-300 text-blue-950 border-blue-400",
	"bg-blue-400 text-white border-blue-500",
	"bg-blue-500 text-white border-blue-600",
	"bg-blue-600 text-white border-blue-700",
	"bg-blue-700 text-white border-blue-800",
	"bg-blue-800 text-blue-50 border-blue-900",
	"bg-blue-900 text-blue-50 border-blue-950",
	"bg-slate-800 text-blue-400 border-slate-700"
];
var FallingText = ({ className = "", text = "", highlightWords = [], highlightClass = "highlighted", trigger = "auto", backgroundColor = "transparent", wireframes = false, gravity = 1, mouseConstraintStiffness = .2, fontSize = "1rem", children }) => {
	const containerRef = (0, import_react.useRef)(null);
	const textRef = (0, import_react.useRef)(null);
	const canvasContainerRef = (0, import_react.useRef)(null);
	const [effectStarted, setEffectStarted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!textRef.current || children) return;
		const words = text.split(" ");
		const shuffledBlues = [...blueClasses].sort(() => Math.random() - .5);
		const newHTML = words.map((word, i) => {
			const isHighlighted = highlightWords.some((hw) => word.startsWith(hw));
			return `<span class="word rounded-full px-5 py-2.5 border-2 shadow-lg font-bold transition-transform hover:scale-110 cursor-grab active:cursor-grabbing ${shuffledBlues[i % shuffledBlues.length]} ${isHighlighted ? highlightClass : ""}">${word}</span>`;
		}).join(" ");
		textRef.current.innerHTML = newHTML;
	}, [
		text,
		highlightWords,
		highlightClass
	]);
	(0, import_react.useEffect)(() => {
		if (trigger === "auto") {
			setEffectStarted(true);
			return;
		}
		if (trigger === "scroll" && containerRef.current) {
			const observer = new IntersectionObserver((entries) => {
				if (entries[0]?.isIntersecting) {
					setEffectStarted(true);
					observer.disconnect();
				}
			}, { threshold: .1 });
			observer.observe(containerRef.current);
			return () => observer.disconnect();
		}
	}, [trigger]);
	(0, import_react.useEffect)(() => {
		if (!effectStarted) return;
		const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = import_matter.default;
		const containerRect = containerRef.current.getBoundingClientRect();
		const width = containerRect.width;
		const height = containerRect.height;
		if (width <= 0 || height <= 0) return;
		const engine = Engine.create();
		engine.world.gravity.y = gravity;
		const render = Render.create({
			element: canvasContainerRef.current,
			engine,
			options: {
				width,
				height,
				background: backgroundColor,
				wireframes
			}
		});
		const boundaryOptions = {
			isStatic: true,
			render: { fillStyle: "transparent" }
		};
		const floor = Bodies.rectangle(width / 2, height + 50, width + 200, 100, boundaryOptions);
		const ceiling = Bodies.rectangle(width / 2, -50, width + 200, 100, boundaryOptions);
		const leftWall = Bodies.rectangle(-50, height / 2, 100, height + 200, boundaryOptions);
		const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height + 200, boundaryOptions);
		const wordBodies = [...textRef.current.querySelectorAll(".word, .matter-element")].map((elem) => {
			const rect = elem.getBoundingClientRect();
			const x = rect.left - containerRect.left + rect.width / 2;
			const y = rect.top - containerRect.top + rect.height / 2;
			const radius = elem.classList.contains("rounded-full") ? rect.height / 2 : 16;
			const body = Bodies.rectangle(x, y, rect.width, rect.height, {
				render: { fillStyle: "transparent" },
				restitution: .8,
				frictionAir: .02,
				friction: .1,
				chamfer: { radius: [
					radius,
					radius,
					radius,
					radius
				] }
			});
			import_matter.default.Body.setVelocity(body, {
				x: (Math.random() - .5) * 5,
				y: 0
			});
			import_matter.default.Body.setAngularVelocity(body, (Math.random() - .5) * .05);
			return {
				elem,
				body
			};
		});
		wordBodies.forEach(({ elem }) => {
			elem.style.position = "absolute";
			elem.style.left = `0px`;
			elem.style.top = `0px`;
			elem.style.margin = `0px`;
			elem.style.transform = "none";
		});
		const mouse = Mouse.create(containerRef.current);
		const m = mouse;
		mouse.element.removeEventListener("wheel", m.mousewheel);
		mouse.element.removeEventListener("mousewheel", m.mousewheel);
		mouse.element.removeEventListener("DOMMouseScroll", m.mousewheel);
		mouse.element.removeEventListener("touchmove", m.mousemove);
		mouse.element.removeEventListener("touchstart", m.mousedown);
		mouse.element.removeEventListener("touchend", m.mouseup);
		const mouseConstraint = MouseConstraint.create(engine, {
			mouse,
			constraint: {
				stiffness: mouseConstraintStiffness,
				render: { visible: false }
			}
		});
		render.mouse = mouse;
		World.add(engine.world, [
			floor,
			leftWall,
			rightWall,
			ceiling,
			mouseConstraint,
			...wordBodies.map((wb) => wb.body)
		]);
		const runner = Runner.create();
		Runner.run(runner, engine);
		Render.run(render);
		let animationFrameId;
		const updateLoop = () => {
			wordBodies.forEach(({ body, elem }) => {
				const { x, y } = body.position;
				elem.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${body.angle}rad)`;
			});
			import_matter.default.Engine.update(engine);
			animationFrameId = requestAnimationFrame(updateLoop);
		};
		updateLoop();
		let lastScrollY = window.scrollY;
		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const scrollDelta = currentScrollY - lastScrollY;
			lastScrollY = currentScrollY;
			if (Math.abs(scrollDelta) > 2) wordBodies.forEach(({ body }) => {
				import_matter.default.Body.setVelocity(body, {
					x: body.velocity.x + (Math.random() - .5) * 1.5,
					y: body.velocity.y + scrollDelta * -.05
				});
				import_matter.default.Body.setAngularVelocity(body, body.angularVelocity + (Math.random() - .5) * .1);
			});
		};
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
			cancelAnimationFrame(animationFrameId);
			Render.stop(render);
			Runner.stop(runner);
			if (render.canvas && canvasContainerRef.current) canvasContainerRef.current.removeChild(render.canvas);
			World.clear(engine.world, false);
			Engine.clear(engine);
		};
	}, [
		effectStarted,
		gravity,
		wireframes,
		backgroundColor,
		mouseConstraintStiffness
	]);
	const handleTrigger = () => {
		if (!effectStarted && (trigger === "click" || trigger === "hover")) setEffectStarted(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: `falling-text-container ${className}`,
		onClick: trigger === "click" ? handleTrigger : void 0,
		onMouseEnter: trigger === "hover" ? handleTrigger : void 0,
		style: { position: "relative" },
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: textRef,
			className: "falling-text-target",
			style: {
				fontSize,
				lineHeight: 1.6
			},
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: canvasContainerRef,
			className: "falling-text-canvas pointer-events-none"
		})]
	});
};
function FallingObjectsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-foreground/15 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15 px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4",
						children: "Semua yang anda butuhkan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-lg text-muted-foreground justify-center text-center mt-2",
						children: "Semua software untuk kebutuhan otomatisasi pekerjaan dan bisnis anda"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative -mx-6 mt-12 border-y border-foreground/15",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -top-[15.5px] -left-[15.5px] z-10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -top-[15.5px] -right-[15.5px] z-10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "h-[450px] md:h-[500px] relative overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripedPattern, { className: "!-z-10 text-foreground/20 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_100%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallingText, {
								trigger: "scroll",
								backgroundColor: "transparent",
								gravity: .56,
								mouseConstraintStiffness: .9,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-center items-center gap-4 md:gap-8 max-w-5xl mx-auto pt-2 md:pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element inline-flex items-center justify-center bg-blue-600 text-white font-black text-2xl md:text-4xl px-8 md:px-12 py-4 md:py-6 rounded-[50px] rounded-full shadow-lg cursor-grab active:cursor-grabbing",
											children: "CRM"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element rounded-2xl inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-indigo-500 text-white shadow-[0_8px_15px_rgba(99,102,241,0.4)] border-2 md:border-[3px] border-white dark:border-slate-900 cursor-grab active:cursor-grabbing",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-8 h-8 md:w-10 md:h-10 pointer-events-none" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element inline-flex items-center justify-center bg-blue-600 text-white font-black text-2xl md:text-4xl px-8 md:px-12 py-4 md:py-6 rounded-[50px] rounded-full shadow-lg cursor-grab active:cursor-grabbing",
											children: "HRM"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element rounded-2xl inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-purple-500 text-white shadow-[0_8px_15px_rgba(168,85,247,0.4)] border-2 md:border-[3px] border-white dark:border-slate-900 cursor-grab active:cursor-grabbing",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "w-8 h-8 md:w-10 md:h-10 pointer-events-none" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element inline-flex items-center justify-center bg-blue-600 text-white font-black text-2xl md:text-4xl px-8 md:px-12 py-4 md:py-6 rounded-[50px] rounded-full shadow-lg cursor-grab active:cursor-grabbing",
											children: "CMS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element rounded-2xl inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-emerald-500 text-white shadow-[0_8px_15px_rgba(16,185,129,0.4)] border-2 md:border-[3px] border-white dark:border-slate-900 cursor-grab active:cursor-grabbing",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutTemplate, { className: "w-8 h-8 md:w-10 md:h-10 pointer-events-none" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element inline-flex items-center justify-center bg-blue-600 text-white font-black text-2xl md:text-4xl px-8 md:px-12 py-4 md:py-6 rounded-[50px] rounded-full shadow-lg cursor-grab active:cursor-grabbing",
											children: "POS"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "matter-element rounded-2xl inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-amber-500 text-white shadow-[0_8px_15px_rgba(245,158,11,0.4)] border-2 md:border-[3px] border-white dark:border-slate-900 cursor-grab active:cursor-grabbing",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, { className: "w-8 h-8 md:w-10 md:h-10 pointer-events-none" })
										})
									]
								})
							})]
						})
					]
				})
			]
		})
	});
}
var Card = (0, import_react.forwardRef)(({ customClass, ...rest }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	...rest,
	className: `card ${customClass ?? ""} ${rest.className ?? ""}`.trim()
}));
Card.displayName = "Card";
var makeSlot = (i, distX, distY, total) => ({
	x: i * distX,
	y: -i * distY,
	z: -i * distX * 1.5,
	zIndex: total - i
});
var placeNow = (el, slot, skew) => el && gsapWithCSS.set(el, {
	x: slot.x,
	y: slot.y,
	z: slot.z,
	xPercent: -50,
	yPercent: -50,
	skewY: skew,
	transformOrigin: "center center",
	zIndex: slot.zIndex,
	force3D: true
});
var CardSwap = ({ width = 500, height = 400, cardDistance = 60, verticalDistance = 70, delay = 5e3, pauseOnHover = false, onCardClick, skewAmount = 6, easing = "elastic", children }) => {
	const config = easing === "elastic" ? {
		ease: "elastic.out(0.6,0.9)",
		durDrop: 2,
		durMove: 2,
		durReturn: 2,
		promoteOverlap: .9,
		returnDelay: .05
	} : {
		ease: "power1.inOut",
		durDrop: .8,
		durMove: .8,
		durReturn: .8,
		promoteOverlap: .45,
		returnDelay: .2
	};
	const childArr = (0, import_react.useMemo)(() => import_react.Children.toArray(children), [children]);
	const refs = (0, import_react.useMemo)(() => childArr.map(() => import_react.createRef()), [childArr.length]);
	const order = (0, import_react.useRef)(Array.from({ length: childArr.length }, (_, i) => i));
	const tlRef = (0, import_react.useRef)(null);
	const intervalRef = (0, import_react.useRef)(void 0);
	const container = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const total = refs.length;
		refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));
		const swap = () => {
			if (order.current.length < 2) return;
			const [front, ...rest] = order.current;
			if (front === void 0) return;
			const refFront = refs[front];
			if (!refFront) return;
			const elFront = refFront.current;
			if (!elFront) return;
			const tl = gsapWithCSS.timeline();
			tlRef.current = tl;
			tl.to(elFront, {
				y: "+=500",
				duration: config.durDrop,
				ease: config.ease
			});
			tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);
			rest.forEach((idx, i) => {
				const ref = refs[idx];
				if (!ref) return;
				const el = ref.current;
				if (!el) return;
				const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
				tl.set(el, { zIndex: slot.zIndex }, "promote");
				tl.to(el, {
					x: slot.x,
					y: slot.y,
					z: slot.z,
					duration: config.durMove,
					ease: config.ease
				}, `promote+=${i * .15}`);
			});
			const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
			tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
			tl.call(() => {
				gsapWithCSS.set(elFront, { zIndex: backSlot.zIndex });
			}, void 0, "return");
			tl.to(elFront, {
				x: backSlot.x,
				y: backSlot.y,
				z: backSlot.z,
				duration: config.durReturn,
				ease: config.ease
			}, "return");
			tl.call(() => {
				order.current = [...rest, front];
			});
		};
		swap();
		intervalRef.current = window.setInterval(swap, delay);
		if (pauseOnHover) {
			const node = container.current;
			if (!node) return;
			const pause = () => {
				tlRef.current?.pause();
				clearInterval(intervalRef.current);
			};
			const resume = () => {
				tlRef.current?.play();
				intervalRef.current = window.setInterval(swap, delay);
			};
			node.addEventListener("mouseenter", pause);
			node.addEventListener("mouseleave", resume);
			return () => {
				node.removeEventListener("mouseenter", pause);
				node.removeEventListener("mouseleave", resume);
				clearInterval(intervalRef.current);
			};
		}
		return () => clearInterval(intervalRef.current);
	}, [
		cardDistance,
		verticalDistance,
		delay,
		pauseOnHover,
		skewAmount,
		easing
	]);
	const rendered = childArr.map((child, i) => {
		if (!(0, import_react.isValidElement)(child)) return child;
		const childEl = child;
		return (0, import_react.cloneElement)(childEl, {
			key: i,
			ref: refs[i],
			style: {
				width,
				height,
				...childEl.props.style ?? {}
			},
			onClick: (e) => {
				childEl.props.onClick?.(e);
				onCardClick?.(i);
			}
		});
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: container,
		className: "card-swap-container",
		style: {
			width,
			height
		},
		children: rendered
	});
};
function CardSwapSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "card-swap",
		className: "border-b border-foreground/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative bg-hero overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pointer-events-none absolute inset-0 z-0 overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/cloud.png",
									alt: "",
									className: "absolute -top-[5%] -left-[5%] w-[400px] opacity-20 blur-[2px]"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/cloud (2).png",
									alt: "",
									className: "absolute top-[20%] right-[-5%] w-[350px] opacity-30"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/cloud.png",
									alt: "",
									className: "absolute top-[60%] left-[10%] w-[450px] opacity-15 blur-[1px]"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute bottom-0 left-0 right-0 z-50 h-[150px] w-full bg-gradient-to-t from-background to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 flex flex-col justify-center px-8 md:px-20 py-16 md:py-0 z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-bold tracking-tight text-brand-foreground sm:text-4xl mb-4 max-w-md",
								children: "Semua bisa pakai"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg text-brand-foreground/85 max-w-md",
								children: [
									"Dashboard mudah ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									" dipahami untuk semua pengguna"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 relative min-h-[400px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardSwap, {
								width: 700,
								height: 500,
								cardDistance: 60,
								verticalDistance: 70,
								delay: 3e3,
								pauseOnHover: true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "overflow-hidden bg-black border border-white/20 shadow-2xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/image/hero.png",
											alt: "Dashboard Mockup",
											className: "w-full h-full object-cover object-left-top opacity-70"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "overflow-hidden bg-black border border-white/20 shadow-2xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/image/solution.png",
											alt: "Solution Mockup",
											className: "w-full h-full object-cover object-left-top opacity-70"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										className: "overflow-hidden bg-black border border-white/20 shadow-2xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: "/image/hero.png",
											alt: "Dashboard Alternative",
											className: "w-full h-full object-cover object-left-top opacity-70"
										})
									})
								]
							})
						})
					]
				})
			]
		})
	});
}
var slides = [
	{
		id: 0,
		image: "/image/hero.png",
		title: "Crave POS",
		desc: "Keep every policy audit-ready with automated document monitoring."
	},
	{
		id: 1,
		image: "/image/solution.png",
		title: "Crave HRM",
		desc: "View total usage, remaining capacity, and detailed breakdowns."
	},
	{
		id: 2,
		image: "/image/hero.png",
		title: "Crave ITSM",
		desc: "Instantly see which files are valid, pending review, or expired."
	}
];
function DashboardGallery() {
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full rounded-2xl border border-foreground/15 bg-card overflow-hidden shadow-2xl flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-10 w-full items-center gap-2 border-b border-foreground/15 bg-muted/30 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-red-500/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-yellow-500/80" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-3 rounded-full bg-green-500/80" })
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 bg-background/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: slides[activeIndex]?.image || "",
					alt: "placeholder",
					className: "w-full h-auto opacity-0 pointer-events-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
					mode: "wait",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion$1.div, {
						initial: {
							opacity: 0,
							filter: "blur(8px)",
							scale: 1.02
						},
						animate: {
							opacity: 1,
							filter: "blur(0px)",
							scale: 1
						},
						exit: {
							opacity: 0,
							filter: "blur(8px)",
							scale: .98
						},
						transition: {
							duration: .4,
							ease: "easeOut"
						},
						className: "absolute inset-0 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: slides[activeIndex]?.image || "",
							alt: slides[activeIndex]?.title || "",
							className: "w-full h-full object-contain object-top"
						})
					}, activeIndex)
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-3 gap-2 sm:gap-4",
			children: slides.map((slide, index) => {
				const isActive = activeIndex === index;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveIndex(index),
					className: cn("group relative text-left flex flex-col gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border p-2 sm:p-4 transition-all duration-300", isActive ? "border-brand bg-brand/5 shadow-md" : "border-foreground/10 bg-card hover:border-foreground/30 hover:bg-muted/50"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full aspect-[16/9] overflow-hidden rounded-md sm:rounded-lg border border-foreground/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: slide.image,
							alt: slide.title,
							className: cn("w-full h-full object-cover object-top transition-transform duration-500", isActive ? "scale-100" : "scale-105 opacity-60 group-hover:opacity-100 group-hover:scale-100")
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: cn("font-semibold text-[10px] leading-tight sm:text-base", isActive ? "text-brand" : "text-foreground"),
						children: slide.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden sm:block mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] leading-tight sm:text-xs text-muted-foreground line-clamp-2",
							children: slide.desc
						})
					})] })]
				}, slide.id);
			})
		})]
	});
}
function KeyFeaturesSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "fitur",
		className: "border-b border-foreground/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15 px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripedPattern, { className: "!-z-10 text-foreground/20 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_100%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs font-medium text-[#1B5CFE]",
						children: "Galeri Aplikasi"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mx-auto mt-4 max-w-2xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
					children: [
						"Intip kemudahan memakai ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						" Crave Software"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-14 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardGallery, {})
				})
			]
		})
	});
}
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var CarouselContext = import_react.createContext(null);
function useCarousel() {
	const context = import_react.useContext(CarouselContext);
	if (!context) throw new Error("useCarousel must be used within a <Carousel />");
	return context;
}
var Carousel = import_react.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
	const [carouselRef, api] = useEmblaCarousel({
		...opts,
		axis: orientation === "horizontal" ? "x" : "y"
	}, plugins);
	const [canScrollPrev, setCanScrollPrev] = import_react.useState(false);
	const [canScrollNext, setCanScrollNext] = import_react.useState(false);
	const onSelect = import_react.useCallback((api) => {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}, []);
	const scrollPrev = import_react.useCallback(() => {
		api?.scrollPrev();
	}, [api]);
	const scrollNext = import_react.useCallback(() => {
		api?.scrollNext();
	}, [api]);
	const handleKeyDown = import_react.useCallback((event) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			scrollPrev();
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			scrollNext();
		}
	}, [scrollPrev, scrollNext]);
	import_react.useEffect(() => {
		if (!api || !setApi) return;
		setApi(api);
	}, [api, setApi]);
	import_react.useEffect(() => {
		if (!api) return;
		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);
		return () => {
			api?.off("select", onSelect);
		};
	}, [api, onSelect]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContext.Provider, {
		value: {
			carouselRef,
			api,
			opts,
			orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
			scrollPrev,
			scrollNext,
			canScrollPrev,
			canScrollNext
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			onKeyDownCapture: handleKeyDown,
			className: cn("relative", className),
			role: "region",
			"aria-roledescription": "carousel",
			...props,
			children
		})
	});
});
Carousel.displayName = "Carousel";
var CarouselContent = import_react.forwardRef(({ className, ...props }, ref) => {
	const { carouselRef, orientation } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: carouselRef,
		className: "overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className),
			...props
		})
	});
});
CarouselContent.displayName = "CarouselContent";
var CarouselItem = import_react.forwardRef(({ className, ...props }, ref) => {
	const { orientation } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		role: "group",
		"aria-roledescription": "slide",
		className: cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className),
		...props
	});
});
CarouselItem.displayName = "CarouselItem";
var CarouselPrevious = import_react.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		variant,
		size,
		className: cn("absolute  h-8 w-8 rounded-full", orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollPrev,
		onClick: scrollPrev,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Previous slide"
		})]
	});
});
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = import_react.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollNext, canScrollNext } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		variant,
		size,
		className: cn("absolute h-8 w-8 rounded-full", orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollNext,
		onClick: scrollNext,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Next slide"
		})]
	});
});
CarouselNext.displayName = "CarouselNext";
var PLANS = [
	{
		name: "Starter (POS)",
		price: "Rp 150rb",
		note: "Sistem Point of Sale lengkap untuk mengelola transaksi toko harian.",
		listTitle: "FITUR TERMASUK:",
		items: [
			"Akses penuh Crave POS",
			"Manajemen Stok & Penjualan",
			"Buku Kas & Pengeluaran",
			"Spreadsheet Live"
		],
		featured: false
	},
	{
		name: "Pro (POS + HRM)",
		price: "Rp 299rb",
		note: "Solusi ideal untuk toko yang sudah memiliki banyak karyawan.",
		listTitle: "SEMUA FITUR STARTER, DITAMBAH:",
		items: [
			"Akses penuh Crave HRM",
			"Manajemen Absensi Karyawan",
			"Pengaturan Gaji & Bonus",
			"Shift & Hak Akses"
		],
		featured: true
	},
	{
		name: "Enterprise (Ultimate)",
		price: "Rp 499rb",
		note: "Bundling terlengkap (POS + HRM + CRM) untuk skala bisnis besar.",
		listTitle: "SEMUA FITUR PRO, DITAMBAH:",
		items: [
			"Akses penuh Crave CRM",
			"Manajemen Pelanggan (Loyalty)",
			"Promo & Diskon Otomatis",
			"Dukungan Manajer Prioritas"
		],
		featured: false
	}
];
function PricingSection() {
	const [billingCycle, setBillingCycle] = (0, import_react.useState)("monthly");
	const [usersCount, setUsersCount] = (0, import_react.useState)(5);
	const pricePerUserMonthly = 15e4;
	const totalAnnualPrice = usersCount * pricePerUserMonthly * 12;
	const formatRupiah = (value) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0
		}).format(value);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-center rounded-full bg-muted/50 p-1 shadow-inner border border-foreground/10 w-fit",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-background shadow-md border border-foreground/10 transition-all duration-300 ease-in-out",
						style: { transform: billingCycle === "annual" ? "translateX(100%)" : "translateX(0)" }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setBillingCycle("monthly"),
						className: cn("relative z-10 rounded-full px-6 py-2 text-sm font-semibold transition-colors w-28", billingCycle === "monthly" ? "text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: "Monthly"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setBillingCycle("annual"),
						className: cn("relative z-10 rounded-full px-6 py-2 text-sm font-semibold transition-colors w-28", billingCycle === "annual" ? "text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: "Annual"
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 relative min-h-[500px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				mode: "wait",
				children: billingCycle === "monthly" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion$1.div, {
					initial: {
						opacity: 0,
						filter: "blur(8px)"
					},
					animate: {
						opacity: 1,
						filter: "blur(0px)"
					},
					exit: {
						opacity: 0,
						filter: "blur(8px)"
					},
					transition: { duration: .4 },
					className: "max-w-5xl mx-auto pt-4 relative px-4 sm:px-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Carousel, {
						opts: {
							align: "center",
							loop: true
						},
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContent, {
							className: "-ml-4 sm:-ml-8",
							children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, {
								className: "pl-4 sm:pl-8 md:basis-1/2 lg:basis-1/3 pt-6 pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("relative rounded-[2rem] p-8 pt-12 text-center flex flex-col justify-between shadow-xl transition-transform hover:-translate-y-1 h-full", p.featured ? "bg-[#5584ff] text-white" : "bg-white text-slate-900 border border-slate-100"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/10 to-transparent rounded-t-[2rem] pointer-events-none z-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute -top-4 left-8 right-8 flex justify-between pointer-events-none z-20",
											children: Array.from({ length: 7 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative w-4 flex justify-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("absolute top-4 w-3.5 h-3.5 rounded-full shadow-[inset_0_3px_5px_rgba(0,0,0,0.25)]", p.featured ? "bg-white" : "bg-slate-200/70") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 w-2 h-7 bg-gradient-to-b from-slate-200 to-slate-500 rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.3)] z-10" })]
											}, i))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-bold",
												children: p.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-4 text-[2.5rem] font-bold tracking-tight",
												children: [p.price, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-semibold opacity-80",
													children: "/bln"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: cn("mt-4 text-xs mx-auto max-w-[200px] leading-relaxed", p.featured ? "text-white/90" : "text-slate-500"),
												children: p.note
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-8 text-[10px] font-bold tracking-widest uppercase opacity-80",
												children: p.listTitle
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "mt-5 space-y-3 text-xs font-medium text-left px-4",
												children: p.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
													className: "flex items-start gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
														className: "h-4 w-4 shrink-0 opacity-80 mt-0.5",
														"aria-hidden": true
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i })]
												}, i))
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											className: cn("mt-10 h-12 w-full rounded-full text-sm font-bold shadow-lg transition-all", p.featured ? "bg-white text-[#5584ff] hover:bg-slate-50" : "bg-[#0a0f25] text-white hover:bg-slate-800"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#cta",
												children: "Pilih Paket"
											})
										})
									]
								})
							}, p.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselPrevious, { className: "left-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselNext, { className: "right-0" })]
						})]
					})
				}, "monthly") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion$1.div, {
					initial: {
						opacity: 0,
						filter: "blur(8px)"
					},
					animate: {
						opacity: 1,
						filter: "blur(0px)"
					},
					exit: {
						opacity: 0,
						filter: "blur(8px)"
					},
					transition: { duration: .4 },
					className: "max-w-5xl mx-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex flex-col md:flex-row items-stretch justify-center bg-blue-600 rounded-[2.5rem] p-3 md:p-8 shadow-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 bg-white rounded-3xl p-8 md:p-12 relative z-0 text-slate-900 shadow-xl flex flex-col justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Enterprise (Ultimate) Plan" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight",
										children: [
											"Investasi Terbaik",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											"Untuk Bisnismu"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-slate-500 mb-8 max-w-sm text-sm",
										children: "Kalkulator Pay-as-you-go yang sangat fleksibel. Bayangkan mendapatkan sistem POS, HRM, dan CRM sekaligus dengan bayar tahunan sesuai jumlah pengguna."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold text-xl mb-4",
										children: "Yang Anda Dapatkan"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm font-semibold text-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-emerald-100 p-0.5 rounded-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 stroke-[3]" })
												}), " Sistem Kasir Lanjutan"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-emerald-100 p-0.5 rounded-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 stroke-[3]" })
												}), " Manajemen Karyawan"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-emerald-100 p-0.5 rounded-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 stroke-[3]" })
												}), " CRM & Pelanggan"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-emerald-100 p-0.5 rounded-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 stroke-[3]" })
												}), " Import File Excel"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-emerald-100 p-0.5 rounded-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 stroke-[3]" })
												}), " Dukungan Prioritas"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-emerald-100 p-0.5 rounded-full",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-3.5 h-3.5 text-emerald-600 stroke-[3]" })
												}), " Kapasitas Tanpa Batas"]
											})
										]
									})
								] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden md:flex flex-col justify-evenly py-16 -mx-4 z-10 w-24",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-6 rounded-full bg-[#f1f5f9] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)] z-0 ml-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/2 -translate-x-1/2 w-[72px] h-5 bg-[#8cb4ff] rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_-3px_5px_rgba(0,0,0,0.2),inset_0_3px_5px_rgba(255,255,255,0.6)] z-10 border border-[#a6c7ff]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-6 h-6 rounded-full bg-[#f1f5f9] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)] z-0 mr-1" })
									]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:hidden flex justify-evenly px-12 -my-4 z-10 h-16 w-full",
								children: [
									1,
									2,
									3,
									4
								].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-between relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 rounded-full bg-[#f1f5f9] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)] z-0 mt-1" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 -translate-y-1/2 h-14 w-4 bg-[#8cb4ff] rounded-full shadow-[4px_0_6px_rgba(0,0,0,0.3),inset_-3px_0_5px_rgba(0,0,0,0.2),inset_3px_0_5px_rgba(255,255,255,0.6)] z-10 border border-[#a6c7ff]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-5 h-5 rounded-full bg-[#f1f5f9] shadow-[inset_0_3px_5px_rgba(0,0,0,0.15)] z-0 mb-1" })
									]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 bg-white rounded-3xl p-8 md:p-12 relative z-0 text-slate-900 shadow-xl flex flex-col justify-center text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full text-xs font-bold text-emerald-700 mb-8 mx-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg leading-none",
											children: "💸"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Skema Pay-as-you-go" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-4xl md:text-[3.25rem] font-black tracking-tight mb-3 text-slate-900 drop-shadow-sm",
										children: formatRupiah(totalAnnualPrice)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-10 text-left max-w-sm mx-auto w-full px-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between mb-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-slate-700 text-sm",
													children: "Jumlah Pengguna (Users)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-sm",
													children: usersCount
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
												defaultValue: [5],
												max: 100,
												min: 1,
												step: 1,
												onValueChange: (val) => setUsersCount(val[0] ?? 5),
												className: "w-full"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-xs text-slate-400 mt-3 font-semibold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1 User" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100+ Users" })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "bg-blue-600 text-white font-bold text-base py-4 px-8 rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full max-w-[280px] mx-auto flex items-center justify-center gap-2",
										children: "Hubungi Sales →"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] font-medium text-slate-500 mt-5 max-w-xs mx-auto leading-relaxed",
										children: [
											"Setara dengan ",
											formatRupiah(pricePerUserMonthly),
											" / pengguna / bulan. Sudah termasuk fitur prioritas keamanan dan dukungan 24/7."
										]
									})
								]
							})
						]
					})
				}, "annual")
			})
		})]
	});
}
function PricingSectionLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "produk",
		className: "border-b border-foreground/15 bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15 px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DotPattern, { className: "!-z-10 text-foreground/60 [mask-image:radial-gradient(ellipse_at_center,white,transparent_85%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs font-medium text-[#1B5CFE]",
						children: "Harga & Paket"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mx-auto mt-4 max-w-2xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
					children: "Paket yang bisa anda pilih sesuai kebutuhan anda"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10 w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingSection, {})
				})
			]
		})
	});
}
function TestimonialCarousel({ testimonials, className }) {
	const [activeIndex, setActiveIndex] = (0, import_react.useState)(0);
	const handleNext = () => {
		setActiveIndex((prev) => (prev + 1) % testimonials.length);
	};
	const handlePrev = () => {
		setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative w-full max-w-6xl mx-auto py-10 overflow-hidden min-h-[500px]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative h-[450px] w-full flex justify-center items-center",
				children: testimonials.map((item, index) => {
					let offset = index - activeIndex;
					if (offset < -1) offset += testimonials.length;
					if (offset > 1) offset -= testimonials.length;
					const isActive = offset === 0;
					const isPrev = offset === -1 || offset < -1 && index === testimonials.length - 1;
					const isNext = offset === 1 || offset > 1 && index === 0;
					if (!isActive && !isPrev && !isNext) return null;
					let transformStyle = "";
					let zIndex = 10;
					let opacity = 1;
					if (isActive) {
						transformStyle = "translateX(0) scale(1)";
						zIndex = 30;
					} else if (isPrev) {
						transformStyle = "translateX(-30%) scale(0.85)";
						zIndex = 20;
					} else if (isNext) {
						transformStyle = "translateX(30%) scale(0.85)";
						zIndex = 20;
					}
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("absolute top-0 w-full max-w-4xl h-full transition-all duration-500 ease-in-out cursor-pointer", isActive ? "shadow-[0_20px_50px_rgba(0,0,0,0.1)]" : "shadow-md"),
						style: {
							transform: transformStyle,
							zIndex,
							opacity
						},
						onClick: () => {
							if (isPrev) handlePrev();
							if (isNext) handleNext();
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full h-full rounded-[2rem] overflow-hidden bg-white flex flex-col md:flex-row border border-slate-100",
							children: [
								!isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-blue-500/80 z-50 transition-opacity duration-500 rounded-[2rem]" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("w-full md:w-[40%] h-48 md:h-full relative overflow-hidden flex items-end justify-center", item.bgColor),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: item.avatar,
										alt: item.name,
										className: "w-[85%] h-auto max-h-[95%] object-contain object-bottom drop-shadow-2xl mix-blend-luminosity opacity-90 transition-transform duration-500 group-hover:scale-105"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full md:w-[60%] p-8 md:p-14 flex flex-col justify-center relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quote, {
											className: "absolute top-10 right-10 w-28 h-28 text-slate-100 -z-10",
											fill: "currentColor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-lg md:text-xl text-slate-700 leading-relaxed font-medium mb-8 relative z-10",
											children: [
												"\"",
												item.quote,
												"\""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-auto relative z-10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-2xl font-bold text-slate-800",
												children: item.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-slate-500 italic mt-1",
												children: item.role
											})]
										})
									]
								})
							]
						})
					}, item.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1/2 -translate-y-1/2 left-2 md:left-6 z-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handlePrev,
					className: "w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all hover:scale-105 border border-blue-100 focus:outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-6 h-6 md:w-8 md:h-8" })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1/2 -translate-y-1/2 right-2 md:right-6 z-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleNext,
					className: "w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-all hover:scale-105 border border-blue-100 focus:outline-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-6 h-6 md:w-8 md:h-8" })
				})
			})
		]
	});
}
var TESTIMONIAL_DATA = [
	{
		id: 1,
		name: "Budi Santoso",
		role: "Pemilik Kedai Kopi",
		quote: "Aplikasi kasir paling gampang yang pernah saya coba. Tinggal masukin barang, dan laporan penjualan hariannya beres semua otomatis!",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi&backgroundColor=transparent",
		bgColor: "bg-teal-400"
	},
	{
		id: 2,
		name: "Siti Rahmawati",
		role: "Manajer Toko Baju",
		quote: "Buku kas sama fitur stoknya bener-bener nolong banget. Fitur import spreadsheet-nya juara buat mindahin data barang lama ke sistem baru!",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti&backgroundColor=transparent",
		bgColor: "bg-blue-400"
	},
	{
		id: 3,
		name: "Hendra Wijaya",
		role: "Pengusaha Retail",
		quote: "Udah cobain banyak POS, tapi cuma Crave yang UI-nya cakep dan navigasinya nggak bikin bingung karyawan baru. Sistem PIN-nya juga bikin tenang.",
		avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra&backgroundColor=transparent",
		bgColor: "bg-indigo-400"
	}
];
function TestimonialsSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "testimoni",
		className: "border-b border-foreground/15",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15 px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripedPattern, { className: "!-z-10 text-foreground/20 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_100%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full border border-foreground/15 bg-card px-4 py-1.5 text-xs font-medium text-[#1B5CFE]",
						children: "Testimoni"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mx-auto max-w-xl text-center text-3xl font-bold tracking-tight text-blue-800 sm:text-4xl",
						children: "Apa kata pengguna kita?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-1 mt-4 bg-teal-400 rounded-full" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialCarousel, { testimonials: TESTIMONIAL_DATA })
				})
			]
		})
	});
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>div>svg]:rotate-45", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-7 w-7 md:h-8 md:w-8 shrink-0 rounded-full bg-slate-900 flex items-center justify-center transition-transform duration-200 ml-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 md:h-5 md:w-5 text-white transition-transform duration-200" })
		})]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var FAQS = [
	{
		q: "Apakah saya bisa memasukkan data barang lama saya?",
		a: "Tentu saja. Kamu bisa langsung mengimpor data barang dan laporan sebelumnya menggunakan fitur Spreadsheet kami melalui file Excel/CSV."
	},
	{
		q: "Apakah ada batasan pengguna atau karyawan?",
		a: "Crave sepenuhnya gratis tanpa batasan jumlah pengguna, barang, maupun transaksi."
	},
	{
		q: "Apakah data toko saya aman?",
		a: "Data kamu tersimpan aman di cloud dengan sistem keamanan modern. Ditambah lagi, kamu bisa membatasi akses karyawan ke menu tertentu menggunakan fitur keamanan PIN."
	},
	{
		q: "Apakah bisa digunakan tanpa internet?",
		a: "Saat ini Crave membutuhkan koneksi internet agar data penjualan, stok, dan pengeluaran bisa selalu sinkron dan terpantau secara realtime dari mana saja."
	}
];
function FaqSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "faq",
		className: "border-b border-foreground/15 bg-secondary/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl md:border-x border-foreground/15 px-6 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -left-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridCross, { className: "absolute -bottom-[15.5px] -right-[15.5px] z-10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StripedPattern, { className: "!-z-10 text-foreground/20 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black_100%)]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col w-full max-w-xl mx-auto lg:mx-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-start mb-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-foreground/15 bg-white px-4 py-1.5 text-xs font-medium text-[#1B5CFE] shadow-sm",
										children: "FAQ"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl",
									children: "Pertanyaan yang Sering Diajukan"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-16 h-1 mt-4 bg-blue-500 rounded-full" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
							type: "single",
							collapsible: true,
							className: "flex flex-col gap-3",
							children: FAQS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
								value: f.q,
								className: "bg-white rounded-2xl shadow-sm border border-slate-50 px-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
									className: "text-left text-base md:text-lg font-semibold text-slate-900 hover:no-underline py-5",
									children: f.q
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
									className: "text-sm md:text-base text-slate-500 leading-relaxed pb-6",
									children: f.a
								})]
							}, f.q))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full aspect-square max-w-[500px] mx-auto flex items-end justify-center pb-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 overflow-hidden flex items-end justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-[95%] aspect-square bg-[#E8F0FE] rounded-full translate-y-[10%] z-0 shadow-inner" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/image/model.png",
								alt: "Model looking curious",
								className: "relative z-10 w-full h-auto object-contain object-bottom drop-shadow-2xl scale-[1.25] origin-bottom"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-[10%] left-[5%] w-20 h-28 sm:w-24 sm:h-32 bg-[#1B5CFE] rounded-[50%] flex items-center justify-center shadow-xl animate-[bounce_6s_infinite] z-20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white font-bold text-4xl sm:text-5xl",
									children: "?"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-[50%] left-[0%] w-16 h-16 sm:w-20 sm:h-20 bg-[#0F172A] rounded-full flex items-center justify-center shadow-lg animate-[bounce_5s_infinite_1s] z-20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white font-bold text-3xl sm:text-4xl",
									children: "?"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-[35%] right-[-5%] w-16 h-16 sm:w-24 sm:h-24 bg-[#0F172A] rounded-full flex items-center justify-center shadow-lg animate-[bounce_7s_infinite_0.5s] z-20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white font-bold text-3xl sm:text-5xl",
									children: "?"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-[10%] right-[5%] w-16 h-16 sm:w-24 sm:h-24 bg-[#4A9DFF] rounded-full flex items-center justify-center shadow-lg animate-[bounce_4s_infinite_1.5s] z-20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white font-bold text-3xl sm:text-5xl",
									children: "?"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-[25%] left-[25%] w-4 h-4 bg-[#60A5FA] rounded-full animate-pulse z-20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[20%] left-[25%] w-6 h-6 bg-[#1B5CFE] rounded-full animate-pulse delay-100 z-20" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-[35%] right-[10%] w-4 h-4 bg-[#334155] rounded-full animate-pulse delay-300 z-20" })
						]
					})]
				})
			]
		})
	});
}
function CtaSection() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "cta",
		className: "pt-32 pb-24 md:pt-48 md:pb-32 bg-white relative overflow-visible",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-0 mx-auto max-w-6xl px-6 md:px-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:hidden relative z-10 w-full text-left mb-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/image/logo/light-mode-logo.png",
							alt: "Crave Logo",
							className: "h-9 sm:h-11 w-auto"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-2xl sm:text-3xl tracking-tight text-slate-900",
							children: "Crave"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-4xl sm:text-5xl font-bold tracking-tight mb-8 leading-[1.1] text-slate-900",
						children: "Mulailah otomatisasi bisnis anda"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "h-12 sm:h-14 rounded-full bg-[#1B5CFE] px-8 sm:px-10 text-base sm:text-lg font-bold text-white hover:bg-blue-700 hover:scale-105 transition-all shadow-xl",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: POS_URL,
							children: "Coba Sekarang"
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative rounded-[2rem] sm:rounded-[3rem] bg-[#1B5CFE] px-6 py-10 md:px-12 md:py-16 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between h-[180px] sm:h-[250px] md:h-auto mt-36 sm:mt-48 md:mt-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 overflow-hidden rounded-[2rem] sm:rounded-[3rem] pointer-events-none flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-[40vw] md:text-[22rem] leading-none font-bold text-white/10 tracking-tighter select-none",
							children: "crave"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden md:block relative z-10 w-full md:w-[55%] text-left text-white",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/image/logo/dark-mode-logo.png",
									alt: "Crave Logo",
									className: "h-9 sm:h-11 w-auto"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-2xl sm:text-3xl tracking-tight text-white",
									children: "Crave"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1] max-w-xl",
								children: [
									"Mulailah otomatisasi ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									" bisnis anda"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "h-12 sm:h-14 rounded-full bg-white px-8 sm:px-10 text-base sm:text-lg font-bold text-[#1B5CFE] hover:bg-slate-50 hover:scale-105 transition-all shadow-xl",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: POS_URL,
									children: "Coba Sekarang"
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute bottom-0 left-0 right-0 z-20 pointer-events-none flex justify-center md:justify-end items-end h-[220%] sm:h-[180%] md:h-[125%] lg:h-[135%] rounded-b-[2rem] sm:rounded-b-[3rem] overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/image/model-phone.png",
							alt: "Phone Mockup",
							className: "h-full w-auto relative md:right-[-10%] lg:right-[-15%] drop-shadow-[0_25px_35px_rgba(0,0,0,0.35)] object-contain object-bottom pointer-events-auto"
						})
					})
				]
			})]
		})
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative w-full overflow-hidden bg-gradient-to-b from-transparent to-brand/90 pt-24 pb-8 border-t border-slate-100",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative z-10 max-w-7xl mx-auto px-6 sm:px-12 flex flex-col min-h-[400px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row justify-between items-start gap-16 mb-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, {
									className: "w-5 h-5",
									strokeWidth: 2
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, {
									className: "w-5 h-5",
									strokeWidth: 2
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "mailto:hello@crave.com",
							className: "text-2xl font-medium text-slate-900 hover:opacity-80 transition-opacity",
							children: "hello@crave.com"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-slate-500 leading-relaxed font-medium max-w-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Jl Jendral Sudirman" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "MSIG Tower Floor 38" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Jakarta Selatan" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2 text-xs font-medium text-slate-500 mt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									className: "hover:text-slate-900 underline decoration-slate-300 underline-offset-4",
									children: "Terms and conditions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#",
									className: "hover:text-slate-900 underline decoration-slate-300 underline-offset-4",
									children: "Privacy Policy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2",
									children: [
										"© ",
										(/* @__PURE__ */ new Date()).getFullYear(),
										" Crave. All Rights Reserved"
									]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-4 text-left md:text-right",
					children: [
						"Platform",
						"Use Cases",
						"Resources",
						"Services",
						"About"
					].map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#",
						className: "text-xl md:text-2xl text-slate-900 hover:text-blue-600 transition-colors font-medium",
						children: link
					}, link))
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute bottom-[-2%] md:bottom-[-10%] left-0 w-full flex justify-center items-end pointer-events-none select-none z-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[35vw] md:text-[25vw] leading-none font-bold text-white/20 tracking-[0.05em] mix-blend-overlay",
				children: "crave"
			})
		})]
	});
}
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-screen bg-background font-sans antialiased overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingNavbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogosSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SolutionsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BentoFeaturesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallingObjectsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardSwapSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyFeaturesSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PricingSectionLayout, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TestimonialsSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CtaSection, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Landing as component };
