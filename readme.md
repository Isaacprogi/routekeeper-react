=# 🛡️ RouteKeeper - Your React Route Guardian

> *The superhero your React app deserves! 🦸‍♂️*

**RouteKeeper** is like having a smart bouncer for your React app 🕺 - it knows exactly who should go where, when, and why! Whether you're building the next Facebook 📘 or a simple dashboard, RouteKeeper handles your routing drama so you don't have to.

---

## ✨ What Makes RouteKeeper Special?

Think of RouteKeeper as your app's **GPS with superpowers** 🗺️✨:

- 🏠 **Smart `/` Route**: Works like Facebook's homepage - shows landing page for visitors, home dashboard for users
- 🔐 **Fort Knox Security**: Private routes that actually stay private
- 👑 **Role-Based Magic**: "Only admins beyond this point!" - but automated
- 🚪 **Public Route Smarts**: Redirects logged-in users away from login pages (because that's just awkward)
- 🪆 **Nested Route Support**: Routes inside routes inside routes - inception style!
- 🛡️ **Built-in Error Handling**: Because even superheroes need backup plans

---

## 🚀 Quick Start

### Installation

```bash
# Using npm (the classic)
npm install routekeeper-react

# Using yarn (the hipster choice)
yarn add routekeeper-react

# Using pnpm (the speed demon)
pnpm add routekeeper-react
```

### 30-Second Setup ⏰
Ensure it is used with BrowserRouter from 'react-router-dom'

```jsx
import { RouteKeeper } from "routekeeper-react";

// Define your routes like a boss 😎
const routes = [
  { path: "/", element: <Home />, type: "private" },
  { path: "/login", element: <Login />, type: "public" }
];

// Let RouteKeeper do the heavy lifting
<RouteKeeper
  routes={routes}
  accessToken={userIsLoggedIn}
  privateFallback={<LandingPage />}
/>
```

---

## 📊 Props Reference

| Prop | Type | Default | What It Does 🤔 |
|------|------|---------|------------------|
| `routes` | `RouteConfig[]` | `[]` | Your route map 🗺️ |
| `accessToken` | `string \| boolean` | `undefined` | "Are you logged in?" detector 🕵️ |
| `userRoles` | `string[]` | `[]` | User's superpowers list 👑 |
| `loading` | `boolean` | `false` | Show spinning wheels of patience ⏳ |
| `loadingScreen` | `React.ReactNode` | `<LoadingScreen />` | Your custom "please wait" screen 🎭 |
| `publicRedirect` | `string` | `"/"` | Where to send logged-in users who visit public pages 🏃‍♂️ |
| `privateFallback` | `React.ReactNode` | `<LandingFallback />` | "You shall not pass!" page 🧙‍♂️ |
| `unAuthorized` | `React.ReactNode` | `<Unauthorized />` | "Wrong role, buddy!" page 🚫 |
| `notFound` | `React.ReactNode` | `<NotFound />` | "This page went on vacation" 🏖️ |

---

## 🎯 Real-World Example

Let's build something that would make Mark Zuckerberg proud! 📘

```jsx
import { BrowserRouter as Router } from "react-router-dom";
import { RouteKeeper, type RouteConfig } from "routekeeper-react";

// 🏗️ Building our route empire
const routes: RouteConfig[] = [
  // 🚪 Public routes - everyone welcome!
  { path: "/login", element: <Login />, type: "public" },
  { path: "/signup", element: <SignUp />, type: "public" },
  
  // 🏠 The magic home route
  { path: "/", element: <Home />, type: "private" },
  
  // 👑 VIP section - admins only!
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    type: "private",
    roles: ["admin"],
    children: [
      // 📊 Default dashboard view
      { index: true, path: '/', element: <Overview />, type: "private" },
      
      // 📈 Special analytics for editors (but not other admins)
      { 
        path: "analytics", 
        element: <Analytics />, 
        type: "private", 
        roles: ["editor"], 
        excludeParentRole: true 
      },
      
      // ⚙️ Settings for all dashboard users
      { path: "settings", element: <Settings />, type: "private" },
    ],
  },
];

const AppContent = () => {
  const { accessToken, loading, userRoles } = useAuth();

  return (
    <RouteKeeper
      routes={routes}
      accessToken={accessToken}
      loading={loading}
      loadingScreen={<SpinnyThing />} // Your custom loader
      publicRedirect="/"
      privateFallback={<WelcomePage />} // Your landing page
      notFound={<OopsPage />}
      userRoles={userRoles}
      unAuthorized={<AccessDenied />}
    />
  );
};

// 🎪 The grand finale
const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
```

---

## 🏠 The Magic of the `/` Route

This is where RouteKeeper really shines! ✨

| User Status | What They See at `/` | Why It's Awesome |
|-------------|---------------------|------------------|
| 😴 Not logged in | Landing page (`privateFallback`) | Perfect first impression |
| 😎 Logged in | Home dashboard (`element`) | Straight to the action |

### 🎭 Behind the Scenes

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

## ⚠️ Avoiding the Dreaded Redirect Loop

**The Nightmare Scenario:** 😱

```jsx
// ❌ DON'T DO THIS - You'll create an infinite loop!
{
  path: "/",
  element: <Navigate to="/home" replace />, // 🔄 Loop of doom!
  type: "private"
}
```

**The Hero's Journey:** 🦸‍♂️

```jsx
// ✅ DO THIS - Let RouteKeeper handle the magic
{
  path: "/",
  element: <HomePage />, // 🎯 Direct to component
  type: "private"
}
```

### 🔍 Why This Works

1. **Logged-out user visits `/`** → Gets `privateFallback` (landing page) ✅
2. **Logged-in user visits `/`** → Gets `element` (home page) ✅  
3. **Logged-in user visits `/login`** → Redirects to `/` → Gets home page ✅
4. **No loops, no tears, no debugging at 3 AM!** 🎉

---

## 🎨 Advanced Patterns

### 🚦 Role-Based Route Hierarchy

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

### 🎪 Custom Loading Experience

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

## 🎭 RouteKeeper's Secret Rules (The Plot Twists!)

### 🕵️ The Case of the Missing Type

**Plot Twist #1:** Routes without a `type` have split personalities! 

**🌍 Top-level routes (no parents):** Default to **public**
```jsx
// 🤫 This route is secretly public
{ path: "/about", element: <About /> } // No type? Public it is!

// 🔍 Same as writing:
{ path: "/about", element: <About />, type: "public" }
```

**👶 Child routes (have parents):** Inherit from **daddy/mommy**
```jsx
{
  path: "/members",
  type: "private", // Parent is private
  children: [
    // 🧬 This child inherits "private" from parent
    { path: "profile", element: <Profile /> }, // No type = inherits private!
    
    // 🔍 Same as writing:
    { path: "profile", element: <Profile />, type: "private" }
  ]
}
```

### 🏠 The Sacred `/` Route Exception  

**Plot Twist #2:** The `/` route is **ALWAYS treated as private**, no matter what you tell it! 

```jsx
// 😅 You can try to make it public, but RouteKeeper says "Nah!"
{ path: "/", element: <Home />, type: "public" } // Still becomes private!

// 🎭 It's like trying to make the front door of your house public
// RouteKeeper: "Nice try, but that's staying private!" 🛡️
```

**Why?** Because `/` is special - it's your app's identity! RouteKeeper protects it like a mama bear protects her cubs 🐻

### 🎪 The Great Parent-Child Role Reversal

**Plot Twist #3:** When a private parent has public children, the kids win! 

```jsx
// 🤯 Mind-bending example
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
    // 🎉 Result: /dashboard/public-info is accessible to everyone!
  ]
}
```

**The Family Drama:** 👨‍👩‍👧‍👦
- **Parent Route:** "You need to be logged in to access my children!"
- **Child Route:** "Actually dad, I'm public now!" 
- **RouteKeeper:** "Kids these days... 🤷‍♂️ Child wins!"

### 🧪 RouteKeeper's Logic Laboratory

```
📝 The Rule Book:
┌─────────────────────────────────────────────┐
│ 1️⃣ Top-level, no type? → PUBLIC             │
│ 2️⃣ Child route, no type? → INHERIT PARENT   │
│ 3️⃣ Path is "/"? → ALWAYS PRIVATE           │  
│ 4️⃣ Child explicitly overrides? → CHILD WINS │
│ 5️⃣ Everything else? → FOLLOW THE TYPE       │
└─────────────────────────────────────────────┘
```

### 🎢 Real-World Rollercoaster Example

```jsx
const confusingButAwesomeRoutes = [
  // 🏠 This is private (RouteKeeper's rule!)
  { path: "/", element: <Home /> }, // No type, but still private!
  
  // 🌍 This is public (top-level default)
  { path: "/contact", element: <Contact /> }, // No type = public for top-level
  
  // 🎭 The inheritance family
  {
    path: "/members", 
    element: <MembersLayout />,
    type: "private", // "Members only!"
    children: [
      // 🧬 This inherits "private" from parent
      { path: "profile", element: <Profile /> }, // No type = inherits private
      
      // 🚪 This rebels and goes public (explicit override)
      { path: "join", element: <JoinUs />, type: "public" },
      
      // 🔒 This also inherits private (no type specified)
      { path: "settings", element: <Settings /> } // No type = inherits private
    ]
  }
];

/*
🎯 What actually happens:
- / → Private (RouteKeeper's sacred rule)
- /contact → Public (top-level defaults to public)  
- /members → Private (explicit)
- /members/profile → Private (inherits from parent)
- /members/join → Public (explicit child rebellion!) 
- /members/settings → Private (inherits from parent)
*/
```

### 💡 Pro Tips for the Brave

```jsx
// ✅ Want predictable behavior? Always specify the type!
{ path: "/about", element: <About />, type: "public" } // Crystal clear

// 🎪 Want to blow minds? Use the parent-child override
{
  path: "/private-area",
  type: "private", 
  children: [
    { path: "free-sample", type: "public" } // Public oasis in private desert!
  ]
}

// 🏠 Want to control the "/" route? Use privateFallback!
<RouteKeeper 
  privateFallback={<LandingPage />} // This shows when user isn't logged in
/>
```

---

## 🤝 Contributing

Found a bug? 🐛 Want to add a feature? 💡 We love contributors!

1. 🍴 Fork it
2. 🌟 Star it (pretty please?)  
3. 🔧 Fix it
4. 📤 PR it
5. 🎉 Celebrate!

---

## 📜 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

Built with ❤️ by Isaac Anasonye, who got tired of rewriting the same routing logic repeatedly.

RouteKeeper – Protecting your routes since 2025! 🛡️


---

<div align="center">

**Made something awesome with RouteKeeper?** 

[⭐ Star on GitHub](https://github.com/Isaacprogi/routekeeper-react) | 
[📢 Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20RouteKeeper!) | 
[💬 Join the Discussion](https://github.com/Isaacprogi/routekeeper-react/discussions) | 
[🔗 Connect on LinkedIn](https://www.linkedin.com/in/isaacanasonye)


</div>