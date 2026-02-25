# Image Assets — The Reath Foundation

Replace each placeholder with real photography before launch.

| Filename              | Usage                          | Recommended dimensions | Notes                                              |
|-----------------------|--------------------------------|------------------------|----------------------------------------------------|
| `hero.jpg`            | Hero background                | 2400 × 1600 px         | Golden hour, children outdoors, open fields        |
| `village-landscape.jpg` | Village section left panel   | 680 × 820 px           | On-campus photo — gardens, barn, or amphitheater   |
| `brooke-lawler.jpg`   | Founder circle photo           | 360 × 360 px           | Natural light portrait                             |
| `matthew-lawler.jpg`  | Founder circle photo           | 360 × 360 px           | Natural light portrait                             |
| `og-hero.jpg`         | Open Graph / social share      | 1200 × 630 px          | Brand-consistent hero crop                         |

## Usage in HTML

To add the hero background image, update `.hero-bg` in CSS or add inline style:

```css
.hero-bg {
  background-image:
    radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%),
    url('../images/hero.jpg');
  background-size: cover;
  background-position: center;
}
```

All photos should be compressed with modern formats (WebP with JPEG fallback).
