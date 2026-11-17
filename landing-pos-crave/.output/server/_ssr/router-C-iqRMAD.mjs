import { i as __toESM, r as __exportAll } from "../_runtime.mjs";
import { n as gsapWithCSS, r as require_react, t as useGSAP } from "../_libs/gsap+gsap__react+react.mjs";
import { h as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useLocation, v as createFileRoute, x as useRouter, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-C-iqRMAD.js
var router_C_iqRMAD_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-B5QDNpx0.css";
function reportError(error, context = {}) {
	console.error("[Runtime Error]", error, context);
}
function TransitionOverlay() {
	const containerRef = (0, import_react.useRef)(null);
	const layer1Ref = (0, import_react.useRef)(null);
	const layer2Ref = (0, import_react.useRef)(null);
	const layer3Ref = (0, import_react.useRef)(null);
	const textRef = (0, import_react.useRef)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [isHome, setIsHome] = (0, import_react.useState)(false);
	const [isActive, setIsActive] = (0, import_react.useState)(false);
	const { contextSafe } = useGSAP({ scope: containerRef });
	useGSAP(() => {
		setIsActive(true);
		setIsHome(true);
		const tl = gsapWithCSS.timeline({ onComplete: () => {
			setIsActive(false);
		} });
		gsapWithCSS.set(containerRef.current, { autoAlpha: 1 });
		gsapWithCSS.set([
			layer1Ref.current,
			layer2Ref.current,
			layer3Ref.current
		], {
			yPercent: 100,
			borderTopLeftRadius: "50%",
			borderTopRightRadius: "50%",
			borderBottomLeftRadius: "0%",
			borderBottomRightRadius: "0%"
		});
		gsapWithCSS.set(textRef.current, {
			autoAlpha: 0,
			y: 20
		});
		tl.to([
			layer1Ref.current,
			layer2Ref.current,
			layer3Ref.current
		], {
			yPercent: 0,
			borderTopLeftRadius: "0%",
			borderTopRightRadius: "0%",
			duration: .8,
			ease: "power4.inOut",
			stagger: .1
		}).to(textRef.current, {
			autoAlpha: 1,
			y: 0,
			duration: .4,
			ease: "power2.out"
		}, "-=0.2").to(textRef.current, {
			autoAlpha: 0,
			y: -20,
			duration: .3,
			ease: "power2.in"
		}, "+=0.6").to([
			layer3Ref.current,
			layer2Ref.current,
			layer1Ref.current
		], {
			yPercent: -100,
			borderBottomLeftRadius: "50%",
			borderBottomRightRadius: "50%",
			duration: .8,
			ease: "power4.inOut",
			stagger: .1
		}, "-=0.1").set(containerRef.current, { autoAlpha: 0 });
	}, { scope: containerRef });
	const triggerTransition = contextSafe((href, name, isHomeParam = false) => {
		if (isActive) return;
		setIsActive(true);
		setText(name);
		setIsHome(isHomeParam);
		const tl = gsapWithCSS.timeline({ onComplete: () => {
			setIsActive(false);
		} });
		gsapWithCSS.set(containerRef.current, { autoAlpha: 1 });
		gsapWithCSS.set([
			layer1Ref.current,
			layer2Ref.current,
			layer3Ref.current
		], {
			yPercent: 100,
			borderTopLeftRadius: "50%",
			borderTopRightRadius: "50%",
			borderBottomLeftRadius: "0%",
			borderBottomRightRadius: "0%"
		});
		gsapWithCSS.set(textRef.current, {
			autoAlpha: 0,
			y: 20
		});
		tl.to([
			layer1Ref.current,
			layer2Ref.current,
			layer3Ref.current
		], {
			yPercent: 0,
			borderTopLeftRadius: "0%",
			borderTopRightRadius: "0%",
			duration: .8,
			ease: "power4.inOut",
			stagger: .1
		}).to(textRef.current, {
			autoAlpha: 1,
			y: 0,
			duration: .4,
			ease: "power2.out"
		}, "-=0.2").call(() => {
			if (href.startsWith("#")) {
				const id = href.substring(1);
				const target = document.getElementById(id);
				if (target) target.scrollIntoView({ behavior: "instant" });
			} else if (href === "/") window.scrollTo({
				top: 0,
				behavior: "instant"
			});
		}, [], "+=0.3").to(textRef.current, {
			autoAlpha: 0,
			y: -20,
			duration: .3,
			ease: "power2.in"
		}).to([
			layer3Ref.current,
			layer2Ref.current,
			layer1Ref.current
		], {
			yPercent: -100,
			borderBottomLeftRadius: "50%",
			borderBottomRightRadius: "50%",
			duration: .8,
			ease: "power4.inOut",
			stagger: .1
		}, "-=0.1").set(containerRef.current, { autoAlpha: 0 });
	});
	(0, import_react.useEffect)(() => {
		const handleTransition = (e) => {
			const customEvent = e;
			triggerTransition(customEvent.detail.href, customEvent.detail.name, customEvent.detail.isHome);
		};
		window.addEventListener("start-page-transition", handleTransition);
		return () => window.removeEventListener("start-page-transition", handleTransition);
	}, [triggerTransition]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		className: "fixed inset-0 z-[9999] pointer-events-none invisible flex items-center justify-center overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: layer1Ref,
				className: "absolute inset-0 bg-blue-400 w-full h-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: layer2Ref,
				className: "absolute inset-0 bg-blue-600 w-full h-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: layer3Ref,
				className: "absolute inset-0 bg-[#1B5CFE] w-full h-full"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: textRef,
				className: "relative z-10 flex flex-col items-center justify-center gap-4 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]",
				children: isHome ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/image/logo/dark-mode-logo.png",
					alt: "Crave",
					className: "h-16 md:h-24 w-auto object-contain"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-5xl md:text-7xl font-bold text-white tracking-tight",
					children: text
				})
			})
		]
	});
}
var lenisExcludedRoutes = [
	"/dashboard",
	"/patients",
	"/schedule",
	"/activity-log",
	"/settings",
	"/food-scan",
	"/nurses",
	"/admin-approvals",
	"/account-status"
];
function ScrollProvider({ children }) {
	const location = useLocation();
	const lenisRef = (0, import_react.useRef)(null);
	const shouldUseLenis = !lenisExcludedRoutes.some((route) => location.pathname.startsWith(route));
	(0, import_react.useEffect)(() => {
		if (!shouldUseLenis) return;
		let isCancelled = false;
		let activeLenis = null;
		let rafId = 0;
		const startLenis = async () => {
			const { default: LenisConstructor } = await import("../_libs/lenis.mjs").then((n) => n.t);
			if (isCancelled) return;
			const lenis = new LenisConstructor({
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: "vertical",
				gestureOrientation: "vertical",
				smoothWheel: true,
				syncTouch: true,
				syncTouchLerp: .075,
				wheelMultiplier: 1,
				touchMultiplier: 2
			});
			activeLenis = lenis;
			lenisRef.current = lenis;
			window.__lenisControl__ = {
				stop: () => lenis.stop(),
				start: () => lenis.start()
			};
			function raf(time) {
				lenis.raf(time);
				rafId = requestAnimationFrame(raf);
			}
			rafId = requestAnimationFrame(raf);
		};
		startLenis();
		const handleAnchorClick = (e) => {
			const link = e.target.closest("a");
			const lenis = activeLenis;
			if (!lenis) return;
			if (link && link.getAttribute("href")?.startsWith("/#")) {
				const id = link.getAttribute("href")?.split("#")[1];
				const element = document.getElementById(id || "");
				if (element) {
					e.preventDefault();
					lenis.scrollTo(element, { offset: -80 });
					window.history.pushState(null, "", `#${id}`);
				}
			} else if (link && link.getAttribute("href")?.startsWith("#")) {
				const id = link.getAttribute("href")?.substring(1);
				const element = document.getElementById(id || "");
				if (element) {
					e.preventDefault();
					lenis.scrollTo(element, { offset: -80 });
					window.history.pushState(null, "", `#${id}`);
				}
			} else if (link && link.getAttribute("href") === "/") {
				if (window.location.pathname === "/") {
					e.preventDefault();
					lenis.scrollTo(0);
					window.history.pushState(null, "", "/");
				}
			}
		};
		document.addEventListener("click", handleAnchorClick);
		return () => {
			isCancelled = true;
			if (rafId) cancelAnimationFrame(rafId);
			activeLenis?.destroy();
			document.removeEventListener("click", handleAnchorClick);
			delete window.__lenisControl__;
		};
	}, [shouldUseLenis]);
	(0, import_react.useEffect)(() => {
		if (window.location.hash) return;
		const lenis = shouldUseLenis ? lenisRef.current : null;
		if (lenis) {
			lenis.scrollTo(0, { immediate: true });
			return;
		}
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "instant"
		});
	}, [location.pathname, shouldUseLenis]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$1 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Crave" },
			{
				name: "description",
				content: "Crave Landing Page"
			},
			{
				name: "author",
				content: "Crave Team"
			},
			{
				property: "og:title",
				content: "Crave"
			},
			{
				property: "og:description",
				content: "Crave Landing Page"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Crave"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/image/logo/light-mode-logo.png",
				media: "(prefers-color-scheme: light)"
			},
			{
				rel: "icon",
				href: "/image/logo/dark-mode-logo.png",
				media: "(prefers-color-scheme: dark)"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "scroll-smooth",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$1.useRouteContext();
	(0, import_react.useEffect)(() => {
		const handleContextMenu = (e) => {
			const target = e.target;
			if (target && target.tagName === "IMG") e.preventDefault();
		};
		document.addEventListener("contextmenu", handleContextMenu);
		return () => document.removeEventListener("contextmenu", handleContextMenu);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransitionOverlay, {})]
	});
}
var $$splitComponentImporter = () => import("./routes-K5QjDhlK.mjs");
var rootRouteChildren = { IndexRoute: createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Crave — Kelola bisnis anda di dalam #1 Software" },
		{
			name: "description",
			content: "Crave mempermudah manajemen bisnis."
		},
		{
			property: "og:title",
			content: "Crave — Kelola bisnis anda di dalam #1 Software"
		},
		{
			property: "og:description",
			content: "Track policies, monitor documents, and never miss a renewal with one insurance dashboard."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
}).update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter, router_C_iqRMAD_exports as t };
