# Connect your home page to the bag, favorites and sign-in

1. In `<head>`, after your own stylesheets:
   `<link rel="stylesheet" href="tawa-pages/css/store.css">`
2. Before `</body>`:
   `<script type="module" src="tawa-pages/js/pages.js"></script>`
3. On `<body>`, add `data-nav="own"` so pages.js leaves your navbar.js alone.
4. Your navbar needs the classes `.navbar`, `.navbar__menu` and `.navbar__toggle`.
   pages.js inserts the heart, Bag and Sign in buttons just before `.navbar__toggle`.
5. Point your "Shop Now" buttons at `shop.html` and remove services-pin cards' dead links.
6. Adjust the path (`tawa-pages/`) to wherever this folder lives on your site.
