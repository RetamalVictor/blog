export interface Route {
    path: string;
    component: () => Promise<void> | void;
    title?: string;
}

export class Router {
    private routes: Map<string, Route> = new Map();
    private currentRoute: string = '/';
    private initialized: boolean = false;

    constructor() {
        this.init();
    }

    private init(): void {
        window.addEventListener('popstate', () => {
            this.handleRouteChange();
        });

        // Don't handle initial route here - wait until routes are added
    }

    public initialize(): void {
        // Handle initial route after all routes have been registered
        if (!this.initialized) {
            this.initialized = true;
            this.handleRouteChange();
        }
    }

    public addRoute(path: string, component: () => Promise<void> | void, title?: string): void {
        this.routes.set(path, { path, component, title });
    }

    public navigate(path: string): void {
        if (path === this.currentRoute) return;

        this.currentRoute = path;
        window.history.pushState({}, '', path);
        this.handleRouteChange();
    }

    private async handleRouteChange(): Promise<void> {
        const path = window.location.pathname;
        this.currentRoute = path;

        // Check for exact match
        let route = this.routes.get(path);

        // Check for dynamic routes (e.g., /project/:id)
        if (!route) {
            for (const [routePath, routeConfig] of this.routes) {
                if (this.matchDynamicRoute(routePath, path)) {
                    route = routeConfig;
                    break;
                }
            }
        }

        // Fallback to home route
        if (!route) {
            route = this.routes.get('/');
        }

        if (route) {
            // Update page title
            if (route.title) {
                document.title = `${route.title} - Victor Retamal`;
            }

            // Execute route component
            try {
                await route.component();
            } catch (error) {
                console.error('Router: Error loading route:', error);
                // On error, navigate to home
                const homeRoute = this.routes.get('/');
                if (homeRoute && homeRoute !== route) {
                    await homeRoute.component();
                }
            }
        }
    }

    private matchDynamicRoute(routePath: string, currentPath: string): boolean {
        const routeParts = routePath.split('/');
        const currentParts = currentPath.split('/');

        if (routeParts.length !== currentParts.length) {
            return false;
        }

        return routeParts.every((part, index) => {
            return part.startsWith(':') || part === currentParts[index];
        });
    }

    public getRouteParams(routePath: string, currentPath: string): Record<string, string> {
        const routeParts = routePath.split('/');
        const currentParts = currentPath.split('/');
        const params: Record<string, string> = {};

        routeParts.forEach((part, index) => {
            if (part.startsWith(':')) {
                const paramName = part.substring(1);
                params[paramName] = currentParts[index];
            }
        });

        return params;
    }

    public getCurrentRoute(): string {
        return this.currentRoute;
    }
}