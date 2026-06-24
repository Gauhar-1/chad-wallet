# ChadWallet — Architecture Document

> **Version:** 1.0 | **Last Updated:** June 2026 | **Status:** Phase 1 Complete

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [System Architecture Diagram](#system-architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [State Management & Caching Strategy](#state-management--caching-strategy)
6. [Security Posture](#security-posture)
7. [Observability Strategy](#observability-strategy)
8. [Infrastructure Topology](#infrastructure-topology)
9. [Trade-offs & Architectural Decisions](#trade-offs--architectural-decisions)

---

## System Overview

ChadWallet is a premium Solana trading web application featuring:

- **Landing Page** — Minimalist, high-FOMO design with animated gradients, feature showcase, and app download CTAs
- **Token Banners** — Two infinite-scroll marquee tickers displaying live Solana token prices
- **Trading Interface** — Three-panel layout with trending tokens, TradingView charts, and Jupiter-powered swaps
- **Authentication** — Seamless Apple/Google/email login via Privy with auto-provisioned embedded wallets

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐   │
│  │ Landing Page │  │ Token Banners│  │     Trading UI           │   │
│  │ (Server Comp)│  │ (Client Comp)│  │ ┌────────┬──────┬──────┐ │   │
│  └──────────────┘  └──────────────┘  │ │Trending│Chart │Swap  │ │   │
│                                      │ │List    │+Data │Panel │ │   │
│  ┌────────────────────────────────┐  │ └────────┴──────┴──────┘ │   │
│  │     Provider Tree              │  └──────────────────────────┘   │
│  │ QueryClient → Privy → App      │                                 │
│  └────────────────────────────────┘                                 │
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                  React Query Cache Layer                       │ │
│  │  trending(60s) │ prices(15s) │ ohlcv(30s) │ trades(10s)        │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │   NEXT.JS API      │
                    │   ROUTE LAYER      │
                    │                    │
                    │ /api/tokens/*      │
                    │ /api/swap/*        │
                    │ /api/health        │
                    │                    │
                    │ ┌────────────────┐ │
                    │ │ Zod Validation │ │
                    │ │ XSS Sanitize   │ │
                    │ │ CSRF Check     │ │
                    │ │ Cache Headers  │ │
                    │ └────────────────┘ │
                    └─────────┬──────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
   ┌────────▼────────┐ ┌──────▼─────┐  ┌────────▼─────────┐
   │  Codex GraphQL  │ │ Jupiter    │  │   Alchemy RPC    │
   │  API            │ │ Swap API   │  │                  │
   │ • Trending      │ │ v1         │  │ • Token Balances │
   │ • Prices        │ │            │  │ • Send TX        │
   │ • OHLCV         │ │ • Quote    │  │ • Confirm TX     │
   │ • Trades        │ │ • Swap     │  │                  │
   └─────────────────┘ └────────────┘  └──────────────────┘
                                               │
                                      ┌────────▼────────┐
                                      │  Solana Network │
                                      │  (Mainnet)      │
                                      └─────────────────┘

   ┌──────────────────┐   ┌───────────────────┐
   │   Supabase       │   │    Sentry         │
   │                  │   │                   │
   │ • User Profiles  │   │ • Error Tracking  │
   │ • Watchlists     │   │ • Performance     │
   │ • RLS Policies   │   │ • Session Replay  │
   └──────────────────┘   └───────────────────┘
```

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 (App Router) | SSR, ISR, API routes, image optimization |
| **Language** | TypeScript | Type safety across the entire codebase |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with custom design tokens |
| **State** | React Query v5 | Server-state caching, refetching, deduplication |
| **Auth** | Privy | Apple/Google OAuth + embedded Solana wallets |
| **Blockchain** | Solana (via Alchemy RPC) | On-chain reads, transaction submission |
| **Market Data** | Codex GraphQL API | Prices, trending, OHLCV, trades |
| **Swaps** | Jupiter Swap API v1 | Route aggregation, swap transaction building |
| **Charts** | TradingView Lightweight Charts v5 | Candlestick charts with crosshair |
| **Database** | Supabase (PostgreSQL) | User profiles, watchlists, with RLS |
| **Hosting** | Vercel | Edge deployment, caching, image CDN |
| **DNS/DDoS** | Cloudflare | DNS proxy, DDoS protection, WAF |
| **Observability** | Sentry | Error tracking, performance monitoring |

---

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # Server-side API proxies (Codex, Jupiter)
│   ├── trade/              # Trading UI pages
│   └── (pages)             # Landing, error, 404
├── components/
│   ├── ui/                 # Atomic UI primitives (Button, Card, Input, etc.)
│   ├── common/             # Shared business components (TokenBanner, TokenIcon)
│   └── layout/             # Header, Footer, MobileNav
├── features/               # Feature-scoped component modules
│   ├── landing/            # Hero, Features, Download, SocialProof
│   ├── auth/               # AuthButton, AuthGuard, UserAvatar
│   ├── trading/            # Chart, Swap, TopHolders, RecentTrades
│   └── banners/            # Top/Bottom marquee banners
├── hooks/                  # Custom React Query hooks
├── services/               # Server-side API clients (Codex, Jupiter, Alchemy)
├── lib/                    # Utilities, validators, security helpers
├── providers/              # React context providers (Query, Privy)
├── types/                  # TypeScript type definitions
└── config/                 # App configuration (site, chains)
```

**Design Principle:** Feature-based organization. Each feature directory (`features/`) is self-contained with its own components. Shared UI primitives live in `components/ui/`. Data-fetching hooks are centralized in `hooks/` for cross-feature reuse.

---

## State Management & Caching Strategy

### React Query as the State Layer

We use **React Query (TanStack Query v5)** as the exclusive client-side data layer. There is **no Redux, Zustand, or Context-based global state** — all server-state is managed through React Query's cache.

### Why React Query?

1. **Automatic deduplication** — Multiple components requesting the same data result in a single network request
2. **Smart refetching** — Stale data is served instantly while fresh data loads in the background
3. **Cache-first architecture** — Queries return cached data immediately, then revalidate
4. **Minimal re-renders** — Only components subscribing to changed data re-render

### Caching Configuration

| Data Type | Query Key | Stale Time | Refetch Interval | Cache Strategy |
|-----------|-----------|-----------|------------------|----------------|
| Trending Tokens | `['trending-tokens']` | 60s | 60s | Edge: `s-maxage=60` |
| Token Price | `['token-price', address]` | 15s | 15s | Edge: `s-maxage=15` |
| Token Info | `['token-info', address]` | 5min | — | Edge: `s-maxage=300` |
| Top Holders | `['top-holders', address]` | 2min | 2min | Edge: `s-maxage=120` |
| Recent Trades | `['recent-trades', address]` | 10s | 15s | Edge: `s-maxage=10` |
| OHLCV Chart | `['ohlcv', address, tf]` | 30s | 30s | Edge: `s-maxage=30` |
| Swap Quote | `['swap-quote', params]` | 0 (never) | — | `no-store` |
| User Positions | `['user-positions', wallet]` | 30s | 30s | — |

### Two-Tier Caching

```
Request → React Query Cache (client-side, in-memory)
               ↓ (if stale)
          Next.js API Route
               ↓ (if not cached at edge)
          Vercel Edge Cache (s-maxage headers)
               ↓ (if expired)
          External API (Codex GraphQL / Jupiter)
```

### Codex GraphQL API Migration

We have migrated from BirdEye to the Codex GraphQL API. Our caching strategy ensures:

- **Trending tokens**: Cached 60s at edge + 60s client
- **Token data**: Aggressive stale-while-revalidate prevents redundant calls
- **Multi-tab deduplication**: React Query deduplicates across components

---

## Security Posture

### 1. XSS Prevention

- **Input validation**: All API inputs validated with **Zod schemas** before processing
- **Output sanitization**: Custom `sanitizeText()` utility escapes HTML entities in all API responses
- **React's default escaping**: JSX automatically escapes rendered values
- **CSP headers**: Content-Security-Policy configured in `next.config.ts`

### 2. CSRF Protection

- **Token generation**: Cryptographic random tokens via Web Crypto API
- **Cookie storage**: CSRF token stored in HTTP-only, SameSite=Strict cookie
- **Header validation**: State-mutating routes (POST `/api/swap/execute`) require `x-csrf-token` header
- **Constant-time comparison**: Token validation uses constant-time string comparison to prevent timing attacks

### 3. API Key Protection

- **Server-side only**: Codex and Jupiter API keys are stored in `process.env` (not `NEXT_PUBLIC_`)
- **Proxy pattern**: All client requests go through Next.js API routes that inject API keys server-side
- **Never exposed**: No API keys reach the browser

### 4. Security Headers

```
X-Frame-Options: DENY                              — Prevents clickjacking
X-Content-Type-Options: nosniff                    — Prevents MIME sniffing
Referrer-Policy: strict-origin-when-cross-origin   — Controls referrer leakage
Permissions-Policy: camera=(), microphone=()       — Disables unused browser APIs
```

### 5. Cloudflare + Vercel Synergy

```
Internet → Cloudflare (DNS Proxy)
              ├── DDoS Protection (L3/L4/L7)
              ├── WAF Rules (OWASP Top 10)
              ├── Rate Limiting (per-IP)
              ├── Bot Management
              └── Edge Caching (static assets)
                     ↓
              Vercel Edge Network
              ├── Edge Functions (API routes)
              ├── Image Optimization CDN
              ├── Incremental Static Regeneration
              └── Automatic HTTPS
```

### 6. Supabase Row-Level Security (RLS)

```sql
-- Users can only read/write their own profile
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid()::text = privy_id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid()::text = privy_id);

-- Users can only manage their own watchlist
CREATE POLICY "Users manage own watchlist"
  ON watchlist FOR ALL
  USING (auth.uid()::text = user_id);
```

---

## Observability Strategy

### Sentry Integration

Sentry is initialized across **three runtimes** for comprehensive coverage:

| Runtime | Config File | Monitors |
|---------|-------------|----------|
| **Browser** | `sentry.client.config.ts` | UI errors, unhandled rejections, performance |
| **Server** | `sentry.server.config.ts` | API route errors, SSR failures |
| **Edge** | `sentry.edge.config.ts` | Middleware errors, edge API routes |

### Configuration

- **Trace sample rate**: 10% in production (100% in development)
- **Session replay**: 5% normal sessions, 100% error sessions
- **Source maps**: Uploaded to Sentry, hidden from public (`hideSourceMaps: true`)
- **Error filtering**: Common noise (ResizeObserver, ChunkLoad) is suppressed

### Performance Monitoring

Key metrics tracked:
- **Web Vitals**: LCP, FID, CLS via Sentry's automatic instrumentation
- **API route latency**: Traced via `withSentryConfig` auto-instrumentation
- **React component render time**: Custom spans for chart and swap form

### Alerting Rules (Recommended Setup in Sentry Dashboard)

| Alert | Condition | Action |
|-------|-----------|--------|
| Error spike | >10 errors in 5 min | Slack notification |
| API failure rate | >5% of requests failing | PagerDuty escalation |
| LCP degradation | P95 LCP > 3s | Slack notification |
| Swap failures | Any swap execution error | Immediate alert |

---

## Infrastructure Topology

```text
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│  Cloudflare   │───▶│   Vercel      │────▶│  Supabase     │
│               │     │               │     │               │
│ • DNS Proxy   │     │ • Next.js App │     │ • PostgreSQL  │
│ • DDoS Shield │     │ • Edge Cache  │     │ • RLS Policies│
│ • WAF Rules   │     │ • Image CDN   │     │ • REST API    │
│ • Rate Limits │     │ • Serverless  │     │               │
└───────────────┘     └───────┬───────┘     └───────────────┘
                              │
              ┌───────────────┼──────────────┐
              │               │              │
      ┌───────▼──────┐ ┌──────▼────┐ ┌──────▼──────┐
      │  Codex API   │ │ Jupiter   │ │ Alchemy RPC │
      │ (Market Data)│ │(Swaps)    │ │ (Solana)    │
      └──────────────┘ └───────────┘ └─────────────┘
```

---

## Deployment Configuration

### 1. Vercel Configuration (`vercel.json`)
The application uses a `vercel.json` file to explicitly define regions and strictly enforce edge security headers.
Deploying to `iad1` (Washington, D.C.) is recommended as it sits in close proximity to major RPC providers.

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ]
}
```

### 2. Cloudflare DNS Proxy Setup
To properly secure the Vercel deployment with Cloudflare's WAF and DDoS protection without running into redirect loops, configure the following:

1. **SSL/TLS Encryption Mode**: Set to **Full (strict)**. This ensures traffic between Cloudflare and Vercel is encrypted.
2. **DNS Records**: Add your CNAME/A records pointing to Vercel (e.g. `cname.vercel-dns.com`) and ensure the Cloudflare Proxy Status is **Proxied (Orange Cloud)**.
3. **Bot Fight Mode**: Enable under `Security -> Bots`.
4. **WAF Rules**: Enable the standard OWASP managed ruleset.
5. **Page Rules (Optional)**: Set a Page Rule for `/api/*` to bypass Cloudflare caching if you want Vercel's Edge network to exclusively manage stale-while-revalidate for the APIs.

---

## Trade-offs & Architectural Decisions

### 1. Server-Side API Proxies vs. Direct Client Calls

**Decision:** All external API calls go through Next.js API routes.

**Trade-off:**
- ✅ API keys never reach the browser
- ✅ Edge caching via `Cache-Control` headers reduces API quota usage
- ✅ Centralized error handling and validation
- ❌ Additional latency (one extra hop through Vercel)
- ❌ Vercel serverless cold starts (mitigated by edge caching)

### 2. React Query Only (No Client-Side Global State)

**Decision:** No Redux/Zustand. All state is server-state managed by React Query.

**Trade-off:**
- ✅ Dramatically simpler architecture
- ✅ Automatic cache invalidation and refetching
- ✅ Zero boilerplate for data fetching
- ❌ Complex local UI state (e.g., multi-step forms) requires `useState` composition
- ❌ No time-travel debugging (React Query DevTools provides cache inspection instead)

### 3. Privy over Custom Auth

**Decision:** Use Privy SDK instead of building custom OAuth + wallet abstraction.

**Trade-off:**
- ✅ Apple/Google login in minutes, not weeks
- ✅ Embedded wallet provisioning handled automatically
- ✅ MPC key management (non-custodial) without building it ourselves
- ❌ Vendor dependency on Privy infrastructure
- ❌ Monthly cost scales with active users
- ❌ Limited customization of auth UI (constrained to Privy's modal)

### 4. Codex GraphQL

**Decision:** We use Codex GraphQL API for all token, market, and chart data, moving away from BirdEye due to rate limits.

**Trade-off:**
- ✅ Scalable GraphQL endpoint without the strict 1 RPS limits of the free tier
- ✅ Single endpoint (`https://graph.codex.io/graphql`) for all queries
- ❌ Requires mapping GraphQL queries instead of simple REST endpoints

**Mitigation:** Edge caching via Vercel headers + React Query stale-while-revalidate pattern.

### 5. TradingView Lightweight Charts vs. Full TradingView Widget

**Decision:** Use the open-source Lightweight Charts library, not the embedded TradingView widget.

**Trade-off:**
- ✅ Full control over styling and behavior
- ✅ No third-party iframe or SDK dependency
- ✅ Smaller bundle size (~45KB vs. ~2MB)
- ❌ No built-in drawing tools or indicators
- ❌ Must build custom crosshair, tooltip, and overlay features
- ❌ Data normalization required (Codex OHLCV → TradingView format)

### 6. Tailwind CSS v4 over v3

**Decision:** Use the latest Tailwind v4 with the new `@import "tailwindcss"` syntax.

**Trade-off:**
- ✅ Better performance (Rust-based compiler)
- ✅ Simplified configuration (no `tailwind.config.ts` needed for basics)
- ❌ Ecosystem plugins may not all be compatible yet
- ❌ Different configuration syntax from v3 documentation

---

*This document is designed to be pasted directly into Notion. All sections use standard Markdown formatting compatible with Notion's import feature.*
