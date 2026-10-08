import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { collectStaticPages, listJsxFiles } from "./src/utils/extractPageText.js";

const root = path.dirname(fileURLToPath(import.meta.url));

/** Search reads page copy from the JSX files, so editing a page updates results. */
function pageTextPlugin() {
  const virtualId = "virtual:page-text";
  const resolvedId = "\0virtual:page-text";
  return {
    name: "page-text",
    resolveId(id) {
      if (id === virtualId) return resolvedId;
    },
    load(id) {
      if (id !== resolvedId) return null;
      const files = listJsxFiles(path.join(root, "src", "pages"));
      for (const file of files) this.addWatchFile(file);
      this.addWatchFile(path.join(root, "src", "config", "organizations.config.js"));
      const pages = collectStaticPages(files);
      return `export const staticPageText = ${JSON.stringify(pages)};`;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pageTextPlugin()],
});
