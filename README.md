# The Reath Foundation Website

Static website for `thereath.com`, built as a clean nonprofit site for The Reath Foundation.

## Local Preview

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Structure

- `index.html` - homepage shell
- `assets/cinematic-home.jsx` - cinematic React homepage experiment with liquid-glass UI, Framer Motion animations, and custom JS video crossfades
- `mission/`, `programs/`, `havilah-house/`, `field-notes/`, `support/`, `partners/`, `about/` - route shells
- `assets/site-data.js` - shared content, navigation, program data, publication series, and integration settings
- `assets/main.js` - page renderer, newsletter behavior, Field Notes filtering, optional Beehiiv/Rhythm hydration, and homepage canvas scene
- `assets/styles.css` - responsive visual system

## Integration Hooks

Edit `assets/site-data.js`.

Beehiiv is optional:

```js
integrations: {
  beehiiv: {
    enabled: true,
    postsEndpoint: "/api/beehiiv/posts",
    subscribeEndpoint: "/api/beehiiv/subscribe",
  },
}
```

Expected posts response:

```json
[
  {
    "title": "Place as an Education System",
    "series": "RE Papers",
    "slug": "re-papers",
    "date": "Launch series",
    "excerpt": "Short summary"
  }
]
```

Rhythm program data is optional:

```js
integrations: {
  rhythm: {
    enabled: true,
    organizationSlug: "the-reath-foundation",
    programsEndpoint: "/api/rhythm/programs",
  },
}
```

Expected programs response:

```json
[
  {
    "title": "Learning Circles",
    "label": "Education",
    "description": "Small cohorts for families and learners."
  }
]
```

Donation, restoration, and partner URLs can be wired through the `support` integration block when those services are ready. Current CTAs use direct email placeholders.
