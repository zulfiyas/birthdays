import { next } from '@vercel/edge';

/**
 * Middleware configuration for the biographical website (arboblar celebration ages)
 * Adds security headers and ensures proper routing for static assets
 */
export default function middleware(req) {
  const url = req.nextUrl;
  const pathname = url.pathname;

  // Define security headers that are safe for the HTML/CSS/JS website
  const headers = {
    // Referrer policy: allows referrer information for same-origin and cross-origin when protocol stays
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Prevent clickjacking: allow same-origin only (since the HTML may embed nothing, DENY is also fine)
    'X-Frame-Options': 'SAMEORIGIN',
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable DNS prefetching for performance
    'X-DNS-Prefetch-Control': 'on',
    
    // HSTS: force HTTPS for one year, include subdomains
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Cache control for HTML/assets (optional but helps performance)
    'Cache-Control': 'public, max-age=0, must-revalidate',
    
    // Content Security Policy (optional but recommended) - allows inline styles/scripts as they are present in the HTML
    // This is a permissive CSP for the single-page style; you can tighten if needed.
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; form-action 'self';",
    
    // Prevent cross-origin embedding of your site
    'X-Permitted-Cross-Domain-Policies': 'none',
  };

  // Optional: you could add logic to serve a custom 404 for missing routes,
  // but Vercel will handle static files automatically.
  // For the HTML file to be served on root and all routes pointing to index.html (SPA fallback)
  // However, the project is a single HTML file. If you want all non-file routes to serve the same HTML,
  // uncomment the following lines:
  
  // const isStaticFile = /\.(css|js|json|png|jpg|jpeg|svg|gif|ico|webp|txt|xml|pdf|doc|woff2?|ttf|eot)$/i.test(pathname);
  // if (!isStaticFile && pathname !== '/' && !pathname.startsWith('/api/')) {
  //   // Rewrite to index.html for client-side routing (if you want pretty URLs)
  //   return next({
  //     headers,
  //     rewrite: '/index.html'
  //   });
  // }

  // Apply headers to all responses
  const response = next({
    headers,
  });

  return response;
}

// Optional: configure which paths trigger the middleware (all paths except static assets if needed)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - .svg, .png, .jpg, etc (optional static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json|woff2?|ttf|eot)).*)',
  ],
};
