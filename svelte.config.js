import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html',
    }),
    alias: {
      $components: 'src/components',
      $utils: 'src/routes/utils',
      $lib: './src/lib',
    },
    csp: {
      directives: {
        'default-src': ["'self'", 'http://153.92.1.221:3000/'],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          'https://unpkg.com/vis-network/standalone/umd/vis-network.min.js',
          'http://cdn.quilljs.com/',
          'https://cdnjs.cloudflare.com/',
          'https://polyfill.io/',
          'https://maps.googleapis.com/',
          'https://cdn.jsdelivr.net/',
          'https://www.gstatic.com/',
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'http://cdn.quilljs.com/',
          'https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css',
          'https://cdn.jsdelivr.net/',
          'https://www.gstatic.com/',
        ],
        'img-src': [
          "'self'",
          'https://flowbite.com/',
          'http://153.92.1.221:3000/',
          'http://153.92.1.221:9000',
        ],
        'connect-src': ["'self' http://153.92.1.221:3000/"],
        'frame-src': ["'self'"],
        'font-src': ["'self' https://fonts.gstatic.com/"],
        'media-src': ["'self'"],
        'object-src': ["'none'"],
        'manifest-src': ["'self'"],
        'form-action': ["'self'"],
      },
      reportOnly: {
        'script-src': ['self'],
        'report-uri': ['http://153.92.1.221:3000/'],
      },
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
