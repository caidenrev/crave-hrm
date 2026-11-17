globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/dark-mode-logo.png": {
		"type": "image/png",
		"etag": "\"2e31f-IlRh9REp22S3TrF1l8ybsGr6Et8\"",
		"mtime": "2026-08-29T06:45:02.731Z",
		"size": 189215,
		"path": "../public/dark-mode-logo.png"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"ae-hLVBrSrDdpIw3Xl0dJPRkupPepQ\"",
		"mtime": "2026-08-18T13:57:42.323Z",
		"size": 174,
		"path": "../public/robots.txt"
	},
	"/assets/lenis-SLnaB0gZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"48b0-vtmGOlY8qB8NAJihFo64fm7YOR4\"",
		"mtime": "2026-10-03T06:17:47.798Z",
		"size": 18608,
		"path": "../public/assets/lenis-SLnaB0gZ.js"
	},
	"/assets/index-BIAeNGii.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6585c-Kf5fO0Sl1T9vZCoJ/+ARLUSOQjs\"",
		"mtime": "2026-10-03T06:17:47.797Z",
		"size": 415836,
		"path": "../public/assets/index-BIAeNGii.js"
	},
	"/light-mode-logo.png": {
		"type": "image/png",
		"etag": "\"2ec2b-58+P2l0sj494VrZB9aJM6xivQZw\"",
		"mtime": "2026-08-29T06:45:02.731Z",
		"size": 191531,
		"path": "../public/light-mode-logo.png"
	},
	"/assets/routes-BnzwdsxK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5c9b3-hHNTZZymFWlUu8NzNUIoiLmnQR0\"",
		"mtime": "2026-10-03T06:17:47.799Z",
		"size": 379315,
		"path": "../public/assets/routes-BnzwdsxK.js"
	},
	"/3D-icon/grow.png": {
		"type": "image/png",
		"etag": "\"25405-tFsCrT5/wb5wEXfyZGJFcu/tqFM\"",
		"mtime": "2026-08-19T06:42:16.614Z",
		"size": 152581,
		"path": "../public/3D-icon/grow.png"
	},
	"/assets/routes-DfK36c3K.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"33c-+1zgCnVv0K76h0qMN+UwYG8ahbQ\"",
		"mtime": "2026-10-03T06:17:47.799Z",
		"size": 828,
		"path": "../public/assets/routes-DfK36c3K.css"
	},
	"/logo/AWS Logo - Colored - zonalogo.com.svg": {
		"type": "image/svg+xml",
		"etag": "\"10d9-87zZ07RarnFpoeCHOP6RvNWroZs\"",
		"mtime": "2026-08-14T19:40:42.000Z",
		"size": 4313,
		"path": "../public/logo/AWS Logo - Colored - zonalogo.com.svg"
	},
	"/assets/styles-B5QDNpx0.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1e8b1-5oxmYXDtMjWxxkeLRnF+SAtSdcw\"",
		"mtime": "2026-10-03T06:17:47.800Z",
		"size": 125105,
		"path": "../public/assets/styles-B5QDNpx0.css"
	},
	"/logo/AWS Logo - Light - zonalogo.com.svg": {
		"type": "image/svg+xml",
		"etag": "\"10d1-gedeZum8cgzq0I2UqwJ67cow8O4\"",
		"mtime": "2026-08-14T19:40:48.000Z",
		"size": 4305,
		"path": "../public/logo/AWS Logo - Light - zonalogo.com.svg"
	},
	"/logo/Cloudflare Icon - Colored - zonalogo.com.svg": {
		"type": "image/svg+xml",
		"etag": "\"8aa-I2BUlQbes3HuDOGFb8sdzpWdEhw\"",
		"mtime": "2026-08-14T19:41:28.000Z",
		"size": 2218,
		"path": "../public/logo/Cloudflare Icon - Colored - zonalogo.com.svg"
	},
	"/logo/Cloudinary Logo - Colored - zonalogo.com.svg": {
		"type": "image/svg+xml",
		"etag": "\"dc2-qaeouuYtSR51qXU4/0D6AyZiTKI\"",
		"mtime": "2026-08-14T19:42:14.000Z",
		"size": 3522,
		"path": "../public/logo/Cloudinary Logo - Colored - zonalogo.com.svg"
	},
	"/logo/Google Cloud Icon - Colored - zonalogo.com.svg": {
		"type": "image/svg+xml",
		"etag": "\"810-iBZq41WtWIX5OD1tHRO12oIYAzg\"",
		"mtime": "2026-08-14T19:41:10.000Z",
		"size": 2064,
		"path": "../public/logo/Google Cloud Icon - Colored - zonalogo.com.svg"
	},
	"/logo/Azure Logo - Colored - zonalogo.com.svg": {
		"type": "image/svg+xml",
		"etag": "\"bdd-YsqgGoRHK0QLl+OEL187cXCddGw\"",
		"mtime": "2026-08-14T19:40:04.000Z",
		"size": 3037,
		"path": "../public/logo/Azure Logo - Colored - zonalogo.com.svg"
	},
	"/logo/Supabase Icon - Colored - zonalogo.com.svg": {
		"type": "image/svg+xml",
		"etag": "\"78c-yKeX+lVH6GF1iWbTsVYYBJtfP9E\"",
		"mtime": "2026-08-14T19:42:26.000Z",
		"size": 1932,
		"path": "../public/logo/Supabase Icon - Colored - zonalogo.com.svg"
	},
	"/image/cloud (2).png": {
		"type": "image/png",
		"etag": "\"126df-ldh+OL4PiBQYhEXxXWanvaSCtas\"",
		"mtime": "2026-08-18T15:29:09.655Z",
		"size": 75487,
		"path": "../public/image/cloud (2).png"
	},
	"/image/cloud.png": {
		"type": "image/png",
		"etag": "\"252ed-/vgnct+YBCiAk0v52A5nv9A63A4\"",
		"mtime": "2026-08-18T15:26:06.835Z",
		"size": 152301,
		"path": "../public/image/cloud.png"
	},
	"/image/hero.png": {
		"type": "image/png",
		"etag": "\"f0635-EmmKfKfSQwoLThQXX72tcRqcin4\"",
		"mtime": "2026-08-18T15:21:31.959Z",
		"size": 984629,
		"path": "../public/image/hero.png"
	},
	"/3D-icon/3D-icon-2/calendar.png": {
		"type": "image/png",
		"etag": "\"2964b-3hlFEpUDtbBPt4i0nzI7gIqkBmk\"",
		"mtime": "2026-08-19T07:38:14.185Z",
		"size": 169547,
		"path": "../public/3D-icon/3D-icon-2/calendar.png"
	},
	"/image/model.png": {
		"type": "image/png",
		"etag": "\"acf13-6GIiC8LlHFCIK9HYUFq9X3RSOvE\"",
		"mtime": "2026-08-20T10:10:20.508Z",
		"size": 708371,
		"path": "../public/image/model.png"
	},
	"/image/solution.png": {
		"type": "image/png",
		"etag": "\"10c4b8-TkL6T4fzZiuuJOfUYqk+3RoEl4Q\"",
		"mtime": "2026-08-18T19:17:05.054Z",
		"size": 1098936,
		"path": "../public/image/solution.png"
	},
	"/3D-icon/3D-icon-2/listbook.png": {
		"type": "image/png",
		"etag": "\"29366-Z4FsozdsqpukEN3q3W7HXqCNgcI\"",
		"mtime": "2026-08-19T07:37:56.206Z",
		"size": 168806,
		"path": "../public/3D-icon/3D-icon-2/listbook.png"
	},
	"/3D-icon/3D-icon-2/invoice.png": {
		"type": "image/png",
		"etag": "\"3045d-IA4zQ89Ch1iLBc90tepdU7jVEKE\"",
		"mtime": "2026-08-19T07:38:26.951Z",
		"size": 197725,
		"path": "../public/3D-icon/3D-icon-2/invoice.png"
	},
	"/image/logo/dark-mode-logo.png": {
		"type": "image/png",
		"etag": "\"2e31f-IlRh9REp22S3TrF1l8ybsGr6Et8\"",
		"mtime": "2026-08-08T21:44:46.752Z",
		"size": 189215,
		"path": "../public/image/logo/dark-mode-logo.png"
	},
	"/image/logo/light-mode-logo.png": {
		"type": "image/png",
		"etag": "\"2ec2b-58+P2l0sj494VrZB9aJM6xivQZw\"",
		"mtime": "2026-08-08T21:44:46.754Z",
		"size": 191531,
		"path": "../public/image/logo/light-mode-logo.png"
	},
	"/image/model-phone.png": {
		"type": "image/png",
		"etag": "\"268d22-YA6yOYjIERv7tbPr/9sAHgM5uSY\"",
		"mtime": "2026-08-20T11:31:14.711Z",
		"size": 2526498,
		"path": "../public/image/model-phone.png"
	},
	"/3D-icon/business-report.png": {
		"type": "image/png",
		"etag": "\"2ffc2c-KmFH3ReI4mcADU9W3YzxaJjT2R4\"",
		"mtime": "2026-08-18T18:27:39.726Z",
		"size": 3144748,
		"path": "../public/3D-icon/business-report.png"
	},
	"/image/features/kartu-stok.png": {
		"type": "image/png",
		"etag": "\"17cfac-CX1hk2udn8whhjCycKbOPYLaCbs\"",
		"mtime": "2026-08-19T13:39:02.384Z",
		"size": 1560492,
		"path": "../public/image/features/kartu-stok.png"
	},
	"/image/features/card.png": {
		"type": "image/png",
		"etag": "\"167b5b-BROPEajLm00iWnGxaLMq2lP/cKM\"",
		"mtime": "2026-08-19T13:39:10.939Z",
		"size": 1473371,
		"path": "../public/image/features/card.png"
	},
	"/image/features/terlaris.png": {
		"type": "image/png",
		"etag": "\"147a16-T36YmZzBErWs0jicntCIPpL8W94\"",
		"mtime": "2026-08-19T13:39:00.634Z",
		"size": 1341974,
		"path": "../public/image/features/terlaris.png"
	},
	"/image/features/spreadsheet.png": {
		"type": "image/png",
		"etag": "\"1f3530-x/F01iMFNG1HP4V1q8k9A83y3pA\"",
		"mtime": "2026-08-19T13:52:05.788Z",
		"size": 2045232,
		"path": "../public/image/features/spreadsheet.png"
	},
	"/3D-icon/calendar.png": {
		"type": "image/png",
		"etag": "\"8c1f1a-ModmCjLnN+EgweDgCTabIqhOdD4\"",
		"mtime": "2026-08-18T18:25:20.886Z",
		"size": 9183002,
		"path": "../public/3D-icon/calendar.png"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region ../../node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_HTVzs9 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_HTVzs9
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region ../../node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region ../../node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region ../../node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region ../../node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
