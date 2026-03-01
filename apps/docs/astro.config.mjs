import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://verifactu-oss.dev",
  integrations: [
    starlight({
      title: "Verifactu OSS",
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        { label: "Inicio", link: "/" },
        {
          label: "Guia",
          items: [
            { label: "Quickstart", link: "/quickstart/" },
            { label: "Arquitectura", link: "/architecture/" },
          ],
        },
        {
          label: "SDK",
          autogenerate: { directory: "sdk" },
        },
        {
          label: "API",
          autogenerate: { directory: "api" },
        },
        {
          label: "Internals",
          autogenerate: { directory: "internals" },
        },
        {
          label: "Troubleshooting",
          autogenerate: { directory: "troubleshooting" },
        },
      ],
    }),
  ],
});
