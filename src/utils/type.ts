import React from "react";

export type RouteType = "public" | "private" | "neutral";

export interface RedirectTo {
  pathname: string;
  search?: string;
  hash?: string;
  state?: any;
  replace?: boolean;
  relative?: "route" | "path";
  preventScrollReset?: boolean;
}

export type RenderRoute = {
  element: React.ReactNode;
  redirectTo?: never;
  fallback?: never;     
};

export type RedirectRoute = {
  redirectTo: RedirectTo;  
  element?: never;
  fallback?: never;
};


export type IndexRouteConfig = {
  index: true;
  path?: never;
  children?: never;
};

export type PathRouteConfig = {
  path: string;
  index?: false;
  children?: RouteConfig[];
};


export type RouteConfig =
  (RenderRoute | RedirectRoute) &  
  (IndexRouteConfig | PathRouteConfig) &
  {
    type?: RouteType;
    roles?: string[];
    caseSensitive?: boolean;
    excludeParentRole?: boolean;
  };

export interface RouteGuardProps {
  routes: RouteConfig[];
  auth: boolean | string; 
  userRoles?: string[];
  loading: boolean;
  loadingScreen?: React.ReactNode;
  privateRedirect: string;
  publicRedirect?: string;
  privateFallback?: React.ReactNode;
  unAuthorized?: React.ReactNode;
  notFound?: React.ReactNode;
  disableErrorBoundary?: boolean;
  setRemoveErrorBoundary?: React.Dispatch<React.SetStateAction<boolean>>;
  onRouteChange?: (location: string) => void;
  onRedirect?: (from: string, to: string) => void;
}