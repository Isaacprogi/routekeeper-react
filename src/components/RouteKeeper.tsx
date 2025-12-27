import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { RouteConfig, RouteGuardProps } from "../utils/type";
import { LoadingScreen } from "./LoadingScreen";
import { LandingFallback } from "./LandingFallback";
import { ErrorBoundary } from "./ErrorBoundary";
import { Unauthorized } from "./UnAuthorized";
import { NotFound } from "./NotFound";

export const RouteKeeper: React.FC<RouteGuardProps> = ({
  routes,
  auth,
  userRoles = [],
  loading,
  loadingScreen = <LoadingScreen />,
  publicRedirect = "/",
  privateFallback = <LandingFallback />,
  privateRedirect = "/login",
  notFound = <NotFound />,
  unAuthorized = <Unauthorized />,
}) => {
  if (loading) return loadingScreen;

  const safePrivateRedirect =
    typeof privateRedirect === "string" && privateRedirect.trim() !== ""
      ? privateRedirect
      : "/login";

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
        excludeParentRole,
        ...rest
      }:RouteConfig) => {
        if (index) {
          if (indexUsed) {
            console.warn(
              `Duplicate index route at parentKey="${parentKey}" ignored.`
            );
            return null;
          }
          indexUsed = true;
        }

        if (path) {
          if (usedPaths.has(path)) {
            console.warn(
              `Duplicate sibling path "${path}" at parentKey="${parentKey}" ignored.`
            );
            return null;
          }
          usedPaths.add(path);
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

        if (path === "/") {
          if (!auth) {
            routeElement = privateFallback;
          } else {
            routeElement = element;
          }
        }
        
        else {
          switch (routeType) {
            case "private":
              routeElement = !auth ? (
                <Navigate to={safePrivateRedirect} replace />
              ) : !hasRoleAccess ? (
                unAuthorized
              ) : (
                element
              );
              break;

            case "public":
              routeElement = auth ? (
                <Navigate to={publicRedirect} replace />
              ) : (
                element
              );
              break;

            case "neutral":
              routeElement = element;
              break;

            default:
              routeElement = null;
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
    <ErrorBoundary>
      <Routes>
        {renderRoutes(routes)}
        <Route path="*" element={notFound} />
      </Routes>
    </ErrorBoundary>
  );
};
