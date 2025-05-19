# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

# SpareLK Client

This is the client application for the SpareLK e-commerce platform.

## Loading States and Error Handling

The application uses consistent loading states and error handling throughout the UI. Here's how to use these components:

### Basic Components

#### 1. Skeleton Loading

For placeholder loading states, use the Shadcn UI Skeleton component:

```tsx
import { Skeleton } from "@/components/ui/skeleton";

// Basic usage
<Skeleton className="h-10 w-full" />

// Usage in a card
<div className="space-y-2">
  <Skeleton className="h-5 w-2/3" />
  <Skeleton className="h-4 w-1/2" />
  <Skeleton className="h-32 w-full" />
</div>
```

#### 2. Error Message

For consistent error display:

```tsx
import { ErrorMessage } from "@/components/ui/error-message";

// Basic usage
<ErrorMessage message="Failed to load content" />

// With custom className
<ErrorMessage
  message="An error occurred while processing your request"
  className="mb-4"
/>
```

### Pre-built Loading Skeletons

The application includes pre-built skeletons for common UI patterns:

```tsx
import {
  ProductCardSkeleton,
  ProductGridSkeleton,
  ProductDetailsSkeleton,
  CartItemSkeleton,
  TableRowSkeleton,
  TableSkeleton
} from "@/components/ui/skeletons";

// Show a grid of loading product cards
<ProductGridSkeleton count={6} />

// Show a product details page loading
<ProductDetailsSkeleton />

// Show a loading table with rows
<TableSkeleton rows={5} columns={4} />
```

### Higher-Order Component Approach

For components that need loading and error states, use the `withLoading` HOC:

```tsx
import { withLoading } from "@/components/ui/with-loading";

// Your component
function MyComponent(props) {
  return <div>Content here</div>;
}

// Custom loading component (optional)
function MyLoadingComponent() {
  return <div>Custom loading UI...</div>;
}

// Wrap with HOC
const MyComponentWithLoading = withLoading(MyComponent, MyLoadingComponent);

// Usage
<MyComponentWithLoading
  isLoading={true}
  error="Error message if any"
  retry={() => fetchData()} // Optional retry function
  // ...other props for MyComponent
/>;
```

### Using the Loading State Hook

For managing loading states and errors in functional components:

```tsx
import { useLoadingState } from "@/components/ui/with-loading";

function MyComponent() {
  const {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError,
    clearError,
  } = useLoadingState();

  const fetchData = async () => {
    startLoading();
    try {
      // Fetch data
      stopLoading();
    } catch (err) {
      setLoadingError("Failed to load data");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <div>Content here</div>;
}
```

## Implementation Examples

- See `Cart.tsx` for an example of direct loading state implementation
- See `Store.tsx` for loading states with error handling
- See `ItemCard.tsx` for the HOC approach
- See `Register.tsx` for form loading states
