# Novaweb - Modern Web Studio Portfolio

## Overview
Novaweb is a modern, responsive web development studio portfolio website showcasing services, projects, team information, and a contact form. The site features animated canvas particles, scroll reveal effects, multi-language support, and a testimonial slider.

## Project Structure
```
/
├── index.html          # Homepage with hero section and services
├── projects.html       # Projects gallery page
├── about.html          # About page with team information
├── contact.html        # Contact form page
├── css/
│   └── style.css      # Main stylesheet with animations
├── js/
│   ├── main.js        # JavaScript for particles, language toggle, slider
│   └── translations.js # Translation data for Arabic/English
├── images/            # Project images
├── assets/            # Logo and other assets
├── server.py          # Python HTTP server
└── README.txt         # Original project notes
```

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Fonts**: Google Fonts (Tajawal, Inter)
- **Server**: Python 3.11 built-in HTTP server
- **Languages**: 4 languages supported - Arabic (AR), English (EN), French (FR), Spanish (ES)
- **Features**:
  - Canvas particle animation on hero section (enhanced with 100 particles)
  - Scroll reveal animations with smooth cubic-bezier transitions
  - Multi-language support (4 languages) with RTL support for Arabic
  - Language dropdown selector with professional design
  - Project cards linking to external websites with hover effects
  - Testimonial slider with smooth transitions
  - Professional gradient buttons and enhanced UI
  - Responsive design with improved shadows and effects
  - Contact form (uses Formspree)

## Development Setup
The site runs on a simple Python HTTP server on port 5000:
- Command: `python server.py`
- Server binds to: `0.0.0.0:5000`
- Cache-Control headers are set to prevent caching issues

## Multi-Language System
- Language preference is stored in localStorage
- Supports Arabic (RTL) and English (LTR)
- Language toggle button in navigation
- All content is translatable via data-i18n attributes
- Translations stored in `js/translations.js`

## Deployment
- **Type**: Autoscale deployment (stateless website)
- **Command**: `python server.py`
- **Port**: 5000
- The site is ready to be published via Replit's deployment

## Recent Changes (Oct 4, 2025)
### Initial Setup
- Fixed CSS syntax error (missing closing brace in media query)
- Removed duplicate code in contact.html
- Created Python HTTP server with cache control headers
- Configured workflow to serve on port 5000
- Set up autoscale deployment configuration

### Multi-Language Support (4 Languages)
- Implemented 4-language support: Arabic, English, French, Spanish
- Added translations.js with complete translations for all languages
- Created professional dropdown language selector
- Added RTL support for Arabic
- Updated all pages with data-i18n attributes
- Language preference persists via localStorage

### Professional Design Enhancements
- Enhanced color scheme with improved gradients and shadows
- Upgraded CSS with CSS custom properties for consistency
- Professional button designs with hover effects and transitions
- Improved card designs with top border animation on hover
- Enhanced project cards with image zoom and gradient overlays
- Better shadows (sm, md, lg) and smooth cubic-bezier transitions
- Increased particle count to 100 for richer animations
- Enhanced header with better backdrop blur and borders
- Professional dropdown menu with smooth animations

### Project Links Updated
- Converted project cards from lightbox to external links
- Projects now open in new tabs with target="_blank"
- Added rel="noopener noreferrer" for security

### Premium Design Enhancements (Latest)
- **Color Palette Upgrade**: Modern cyan-to-indigo-to-purple gradient system
- **Hero Section**: 
  - Large gradient text effect (56px, weight 800) with animated glow
  - Improved typography with better spacing and hierarchy
  - Enhanced lead text with larger font size (19px)
- **Buttons**: 
  - Triple-gradient primary buttons with shimmer animation
  - Enhanced shadows and glow effects on hover
  - Larger padding (16px 36px) for better touch targets
  - Scale and lift animations (translateY + scale)
- **Service Cards**:
  - Radial glow effect on hover
  - Larger icons (48px) with rotation animation
  - Top border gradient animation
  - Enhanced shadows and backdrop blur
- **Project Cards**:
  - Shimmer sweep effect on hover
  - Better image filters and zoom effects
  - Title color change on hover to accent color
- **CTA Section**:
  - Pulsing radial glow animation
  - Gradient background with borders
  - Large gradient heading (36px)
- **Overall Improvements**:
  - Enhanced shadow system (sm, md, lg with multiple layers)
  - Smooth cubic-bezier transitions (0.4s)
  - Radial background gradient for depth
  - Professional color scheme with accessibility in mind

## Pages
1. **Home** (`/`) - Hero section with particles, services overview, featured projects, testimonials
2. **Projects** (`/projects.html`) - Full project gallery with external links
3. **About** (`/about.html`) - Team information
4. **Contact** (`/contact.html`) - Contact form and contact details

## Contact Information
- Email: novawebdv@gmail.com
- Phone: +213 663 699 433
- Location: Algiers, Algeria

## Notes
- All JavaScript and CSS are vanilla (no build step required)
- Google Fonts require internet connection
- Contact form uses Formspree integration
- Images are placeholders that can be replaced in `/images` and `/assets`
- Project URLs in index.html and projects.html should be updated with real website URLs
- Language preference persists across sessions via localStorage
