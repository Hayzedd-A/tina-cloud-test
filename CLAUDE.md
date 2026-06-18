# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install --legacy-peer-deps   # Required due to React 16 + Ant Design compatibility
npm run dev                      # Dev server on http://localhost:7080
npm run build                    # Production build
npm start                        # Run production server (requires build)
```

No test runner is configured. No ESLint config at project root.

## Stack

- **Next.js 12.3.4** + **React 16** (class components throughout — no functional component migration)
- **Ant Design 5** for UI components
- **SCSS/Sass** for styling
- **Axios 0.19.2** for HTTP
- **next-pwa** for service workers
- **Paystack** for payments (with subaccount routing)
- **Strapi CMS** for blog content (separate service)
- **Zupa API** (`https://api.zupa.ng/`) as the primary backend

## Architecture

### State Management: Context + Consumer HOC Pattern

All global state lives in `providers/`. Each provider is a **class component** that exposes:
1. A React Context
2. A `Consumer` HOC that injects context values as props

```javascript
// Pattern used everywhere — do not switch to hooks/useContext
export const CartConsumer = (Cmp) => (props) => (
  <CartContext.Consumer>
    {(val) => <Cmp {...props} {...val} />}
  </CartContext.Consumer>
);
export default CartConsumer(MyComponent);
```

Providers are nested in `pages/_app.js`. The order matters — `StoreProvider` wraps `CartProvider`.

### Providers and Their Responsibilities

| Provider | Key State | Storage |
|---|---|---|
| `AuthenticationProvider` | user object, JWT token | `localStorage['gourmet-twist-user']` |
| `CartProvider` | cart items, checkout flow, order details | `localStorage['gourmettwistcart']` |
| `ProductsProvider` | products array, categories | in-memory |
| `StoreProvider` | store info, kitchen coords, delivery zones | in-memory |
| `OrdersProvider` | order history | in-memory |
| `LoyaltyPointsProvider` | points balance, transactions | in-memory |
| `DashboardProvider` | user profile stats | in-memory |

### API Layer (`api/index.js`)

All HTTP calls go through these helpers, which attach the JWT `Authorization: Bearer` header:

```javascript
getRequest({ url, params, token })
postRequest({ url, data, token })
patchRequest({ url, data, token })
deleteRequest({ url, data, token })
zupaGetRequest({ url, params, token })  // raw GET without auth header
```

### Page Routing

Standard Next.js file-based routing under `pages/`. All pages use the `Main` layout wrapper (`layouts/Main.js`) which includes the `Header`. Blog pages use dynamic routing (`pages/blog/[id].js`) and fetch from Strapi.

### Special Business Logic

**Valentine's Day restriction** (`constants/index.js`): On Feb 14, `isNoDiscountDate()` returns true — delivery discount is set to ₦0 and only "Valentine Gift Boxes" are purchasable. The allowed product list is cached in `localStorage['gourmet-14-allowed']`.

**Delivery fees**: Calculated via Chowdeck API using distance from hardcoded Lagos kitchen coordinates (`6.601838, 3.3514863`). Free delivery threshold is ₦25,000; standard discount is ₦3,000.

**Coupon system**: Validated via `POST /coupon/validate` before checkout; discount applied to `CartProvider` state.

**Loyalty points**: Can be applied as partial payment at checkout; deducted server-side on order confirmation.

## Environment Variables

All prefixed with `NEXT_PUBLIC_` (browser-exposed):

```
NEXT_PUBLIC_GOOGLE_ANALYTICS       # GA measurement ID
NEXT_PUBLIC_STRAPI_URL             # Strapi CMS base URL
NEXT_PUBLIC_STRAPI_TOKEN           # Strapi API auth token
NEXT_PUBLIC_DISTANCE_MATRIX_API_KEY
NEXT_PUBLIC_ENV                    # "dev" or "production"
```

## Deployment

GitHub Actions (`.github/workflows/main.yaml`) triggers on push to `main`: builds a Docker image from `Dockerfile` (Node 16 Alpine) and pushes to GCP Container Registry for Cloud Run deployment.
