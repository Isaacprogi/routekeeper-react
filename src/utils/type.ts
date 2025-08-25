import React from "react";

export type RouteType = "public" | "private";


export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  type: RouteType;
  children?: RouteConfig[];
  notFound?: React.ReactNode;
  index?: boolean;
  roles?: string[]; // <-- allowed roles for this route
  excludeParentRole?:boolean;
}

export interface RouteGuardProps {
  routes: RouteConfig[];
  accessToken: string | null;
  userRoles?: string[]; // <-- current user's role
  loadingScreen?: React.ReactNode;
  publicRedirect?: string;
  privateFallback?: React.ReactNode;
  loading: boolean;
  notFound?: React.ReactNode;
  unAuthorized: React.ReactNode;
}

