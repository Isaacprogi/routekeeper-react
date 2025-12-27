---
sidebar: false
---

# RouteKeeper - Your React Route Guardian

> *The superhero your React app deserves!*

**RouteKeeper** is a routing utility for React applications. It intelligently manages access, ensuring users reach the right pages at the right time. Whether you're building a large-scale application or a simple dashboard, RouteKeeper simplifies route management and enforces access control.


---

## What Makes RouteKeeper Special?

"Think of RouteKeeper as your app’s **intelligent routing system**—ensuring users always reach the right pages efficiently."

## Key Features

- **Smart `/` Route**: Displays a landing page for visitors and a dashboard for authenticated users.
- **Secure Private Routes**: Ensures that private routes remain inaccessible to unauthorized users.
- **Role-Based Access Control**: Restrict certain routes to specific roles automatically, such as admin-only sections.
- **Intelligent Public Routes**: Redirects logged-in users away from pages like login or signup to improve user experience.
- **Nested Route Support**: Handles complex route hierarchies, allowing routes within routes.
- **Built-in Error Handling**: Provides fallback components for errors and unauthorized access.


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

const userIsLoggedIn = true; // Replace with your auth logic

const routes = [
  { path: "/", element: <Home />, type: "private" },
  { path: "/login", element: <Login />, type: "public" }
];

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
 
 ---

## RouteKeeper Props Reference

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `routes` | `RouteConfig[]` | `[]` | Array of route definitions. |
| `auth` | `boolean` | `false` | Authentication state of the current user. |
| `userRoles` | `string[]` | `[]` | List of roles assigned to the current user. |
| `loading` | `boolean` | `false` | Global loading state, e.g., while authenticating. |
| `loadingScreen` | `React.ReactNode` | `<LoadingScreen />` | Custom component to display while loading. |
| `privateRedirect` | `string` | `"/"` | Path to redirect unauthenticated users attempting to access private routes. |
| `publicRedirect` | `string` | `/login` | Path to redirect authenticated users visiting public routes. |
| `privateFallback` | `React.ReactNode` | `<LandingFallback />` | Fallback UI for private routes when access is restricted.This is your landing page slot |
| `unAuthorized` | `React.ReactNode` | `<Unauthorized />` | UI displayed when user lacks permission for a route. |
| `notFound` | `React.ReactNode` | `<NotFound />` | UI displayed for non-existent routes. |


## Individual Route Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | `undefined` | The URL path for this route. Required for normal routes; not used for index routes. |
| `index` | `boolean` | `false` | Marks the route as an index route (renders at the parent path). |
| `element` | `React.ReactNode` | `undefined` | The React component to render when this route is matched. |
| `type` | `"public" \| "private" \| "neutral"` | `"public"` | Defines the access type for the route: public, private, or neutral. |
| `children` | `RouteConfig[]` | `[]` | Nested routes under this route for multi-level hierarchies. |
| `roles` | `string[]` | `[]` | Optional roles allowed to access this route. If omitted, all authenticated users can access. |
| `caseSensitive` | `boolean` | `false` | Whether the route matching should be case-sensitive. |
| `excludeParentRole` | `boolean` | `false` | If `true`, this route will not inherit allowed roles from its parent route. |



## Real-World Example

### Advanced Usage with Nested Routes and Role-Based Access

```tsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RouteKeeper, type RouteConfig } from "routekeeper-react";
import { AuthProvider, useAuth } from "./auth";

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
const routes: RouteConfig[] = [
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
];

// Component that wraps RouteKeeper with authentication state
const AppContent = () => {
  const { accessToken, loading, userRoles } = useAuth();

  return (
    <RouteKeeper
      routes={routes}             // Pass the route definitions
      auth={accessToken}          // Current user authentication state
      loading={loading}           // Show loader while auth state is initializing
      loadingScreen={<SpinnyThing />} // Custom loader component
      publicRedirect="/"          // Redirect authenticated users from public pages
      privateFallback={<WelcomePage />} // Fallback UI for private routes
      notFound={<OopsPage />}     // UI for unmatched routes
      userRoles={userRoles}       // Current user's roles
      unAuthorized={<AccessDenied />} // UI for unauthorized access
    />
  );
};

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

## The Magic of the `/` Route

This is where RouteKeeper really shines! 

| User Status | What They See at `/` | Why It's Awesome |
|-------------|---------------------|------------------|
|  Not logged in | Landing page (`privateFallback`) | Perfect first impression |
|  Logged in | Home dashboard (`element`) | Straight to the action |

### Behind the Scenes

```
🌐 User visits "/"
       │
       ▼
🤔 "Are you logged in?"
       │
   ┌───┴───┐
   │       │
✅ YES    ❌ NO
   │       │
   ▼       ▼
🏠 Show   🚀 Show
   Home      Landing
   Page      Page
```

---

## Avoiding Redirect Loops

When configuring routes, it is important to avoid situations that can cause infinite redirects.  

**Incorrect Approach (Causes Redirect Loop):**

```tsx
// This configuration can create an infinite loop
{
  path: "/",
  element: <Navigate to="/home" replace />, // Redirecting to another route immediately
  type: "private"
}
```

**Correct Approach:**
```tsx
// Let RouteKeeper handle routing without causing loops
{
  path: "/",
  element: <HomePage />, // Render the component directly
  type: "private"
}
```


### Why This Approach Works

1. **Unauthenticated user visits `/`** → The `privateFallback` component (landing page) is displayed.  
2. **Authenticated user visits `/`** → The route's `element` (home page) is rendered.  
3. **Authenticated user visits `/login`** → Automatically redirected to `/` and sees the home page.  
4. **Result:** Routing works predictably with no redirect loops or unexpected behavior.


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

** Child routes (have parents):** Inherit from **daddy/mommy**
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

**Plot Twist #2:** The `/` route is **ALWAYS treated as private**, no matter what you tell it! 

```jsx
// You can try to make it public, but RouteKeeper says "Nah!"
{ path: "/", element: <Home />, type: "public" } // Still becomes private!

//  It's like trying to make the front door of your house public
// RouteKeeper: "Nice try, but that's staying private!" 
```

**Why?** Because `/` is special - it's your app's identity! RouteKeeper protects it like a mama bear protects her cubs 

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
    // Result: /dashboard/public-info is accessible to everyone!
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
│ 3️⃣ Path is "/"? → ALWAYS PRIVATE           │  
│ 4️⃣ Child explicitly overrides? → CHILD WINS │
│ 5️⃣ Everything else? → FOLLOW THE TYPE       │
└─────────────────────────────────────────────┘
```

### Real-World Route Example

```tsx
const routesExample = [
  // Private route: root path
  { path: "/", element: <Home /> }, // Top-level private route

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

- / → Private (top-level root)
- /contact → Public (top-level default)
- /members → Private (explicit)
- /members/profile → Private (inherits from parent)
- /members/join → Public (explicit child override)
- /members/settings → Private (inherits from parent)
*/


### Pro Tips for the Brave

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

// Control the root (/) route using privateFallback:
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


## 📜 License

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