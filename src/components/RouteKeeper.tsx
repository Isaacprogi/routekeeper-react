import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { RouteConfig, RouteGuardProps, RedirectTo } from "../utils/type";
import { LoadingScreen } from "./LoadingScreen";
import { LandingFallback } from "./LandingFallback";
import { Unauthorized } from "./UnAuthorized";
import { NotFound } from "./NotFound";
import { ErrorBoundary } from "./ErrorBoundary";
import { devWarn, isLazyElement } from "../utils/functions";
import { Suspense } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

console.log(
  "%c🔥 RouteKeeper COMPONENT IS MOUNTED 🔥",
  "color: #00f2ff; background: #141417; font-size: 10px; font-weight: bold; padding: 6px 12px; border: 1px solid #26262b; border-left: 4px solid #00f2ff; border-radius: 4px; font-family: 'JetBrains Mono', monospace;"
);
export const RK: React.FC<RouteGuardProps> = ({
  routes,
  auth: isAuth,
  userRoles = [],
  loading,
  loadingScreen = <LoadingScreen />,
  publicRedirect = "/",
  privateFallback = <LandingFallback />,
  privateRedirect = "/login",
  notFound = <NotFound />,
  unAuthorized = <Unauthorized />,
  disableErrorBoundary = false,
  setRemoveErrorBoundary,
  onRouteChange,
  onRedirect,
}) => {
  const auth = typeof isAuth === "string" ? Boolean(isAuth) : isAuth;

  const location = useLocation();

  React.useEffect(() => {
    setRemoveErrorBoundary?.(disableErrorBoundary);
  }, [disableErrorBoundary]);

  React.useEffect(() => {
    if (onRouteChange) {
      onRouteChange(location.pathname);
    }
  }, [location.pathname, onRouteChange]);

  if (loading) return loadingScreen;

  const safePrivateRedirect =
    typeof privateRedirect === "string" && privateRedirect.trim() !== ""
      ? privateRedirect
      : "/login";

  const safePublicRedirect =
    typeof publicRedirect === "string" && publicRedirect.trim() !== ""
      ? publicRedirect
      : "/";

  if (!safePublicRedirect) {
    devWarn(
      `publicRedirect must be a non-empty string. Received "${publicRedirect}".`
    );
  }

  const handleRedirect = (redirectTo: RedirectTo) => {
    const {
      pathname,
      search,
      hash,
      state,
      replace = true,
      relative,
      preventScrollReset,
    } = redirectTo;

    const to: any = { pathname };

    if (search) {
      to.search = search.startsWith("?") ? search : `?${search}`;
    }
    if (hash) {
      to.hash = hash.startsWith("#") ? hash : `#${hash}`;
    }
    if (state !== undefined) {
      to.state = state;
    }

    onRedirect?.(location.pathname, pathname);

    const navigateOptions: any = {};

    if (replace !== undefined) {
      navigateOptions.replace = replace;
    }

    if (relative) {
      navigateOptions.relative = relative;
    }

    if (preventScrollReset !== undefined) {
      navigateOptions.preventScrollReset = preventScrollReset;
    }

    return <Navigate to={to} {...navigateOptions} />;
  };

  const renderRoutes = (
    routesArray: RouteConfig[],
    parentKey = "",
    inheritedType?: "private" | "public" | "neutral",
    parentRoles: string[] = []
  ): (React.ReactElement | null)[] => {
    const usedPaths = new Set<string>();
    let indexUsed = false;

    return routesArray.map(
      ({
        path,
        element,
        type,
        children,
        index,
        roles,
        redirectTo,
        excludeParentRole,
        ...rest
      }: RouteConfig) => {
        if (index) {
          if (indexUsed) {
            devWarn(
              `Duplicate sibling path "${path}" at parentKey="${parentKey}".`
            );
            return null;
          }
          indexUsed = true;
        }

        if (path) {
          if (usedPaths.has(path)) {
            devWarn(
              `Duplicate sibling path "${path}" at parentKey="${parentKey}".`
            );
            return null;
          }
          usedPaths.add(path);
        }

        const isLazy = isLazyElement(element);

        if (element && redirectTo) {
          devWarn(
            `Route at path="${path}" cannot have both "element" and "redirectTo".`
          );
        }

        if (!element && !redirectTo) {
          devWarn(
            `Route at path="${path}" must provide at least an "element" or "redirectTo".`
          );
        }

        if (index && path) {
          devWarn(`Index route must not define a "path".`);
        }

        if (type && !["private", "public", "neutral"].includes(type)) {
          devWarn(
            `Invalid route type "${type}" at path="${path}". Expected "private", "public", or "neutral".`
          );
        }

        if (redirectTo && children?.length) {
          devWarn(`Redirect route "${path}" should not have children.`);
        }

        if (
          redirectTo !== undefined &&
          (!redirectTo.pathname || redirectTo.pathname.trim() === "")
        ) {
          devWarn(`redirectTo.pathname cannot be empty.`);
        }

        if (
          path === "/" &&
          (type === "public" || type === "private" || type === "neutral")
        ) {
          devWarn(
            `Root "/" does not need a type. It is handled differently. Please refer docs`
          );
        }
        if (path && redirectTo?.pathname && path === redirectTo?.pathname) {
          console.log(redirectTo);
          devWarn(`redirectTo and path can't have the same route.`);
        }

        if (path === "" && (element || redirectTo?.pathname)) {
          devWarn(
            `A route with an element or redirect must define a valid "path".`
          );
        }

        const routeType = type || inheritedType || "public";
        let routeElement: React.ReactNode;

        const effectiveRoles =
          roles && excludeParentRole
            ? roles
            : [...new Set([...(parentRoles || []), ...(roles || [])])];

        const hasRoleAccess =
          effectiveRoles.length === 0 ||
          userRoles.some((role) => effectiveRoles.includes(role));

        if (redirectTo) {
          routeElement = handleRedirect(redirectTo);
        } else if (path === "/") {
          routeElement = auth ? element : privateFallback;
        } else {
          /* -----------------------------
           * 2️⃣ Guarded render routes
           * ----------------------------- */
          // NEW: handle lazy routes
          if (isLazy) {
            routeElement = (
              <Suspense fallback={rest.fallback ?? loadingScreen}>
                {element}
              </Suspense>
            );
          } else {
            switch (routeType) {
              case "private": {
                routeElement = !auth ? (
                  <Navigate to={safePrivateRedirect} replace />
                ) : !hasRoleAccess ? (
                  unAuthorized
                ) : (
                  element
                );
                break;
              }

              case "public": {
                routeElement = auth ? (
                  <Navigate to={safePublicRedirect} replace />
                ) : (
                  element
                );
                break;
              }

              case "neutral": {
                routeElement = element;
                break;
              }

              default:
                routeElement = null;
            }
          }
        }

        const childRoutes = children
          ? renderRoutes(
              children,
              parentKey + (path || "index"),
              routeType,
              effectiveRoles
            )
          : undefined;

        if (index) {
          return (
            <Route
              key={parentKey + "index"}
              index
              element={routeElement}
              {...rest}
            />
          );
        }

        if (children && children.length > 0) {
          return (
            <Route
              key={parentKey + path}
              path={path}
              element={routeElement}
              {...rest}
            >
              {childRoutes}
            </Route>
          );
        } else {
          // Leaf route — no children, just render the element directly
          return (
            <Route
              key={parentKey + path}
              path={path}
              element={routeElement}
              {...rest}
            />
          );
        }
      }
    );
  };

  return (
    <Routes>
      {renderRoutes(routes)}
      <Route path="*" element={notFound} />
    </Routes>
  );
};

export const RouteKeeper: React.FC<RouteGuardProps> = (props) => {
  const [removeErrorBoundary, setRemoveErrorBoundary] = useState(false);

  if (removeErrorBoundary) {
    return <RK {...props} setRemoveErrorBoundary={setRemoveErrorBoundary} />;
  }

  return (
    <ErrorBoundary>
      <RK {...props} setRemoveErrorBoundary={setRemoveErrorBoundary} />
    </ErrorBoundary>
  );
};
