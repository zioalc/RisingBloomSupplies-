# Phase 2 — Shopify Customer Accounts (post-launch plan)

**Status:** Implemented on the headless Next.js storefront.  
**Phase 3** (cross-device wishlist sync) remains out of scope.

This document lists the exact URLs to enter in Shopify **Customer Account API** settings, plus the implementation notes for production.

---

## 1. Confirmed production hostname

**Canonical production host:** `www.riseandbloomsupplies.com`

The custom Next.js storefront is served on **www**. OAuth callback, JavaScript origin, and logout URIs must use the **www** host so session cookies and redirects stay on the same origin as the storefront.

**Do not use** `https://riseandbloom.com`.

---

## 2. Shopify Admin — URLs to enter

Location: **Sales channels → Headless → [storefront] → Customer Account API settings → Application setup**

Use **HTTPS** only. Shopify does not accept `http://localhost` for web callbacks.

### Production (confirmed)

| Setting | Value |
|---|---|
| **Callback URI** | `https://www.riseandbloomsupplies.com/api/auth/callback` |
| **JavaScript origin** | `https://www.riseandbloomsupplies.com` |
| **Logout URI** | `https://www.riseandbloomsupplies.com/en` |
| **Logout URI** | `https://www.riseandbloomsupplies.com/es` |

Optional later (only if we add a dedicated post-logout route):

- `https://www.riseandbloomsupplies.com/api/auth/logout/complete`

### Local development

Shopify requires HTTPS for web callback URLs. Use a tunnel (ngrok, Cloudflare Tunnel, etc.) pointed at your local Next.js port (usually `3000`).

| Setting | Value |
|---|---|
| **Callback URI** | `https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app/api/auth/callback` |
| **JavaScript origin** | `https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app` |
| **Logout URI** | `https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app/en` |
| **Logout URI** | `https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app/es` |

Notes:

- Replace `YOUR-TUNNEL-SUBDOMAIN` with the host your tunnel gives you (free ngrok hosts often change each session).
- Keep the path exactly `/api/auth/callback` (no trailing slash unless Shopify stores it that way).
- You can list **production + tunnel** URLs together in Callback / Logout / Origins.

### What not to enter

- `http://localhost:3000/...`
- `http://127.0.0.1:3000/...`
- Apex-only `https://riseandbloomsupplies.com/...` as the **only** callback/origin if the live storefront is on **www** (cookies will not match)
- `https://riseandbloom.com/...` (wrong domain)

---

## 3. Client type: Public (confirmed)

**Confirmed by merchant (Aug 2026):** Customer Account API client is **Public**.

| Item | Status |
|---|---|
| Client type | **Public** |
| Client ID | Shown in Admin — store in `.env.local` only |
| Client secret | **Not used** — do not create `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET` |

Phase 2 must use **Authorization Code + PKCE** (no client secret / no Basic auth with secret).

Required OAuth scope (when implementing):

```text
openid email customer-account-api:full
```

Also confirm: **Settings → Customer accounts** uses **Customer accounts** (passwordless / OTP).

---

## 4. Environment variables (for Phase 2 later)

**Only in `.env.local` / host secret store — never commit, never `NEXT_PUBLIC_` for secrets:**

```text
# Existing (already used by the storefront)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=

# Phase 2 — Public Customer Account API client
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=
SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL=https://www.riseandbloomsupplies.com/api/auth/callback
AUTH_SECRET=
```

| Variable | Where it comes from | Notes |
|---|---|---|
| `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID` | Shopify Admin → Customer Account API → Client ID | Server-only. Not `NEXT_PUBLIC_`. |
| `SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL` | Must match Admin callback exactly | Prod: `https://www.riseandbloomsupplies.com/api/auth/callback`. Local: your HTTPS tunnel callback URL. |
| `AUTH_SECRET` | You generate (long random string) | Signs/encrypts httpOnly session cookies. Not from Shopify. |

**Do not add:**

- `SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_SECRET` (Public client — no secret)
- Any Customer Account ID/secret under `NEXT_PUBLIC_*`

For local Phase 2 work later, override callback in `.env.local` to the tunnel URI, e.g.:

```text
SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL=https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app/api/auth/callback
```

Do not paste Client ID or `AUTH_SECRET` into chat.

---

## 5. Phase 2 goals (after launch)

Customers can:

1. Keep shopping and checking out as **guests** (current behavior).
2. **Sign in** on the Rise & Bloom site via Shopify email + one-time code.
3. See an **Account** page with basic details and **order history**.
4. **Log out** securely.

Must preserve:

- Guest checkout (cart permalinks)
- Cart / products / search
- Phase 1 favorites (`rising-bloom-wishlist` localStorage) — **no** cross-device sync yet (Phase 3)

---

## 6. Implementation plan (post-launch)

### Step A — Auth foundation
- Discovery endpoints + Authorization Code flow
- PKCE + state validation (required for Public; recommended for Confidential too)
- Routes: `/api/auth/login`, `/api/auth/callback`, `/api/auth/logout`, `/api/auth/session`
- Session: encrypted **httpOnly** cookies only
- EN/ES via authorize `locale` + translated UI

### Step B — Account UI
- Sign In / Account in desktop header and mobile menu
- `/{locale}/account` — profile + orders
- Secure logout

### Step C — Checkout continuity (optional Phase 2b)
- Guests: keep permalink checkout
- Logged-in SSO into checkout needs Storefront Cart API + `cartBuyerIdentityUpdate`

### Step D — QA
- Guest checkout, OTP login, session, logout, favorites unchanged, EN/ES, mobile

### Estimated effort
- Phase 2 (auth + account): ~6–9 days after Admin is confirmed  
- Phase 2b Cart API checkout SSO: +2–4 days  

---

## 7. Security requirements (non-negotiable)

- Never store access/refresh tokens in `localStorage`
- Use secure httpOnly cookies (or server-side session)
- OAuth Authorization Code + PKCE; validate `state`
- No secrets in `NEXT_PUBLIC_*` variables
- Preserve EN/ES, cart, checkout, products, favorites

---

## 8. Quick copy-paste for Shopify (production)

```text
Callback URI:
https://www.riseandbloomsupplies.com/api/auth/callback

JavaScript origin:
https://www.riseandbloomsupplies.com

Logout URIs:
https://www.riseandbloomsupplies.com/en
https://www.riseandbloomsupplies.com/es
```

**Local (replace tunnel host):**

```text
Callback URI:
https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app/api/auth/callback

JavaScript origin:
https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app

Logout URIs:
https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app/en
https://YOUR-TUNNEL-SUBDOMAIN.ngrok-free.app/es
```

---

## 9. Suggested order of work

| When | Action |
|---|---|
| **Now** | Enter **www** production URLs above in Customer Account API settings; confirm Public client; enable Customer accounts |
| **Deploy** | Set matching `SHOPIFY_CUSTOMER_ACCOUNT_CALLBACK_URL` on Vercel |
| **After cutover** | Verify Sign In → OTP → `/{locale}/account` on www |

*Canonical production host: `https://www.riseandbloomsupplies.com`.*
