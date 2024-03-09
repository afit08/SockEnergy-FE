import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/kit/vite";

const config = {
  kit: {
    adapter: adapter({
      fallback: "index.html",
    }),
    alias: {
      $components: "src/components",
      $utils: "src/routes/utils",
      $lib: "./src/lib",
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
