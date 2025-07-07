# FreshCart Express Frontend

This is a lightweight demo frontend inspired by online grocery apps. It now includes basic auth screens, profile management, product filters, and order tracking alongside the original catalog and checkout pages.

## Getting Started

Open `frontend/auth/login.html` to sign in. A demo account is provided (`user@example.com`/`demo`). After logging in you can browse the catalog via `frontend/index.html`. The page now supports theme switching, language selection (English/Spanish) and a filter sheet with tags. Use the search bar with autocomplete, filters, and sorting to explore items. Ratings and reviews are stored locally. Products now include selectable variants (e.g. 500g, 1kg).

The new `frontend/cart.html` page lets you review items before paying. Items are stored locally and synced to the demo backend. From the cart you can proceed to `frontend/checkout.html` where promo codes and delivery slots can be tested. Order status can be viewed from `frontend/orders.html`. Notifications and offline detection are enabled.

This project remains a minimal prototype and is not production ready but shows how these features could work without a backend.
