# FreshCart Express Frontend

This is a lightweight demo frontend inspired by online grocery apps. It now includes basic auth screens, profile management, product filters, and order tracking alongside the original catalog and checkout pages.

## Getting Started

Open `frontend/auth/login.html` to sign in. A demo account is provided (`user@example.com`/`demo`). After logging in you can browse the catalog via `frontend/index.html`. The page now supports theme switching, language selection (English/Spanish) and a filter sheet with tags. Use the search bar with autocomplete, filters, and sorting to explore items. Ratings and reviews are stored locally. Products now include selectable variants (e.g. 500g, 1kg).

Checkout is available through `frontend/checkout.html` where promo codes and delivery slots can be tested. Order status can be viewed from `frontend/orders.html`. Notifications and offline detection are enabled.

This project remains a minimal prototype and is not production ready but shows how these features could work without a backend.

## Payment Integration

There is currently no live payment gateway. For a real deployment you may wish to
integrate a provider like Razorpay or Stripe in test mode. The checkout page
includes a simple Cash on Delivery option so orders can be placed in this MVP
without collecting payment details.
