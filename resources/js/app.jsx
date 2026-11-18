import '../css/app.css';
import '@/lib/pwa';
import { initSmoothScroll } from '@/lib/smoothScroll';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';

// Inisialisasi sistem universal smooth scrolling & hash navigation
initSmoothScroll();

const appName = import.meta.env.VITE_APP_NAME || 'Crave HRM';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <TooltipProvider>
                <App {...props} />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#1B5CFE',
    },
});
