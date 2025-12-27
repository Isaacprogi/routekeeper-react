import React from "react";

/**
 * Route access type
 */
export type RouteType = "public" | "private" | "neutral";

/**
 * Index route (no path, no children)
 */
type IndexRouteConfig = {
  index: true;
  element: React.ReactNode;
  type?: RouteType;

  // explicitly disallowed
  path?: never;
  children?: never;
};

/**
 * Path route (normal route)
 */
type PathRouteConfig = {
  path: string;
  index?: false;
  element: React.ReactNode;
  type?: RouteType;
  children?: RouteConfig[];
};

/**
 * Unified route config used by RouteKeeper
 */
export type RouteConfig = (IndexRouteConfig | PathRouteConfig) & {
  /**
   * Allowed roles for this route
   * If omitted, route is accessible to all authenticated users
   */
  roles?: string[];

  /**
   * Whether the route should match case-sensitively
   */
  caseSensitive?: boolean;

  /**
   * Prevent inheriting parent roles
   */
  excludeParentRole?: boolean;
};

/**
 * Props for the RouteGuard / RouteKeeper component
 */
export interface RouteGuardProps {
  /**
   * Route definitions
   */
  routes: RouteConfig[];

  /**
   * Authentication state
   */
  auth: boolean;

  /**
   * Current user's roles
   */
  userRoles?: string[];

  /**
   * Global loading state (e.g. auth bootstrap)
   */
  loading: boolean;

  /**
   * Screen to show while loading
   */
  loadingScreen?: React.ReactNode;

   /**
   * Redirect unauthenticated users
   * when accessing private routes
   */
  privateRedirect: string;

  /**
   * Redirect path for authenticated users visiting public routes
   */
  publicRedirect?: string;

  /**
   * Fallback UI for private routes
   */
  privateFallback?: React.ReactNode;

  /**
   * Unauthorized access UI
   */
  unAuthorized?: React.ReactNode;

  /**
   * Not-found route UI
   */
  notFound?: React.ReactNode;
}
