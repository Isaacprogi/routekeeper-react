# RouteKeeper — React RouteGuard for role-based and protected routing.


> *Route protection and access management, simplified for React.*

**RouteKeeper** is a React routing utility that manages access and navigation intelligently. It ensures users always reach the right pages based on authentication and roles, simplifying route management and enforcing access control in any application—whether a simple dashboard or a large-scale app.

---

## Features / What It Does

### Declarative Route Guards
- Protect routes based on authentication state (`auth`) and user roles (`userRoles`) without writing repetitive logic.

### Role-Based Access Control (RABC)
- Restrict routes to users with specific roles.
- Supports inheritance across nested routes for flexible access management.

### Public, Private, and Neutral Routes
- **Public:** Accessible to all users; can redirect authenticated users.
- **Private:** Requires authentication, with optional role checks.
- **Neutral:** Always accessible, ignores authentication.

### Nested Routes Support
- Seamlessly works with deeply nested route configurations.
- Respects parent roles and route types.

### Redirect Handling
- Automatically redirect users if they try to access unauthorized routes.
- Supports `pathname`, `search`, `hash`, `state`, `replace`, `relative`, and `preventScrollReset`.

### Lazy-Loaded Routes Support
- Handles `React.lazy` routes with built-in `Suspense` fallbacks.

### Custom Fallback Screens
- **Loading screen:** `loadingScreen`
- **Private route fallback:** `privateFallback`
- **Unauthorized access screen:** `unAuthorized`
- **Not found page:** `notFound`

### Optional Error Boundary
- Wraps your app in an error boundary by default.
- Can be disabled using `disableErrorBoundary`.

### Route Change & Redirect Callbacks
- **onRouteChange:** Triggered when the current route changes.
- **onRedirect:** Triggered whenever a redirect occurs.

### Development Warnings
- Provides helpful console warnings for misconfigured routes, duplicate paths, invalid redirects, and more.

## Quick Start

### Installation

```bash

npm install routekeeper-react


yarn add routekeeper-react


pnpm add routekeeper-react
```

## 30-Second Setup


```tsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { RouteKeeper } from "routekeeper-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LandingPage from "./components/LandingPage";
import { defineRoutes } from 'routekeeper-react';

const userIsLoggedIn = true; // Replace with your auth logic

const routes = defineRoutes([
  { path: "/", element: <Home />, type: "private" },
  { path: "/login", element: <Login />, type: "public" }
]);

const App = () => {
  return (
    <BrowserRouter>
      <RouteKeeper
        routes={routes}
        auth={userIsLoggedIn}
        privateFallback={<LandingPage />}
      />
    </BrowserRouter>
  );
};

export default App;

```

---

## Route Type Reference

| Type | Description |
|------|-------------|
| `public` | Accessible to all users. Authenticated users may be redirected if `publicRedirect` is set. |
| `private` | Accessible only to authenticated users. Unauthenticated users are redirected to `privateRedirect` or shown `privateFallback`. |
| `neutral` | Accessible to everyone, regardless of authentication state. RouteKeeper does not enforce any auth or redirection. |
 

## RouteKeeper Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `routes` | `RouteConfig[]` | `[]` | Array of route definitions used by RouteKeeper. |
| `auth` | `boolean \| string` | `false` | Authentication state of the user. Pass `true`/`false` or a token string (e.g., JWT). Non-empty string is treated as authenticated. |
| `userRoles` | `string[]` | `[]` | Roles assigned to the current user for role-based access control. |
| `loading` | `boolean` | `false` | Global loading state (e.g., while authenticating). |
| `loadingScreen` | `React.ReactNode` | `<LoadingScreen />` | Custom component displayed while loading. |
| `privateRedirect` | `string` | `"/login"` | Path to redirect unauthenticated users from private routes. |
| `publicRedirect` | `string` | `/` | Path to redirect authenticated users from public-only routes. |
| `privateFallback` | `React.ReactNode` | `<LandingFallback />` | Fallback UI for private routes when access is restricted. |
| `unAuthorized` | `React.ReactNode` | `<Unauthorized />` | UI shown when user lacks permission for a route. |
| `notFound` | `React.ReactNode` | `<NotFound />` | UI shown for non-existent routes (404). |
| `disableErrorBoundary` | `boolean` | `false` | Disables RouteKeeper’s internal ErrorBoundary. |
| `onRouteChange` | `(location: string) => void` | `undefined` | Callback fired whenever the route changes. |
| `onRedirect` | `(from: string, to: string) => void` | `undefined` | Callback fired whenever a redirect occurs. |


## Individual Route Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | `undefined` | The URL path for this route. Required for normal routes; not used for index routes. |
| `index` | `boolean` | `false` | Marks the route as an index route (renders at the parent path). Cannot be used with `path`. |
| `element` | `React.ReactNode` | `undefined` | The React component to render when this route is matched. Mutually exclusive with `redirectTo`. |
| `redirectTo` | `RedirectTo` | `undefined` | Redirect configuration. Mutually exclusive with `element`. |
| `type` | `"public" \| "private" \| "neutral"` | `"public"` | Defines access type: public, private, or neutral. |
| `children` | `RouteConfig[]` | `[]` | Nested routes for multi-level hierarchies. |
| `roles` | `string[]` | `[]` | Optional roles allowed to access this route. If omitted, all authenticated users can access. |
| `caseSensitive` | `boolean` | `false` | Whether route matching should be case-sensitive. |
| `excludeParentRole` | `boolean` | `false` | If `true`, this route will not inherit allowed roles from its parent route. |
| `fallback` | `React.ReactNode` | `undefined` | Optional fallback UI for lazy-loaded routes. Only used with `element` passed as lazy. |




## Real-World Example

### Advanced Usage with Nested Routes and Role-Based Access

```tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RouteKeeper, type RouteConfig } from "routekeeper-react";
import { AuthProvider, useAuth } from "./auth";
import { defineRoutes } from 'routekeeper-react';

// Import your page components
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";
import ShareFile from "./pages/dashboard/ShareFile";

// Import your fallback and UI components
import WelcomePage from "./components/WelcomePage";
import OopsPage from "./components/OopsPage";
import AccessDenied from "./components/AccessDenied";
import SpinnyThing from "./components/SpinnyThing";

// Define the application routes
const routes = defineRoutes([
  // Public routes
  { path: "/login", element: <Login />, type: "public" },
  { path: "/signup", element: <SignUp />, type: "public" },

  // Private home route
  { path: "/", element: <Home />, type: "private" },

  // Dashboard route with nested routes and role-based access
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    type: "private",
    roles: ["admin"], // Only admins can access this route
    children: [
      // Default dashboard view (index route)
      { index: true, element: <Overview />, type: "private" },

      // Analytics page for editors only, independent of parent roles
      { 
        path: "analytics", 
        element: <Analytics />, 
        type: "private", 
        roles: ["editor"], 
        excludeParentRole: true 
      },

      // Settings page accessible to all dashboard users
      { path: "settings", element: <Settings />, type: "private" },

      // Anyone visiting /sharefile will see the ShareFile component.
      // RouteKeeper won’t enforce login or roles for this route.
      { path: "sharefile", element: <ShareFile />, type: "neutral" },
    ],
  },
]);

// Component that wraps RouteKeeper with authentication state
const AppContent = () => {
  const { accessToken, loading, userRoles } = useAuth();

 return (
  <RouteKeeper
    routes={routes}                 // Route definitions (RouteConfig[])
    auth={accessToken}              // Auth state: boolean or token string

    loading={loading}               // Global loading state (e.g. auth check)
    loadingScreen={<SpinnyThing />} // UI shown while loading is true

    privateRedirect="/login"         // Redirect unauthenticated users from private routes
    publicRedirect="/"      // Redirect authenticated users from public-only routes

    privateFallback={<WelcomePage />} // UI shown when private access is blocked
    unAuthorized={<AccessDenied />}   // UI shown when user lacks required role(s)
    notFound={<OopsPage />}           // UI for unmatched routes (404)

    userRoles={userRoles}            // Current user's roles for RBAC

    disableErrorBoundary={false}     // Use RouteKeeper's internal ErrorBoundary
    onRouteChange={(location) =>     // Fired on every route change
      console.log("📍 Route changed:", location)
    }
    onRedirect={(from, to) =>        // Fired on every automatic redirect
      console.log(`🔀 Redirected from ${from} → ${to}`)
    }
  />
);


// Root application component
const App = () => (
  <AuthProvider>               // Provides authentication context
    <Router>                    // Wraps everything in BrowserRouter
      <AppContent />            // Renders the RouteKeeper with routes
    </Router>
  </AuthProvider>
);

export default App;


```

---
## Lazy Route

```tsx
const LazyReports = lazy(() => import("./Reports"));

{
  path: "/reports",
  element: <LazyReports />,
  type: "private",
  roles: ["admin"],
}


```

## Redirects Made Easy

RouteKeeper makes handling redirects simple, flexible, and powerful. Here’s what it does for you:

- **Automatic page redirects**  
No need to write extra logic—RouteKeeper will automatically redirect users from one route to another.  
  
```tsx
{
    path: "/old-dashboard",
    redirectTo: { pathname: "/dashboard" },
}
```
 
- **Advanced routing**  
```tsx
  redirectTo: {
  pathname: "/dashboard",
  search: "?tab=2",
  hash: "#profile",
  state: { from: "/login" },
  replace: true,
  relative: "route",
  preventScrollReset: true,
}
```

```tsx

<RouteKeeper
  routes={routes}
  onRedirect={(from, to) => console.log(`Redirected from ${from} → ${to}`)}
/>
```





## The `/` Route Behaviour

| User Status | What They See at `/` | Why It's Awesome |
|-------------|---------------------|------------------|
|  Not logged in | Landing page (`privateFallback`) | Perfect first impression |
|  Logged in | Home dashboard (`element`) | Straight to the action |

### Behind the Scenes

```
  User visits "/"
        │
        ▼
 "Are you logged in?"
        │
    ┌───┴───┐
    │       │
   YES      NO
    │       │
    ▼       ▼
   Show   Show
   Home   Landing
   Page   Page
```

---

## Avoiding Navigation Issues

Using Navigate inside a route element can push multiple entries into the history stack and make users feel “stuck” when navigating back. 

**Incorrect Approach (Causes Redirect Loop):**

```tsx
// This configuration causes history stacking issues
{
  path: "/",
  element: <Navigate to="/home" />, // Pushes a new history entry on every render
  type: "private"
}

```

If You Must Use Navigate
Always use replace:

```tsx
{
  path: "/",
  element: <Navigate to="/home" replace />, // Replaces history instead of pushing
}

```
This prevents history stacking and restores normal back-button behavior.

**Recommended Approach (RouteKeeper Way)**
```tsx
// Let RouteKeeper handle routing without causing loops
{
  path: "/",
  element: <HomePage />, // Render the component directly
  type: "private"
}
```

Use RouteKeeper’s Internal redirectTo for Redirects
 For intentional redirects (legacy paths, renamed routes), use RouteKeeper’s built-in redirect support:
 ```tsx

{
  path: "/",
  redirectTo: { pathname: "/home", replace: true },
}

 ```

### Why This Approach Works

1. **Unauthenticated user visits `/`** → The `privateFallback` component (landing page) is displayed.  
2. **Authenticated user visits `/`** → The route's `element` (home page) is rendered, returns Navigate with replace or use internal redirect to redirect. 
3. **Authenticated user visits `/login` or any public route** → Automatically redirected to `/` and sees the home page.  
4. **Result:** Routing works predictably with no  unexpected behavior.


---

## Advanced Patterns

### Role-Based Route Hierarchy

```jsx
const routes = [
  {
    path: "/company",
    element: <CompanyLayout />,
    type: "private",
    roles: ["employee"], // Base requirement
    children: [
      {
        path: "reports",
        element: <Reports />,
        type: "private",
        roles: ["manager"], // Inherits + requires manager
      },
      {
        path: "admin",
        element: <AdminPanel />,
        type: "private", 
        roles: ["admin"],
        excludeParentRole: true // Only admins, not employees+admins
      }
    ]
  }
];
```

###  Custom Loading Experience

```jsx
const MySpinnyLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin text-6xl mb-4">🚀</div>
      <p className="text-xl">Preparing your awesome experience...</p>
    </div>
  </div>
);

<RouteKeeper
  loadingScreen={<MySpinnyLoader />}
  // ... other props
/>
```

---

## RouteKeeper's Secret Rules (The Plot Twists!)

### The Case of the Missing Type

**Plot Twist #1:** Routes without a `type` have split personalities! 

**Top-level routes (no parents):** Default to **public**
```jsx
// This route is secretly public
{ path: "/about", element: <About /> } // No type? Public it is!

// Same as writing:
{ path: "/about", element: <About />, type: "public" }
```

**Child routes (have parents):** Inherit from **daddy/mommy**
```jsx
{
  path: "/members",
  type: "private", // Parent is private
  children: [
    // This child inherits "private" from parent
    { path: "profile", element: <Profile /> }, // No type = inherits private!
    
    //  Same as writing:
    { path: "profile", element: <Profile />, type: "private" }
  ]
}
```

### The Sacred `/` Route Exception  

**Plot Twist #2:** The `/` route is **ALWAYS treated differetly**.
Even if you explicitly mark it as public, RouteKeeper will override that decision and warn you in development.

```jsx
// You can try to make it public, but RouteKeeper steps in
{ path: "/", element: <Home />, type: "public" } // ⚠️ Still handled specially

```
/ is not a normal route — it’s the entry point of your application.

**Why Does RouteKeeper Do This??**

Because `/` defines the **first impression of your application**.

RouteKeeper treats the root route as special to ensure it:

- never behaves unpredictably  
- never pollutes browser history with unnecessary redirects  
- works consistently across all authentication states

By handling `/` differently, RouteKeeper guarantees a predictable, safe, and user-friendly entry point into your app—whether the user is logged in or not.
?


### The Great Parent-Child Role Reversal

**Plot Twist #3:** When a private parent has public children, the kids win! 

```jsx
// Mind-bending example
{
  path: "/dashboard",
  element: <DashboardLayout />,
  type: "private", // Parent says "Private club only!"
  children: [
    {
      path: "public-info",
      element: <PublicInfo />,
      type: "public" // Child says "Actually, I'm public!" 
    }
    // Result: /dashboard/public-info is accessible to everyone not authenticated!
  ]
}
```

**The Family Drama:** 
- **Parent Route:** "You need to be logged in to access my children!"
- **Child Route:** "Actually dad, I'm public now!" 
- **RouteKeeper:** "Kids these days...  Child wins!"


### RouteKeeper's Logic Laboratory

```
The Rule Book:
┌─────────────────────────────────────────────┐
│ 1️⃣ Top-level, no type? → PUBLIC             │
│ 2️⃣ Child route, no type? → INHERIT PARENT   │
│ 3️⃣ Path is "/"? → ALWAYS DIFFERENT           │  
│ 4️⃣ Child explicitly overrides? → CHILD WINS │
│ 5️⃣ Everything else? → FOLLOW THE TYPE       │
└─────────────────────────────────────────────┘
```

### Real-World Route Example

```tsx
const routesExample = [

  { path: "/", element: <Home /> }, // Treated differently and can be controlled with redirectTo.

  // Public route: top-level default
  { path: "/contact", element: <Contact /> }, // No type specified → public by default

  // Nested routes with inheritance
  {
    path: "/members",
    element: <MembersLayout />,
    type: "private", // Explicitly private
    children: [
      // Inherits private from parent
      { path: "profile", element: <Profile /> }, 

      // Overrides parent: explicitly public
      { path: "join", element: <JoinUs />, type: "public" },

      // Inherits private from parent
      { path: "settings", element: <Settings /> }
    ]
  }
];

/*
Routing behavior:

- / → Different 
- /contact → Public (top-level default)
- /members → Private (explicit)
- /members/profile → Private (inherits from parent)
- /members/join → Public (explicit child override)
- /members/settings → Private (inherits from parent)
*/
```



### Pro Tips 

```jsx
// Want predictable behavior? Always specify the type!
{ path: "/about", element: <About />, type: "public" } // Crystal clear

// Use parent-child type overrides to control nested routes independently:
{
  path: "/private-area",
  type: "private", 
  children: [
    { path: "free-sample", type: "public" } // Public oasis in private desert!
  ]
}

// Control the root (/) route using privateFallback or redirectTo:
{
  path: "/",
  redirectTo: { pathname: "/home", replace: true },
}

<RouteKeeper 
  privateFallback={<LandingPage />} // Displayed for unauthenticated users
/>

```

---

## Contributing

Found a bug or want to add a feature? Contributions are welcome!  

1. 🍴 Fork it  
2. 🌟 Star it (pretty please?)  
3. 🔧 Fix it  
4. 📤 PR it  
5. 🎉 Celebrate!  

Please ensure your code follows the existing style and includes clear commit messages.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## Credits

Built by Isaac Anasonye, designed to simplify and standardize routing in React applications.  

RouteKeeper – Protecting your routes since 2025!



---

<div align="center">

**Made something awesome with RouteKeeper?** 

[⭐ Star on GitHub](https://github.com/Isaacprogi/routekeeper-react) | 
[📢 Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20RouteKeeper!) | 
[💬 Join the Discussion](https://github.com/Isaacprogi/routekeeper-react/discussions) | 
[🔗 Connect on LinkedIn](https://www.linkedin.com/in/isaacanasonye)


</div>