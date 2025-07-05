import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { studentRoutes } from './routes/studentRoutes.js';
import { teacherRoutes } from './routes/teacherRoutes.js';
import {ROLES, ROUTE_NAMES} from '@/constants.js';

const baseRoutes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/views/LoginView.vue'),
        meta: {
            isPublic: true,
            title: 'Login',
            hideForAuthenticated: true // Redirect authenticated users away from login
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: { isPublic: true, title: 'Not Found' },
    },
];

const routes = [...baseRoutes, ...studentRoutes, ...teacherRoutes];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Update page title after each navigation
router.afterEach((to) => {
    document.title = to.meta?.title || 'TimeTile';
});

// Navigation guard for authentication and authorization
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    if (!auth.isInitialized) {
        await auth.initializeAuth();
    }

    // Debug logging (remove in production)
    console.log('Navigation Guard:', {
        to: { name: to.name, path: to.path, params: to.params },
        from: { name: from.name },
        auth: {
            isAuthenticated: auth.isAuthenticated,
            role: auth.userRole,
            domain: auth.institutionDomain
        }
    });

    // Handle public routes
    if (to.meta?.isPublic) {
        // Redirect authenticated users away from login page
        if (to.meta?.hideForAuthenticated && auth.isAuthenticated) {
            const defaultRoute = auth.defaultRoute;
            if (defaultRoute) {
                return next(defaultRoute);
            }
        }
        return next();
    }

    // Check authentication for protected routes
    if (!auth.isAuthenticated) {
        console.log('User not authenticated, redirecting to login');
        return next({
            name: ROUTE_NAMES.LOGIN,
            query: { redirect: to.fullPath },
        });
    }

    // Check role-based access
    if (!hasValidRoleAccess(to, auth)) {
        console.log('Invalid role access, redirecting to default route');
        const defaultRoute = auth.defaultRoute;
        if (defaultRoute) {
            return next(defaultRoute);
        } else {
            return next({ name: 'Unauthorized' });
        }
    }

    // Check domain-based access
    if (!hasValidDomainAccess(to, auth)) {
        console.log('Invalid domain access, redirecting to correct domain');
        const correctedRoute = {
            name: to.name,
            params: {
                ...to.params,
                institutionDomain: auth.institutionDomain
            },
            query: to.query
        };
        return next(correctedRoute);
    }

    // Check permission-based access
    if (!hasRequiredPermissions(to, auth)) {
        console.log('Insufficient permissions');
        return next({ name: 'Unauthorized' });
    }

    // All checks passed
    console.log('All navigation checks passed');
    return next();
});

function hasValidRoleAccess(to, auth) {
    const requiredRole = to.meta?.role;

    // If no role required, allow access
    if (!requiredRole) return true;

    // Normalize role comparison (case-insensitive)
    const userRole = auth.userRole?.toLowerCase();
    const routeRole = requiredRole.toLowerCase();

    return userRole === routeRole;
}

function hasValidDomainAccess(to, auth) {
    const routeDomain = to.params?.institutionDomain;

    // If no domain in route, allow access
    if (!routeDomain) return true;

    // Check if the domain matches user's institution
    return routeDomain === auth.institutionDomain;
}

function hasRequiredPermissions(to, auth) {
    const requiredPermissions = to.meta?.permissions || [];

    // If no permissions required, allow access
    if (requiredPermissions.length === 0) return true;

    // Check if user has all required permissions
    return requiredPermissions.every(permission =>
        auth.hasPermission(permission)
    );
}

function createDefaultRoute(auth) {
    if (!auth.isAuthenticated || !auth.institutionDomain) {
        return { name: ROUTE_NAMES.LOGIN };
    }

    const routeName = auth.userRole === ROLES.STUDENT
        ? ROUTE_NAMES.STUDENT_HOME
        : ROUTE_NAMES.TEACHER_HOME;

    return {
        name: routeName,
        params: { institutionDomain: auth.institutionDomain }
    };
}

export const navigationHelpers = {
    /**
     * Navigate to user's default route
     */
    async goToDefaultRoute() {
        const auth = useAuthStore();
        const defaultRoute = auth.defaultRoute;

        if (defaultRoute) {
            await router.push(defaultRoute);
        } else {
            await router.push({ name: ROUTE_NAMES.LOGIN });
        }
    },

    /**
     * Navigate with proper error handling
     */
    async navigateTo(route) {
        try {
            await router.push(route);
        } catch (error) {
            console.error('Navigation failed:', error);

            // Fallback to default route
            await this.goToDefaultRoute();
        }
    },

    /**
     * Check if a route is accessible by current user
     */
    canAccessRoute(route) {
        const auth = useAuthStore();
        return auth.canAccessRoute(route);
    }
};

export default router;