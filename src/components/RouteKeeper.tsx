import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import type { RouteConfig, RouteGuardProps } from "../utils/type";
import { LoadingScreen } from "./LoadingScreen";
import { LandingFallback } from "./LandingFallback";
import { ErrorBoundary } from "./ErrorBoundary";
import { Unauthorized } from "./Unauthorized";
import { NotFound } from "./NotFound";

export const RouteKeeper: React.FC<RouteGuardProps> = ({
  routes,
  accessToken,
  userRoles = [],
  loading,
  loadingScreen = <LoadingScreen />,
  publicRedirect = "/",
  privateFallback = <LandingFallback />,
  notFound = <NotFound />,
  unAuthorized = <Unauthorized />,
}) => {
  if (loading) return loadingScreen;

  const renderRoutes = (
    routesArray: RouteConfig[],
    parentKey = "",
    inheritedType?: "private" | "public",
    parentRoles: string[] = []
  ): React.ReactNode =>
    routesArray.map(
      ({ path, element, type, children, index, roles, excludeParentRole }) => {
        const usedPaths = new Set<string>();
        let indexUsed = false;

        if (index) {
          if (indexUsed) {
            console.warn(
              `Duplicate index route at parentKey="${parentKey}" ignored.`
            );
            return null;
          }
          indexUsed = true;
        }

        // Check for duplicate sibling path
        if (path) {
          if (usedPaths.has(path)) {
            console.warn(
              `Duplicate sibling path "${path}" at parentKey="${parentKey}" ignored.`
            );
            return null;
          }
          usedPaths.add(path);
        }

        // Children inherit parent type if not explicitly defined
        const routeType = type || inheritedType || "public";
        let routeElement: React.ReactNode;

        const effectiveRoles =
          roles && excludeParentRole
            ? roles
            : [...new Set([...(parentRoles || []), ...(roles || [])])];

        console.log(effectiveRoles);

        // Check role access
        const hasRoleAccess =
          effectiveRoles.length === 0 ||
          userRoles.some((role) => effectiveRoles.includes(role));

        if (path === "/") {
          routeElement = accessToken ? element : privateFallback;
        } else if (type === "private") {
          if (!hasRoleAccess) {
            routeElement = unAuthorized;
          } else {
            routeElement = accessToken ? (
              element
            ) : (
              <Navigate to="/login" replace />
            );
          }
        } else {
          routeElement = accessToken ? (
            <Navigate to={publicRedirect} replace />
          ) : (
            element
          );
        }

        if (index) {
          return (
            <Route key={`${parentKey}index`} index element={routeElement} />
          );
        }

        return (
          <Route key={`${parentKey}${path}`} path={path} element={routeElement}>
            {children &&
              children.length > 0 &&
              renderRoutes(
                children,
                `${parentKey}${path}-`,
                routeType,
                effectiveRoles
              )}
          </Route>
        );
      }
    );

  return (
    <ErrorBoundary>
      <Routes>
        {renderRoutes(routes)}
        <Route path="*" element={notFound} />
      </Routes>
    </ErrorBoundary>
  );
};
