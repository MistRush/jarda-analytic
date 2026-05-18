import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import Components from "unplugin-vue-components/vite";
import globalGlobs from "../global/globs";

function removeEmptyCssPlugin() {
    return {
        name: "remove-empty-css",
        generateBundle(_, bundle) {
            for (const file in bundle) {
                if (file.endsWith(".css")) {
                    const asset = bundle[file];

                    if (asset.type === "asset" && typeof asset.source === "string") {
                        const cleaned = asset.source.trim();

                        if (cleaned === "" || /^\/\*\$vite\$:\d+\*\//.test(cleaned)) {
                            asset.source = "/* empty css chunk removed */";
                            console.log(`✅ Emptied CSS (not deleted): ${file}`);
                        }
                    }
                }
            }
        },
    };
}

function writeBuildManifestJson(outDir) {
    return {
        name: "write-build-manifest-json",
        generateBundle(options, bundle) {
            if (!fs.existsSync(outDir)) {
                fs.mkdirSync(outDir, { recursive: true });
                console.log(`✅ Recreated directory: ${outDir}`);
            }

            let manifest = { buildFileJs: "", buildFilesCss: [] };
            for (const fileName in bundle) {
                const asset = bundle[fileName];

                if (asset.type === "chunk" && asset.isEntry) {
                    manifest.buildFileJs = fileName;

                    if (asset.viteMetadata && asset.viteMetadata.importedCss) manifest.buildFilesCss.push(...asset.viteMetadata.importedCss);
                }
            }

            const manifestFilePath = path.resolve(outDir, "manifest.json");
            fs.writeFileSync(manifestFilePath, JSON.stringify(manifest, null, 2), "utf8");
            console.log(`✅ Build manifest JSON written to ${manifestFilePath}`);
        },
    };
}

function cleanDistPlugin(outDir) {
    return {
        name: "clean-dist",
        buildStart() {
            if (fs.existsSync(outDir)) {
                fs.rmSync(outDir, { recursive: true, force: true });
                console.log(`✅ Folder ${outDir} has been deleted.`);
            }
        },
    };
}

export default defineConfig(({ projectRoot, outDir = "dist", command, ...overrides }) => {
    const plugins = [
        vue(),
        tailwindcss(),
        Components({
            globs: globalGlobs,
            directoryAsNamespace: false,
            dts: "src/components.d.ts",
        }),
        removeEmptyCssPlugin(),
    ];

    if (command === "build") {
        plugins.push(cleanDistPlugin(path.resolve(projectRoot, "../www/vue/" + outDir)), writeBuildManifestJson(path.resolve(projectRoot, "../www/vue/" + outDir)));
    }

    return {
        plugins,
        esbuild: {
            logOverride: {
                "css-syntax-error": "silent",
            },
        },
        resolve: {
            alias: {
                "@": path.resolve(projectRoot, "../www/jolanda/front-vue/src"),
                "@project": path.resolve(projectRoot, "./src"),
                "@front": path.resolve(projectRoot, "../www/project"),
            },
            dedupe: ["vue", "vue-router", "@vuepic/vue-datepicker", "@vueuse/core", "@headlessui/vue", "splitpanes", "gridstack", "vue-draggable-plus", "axios", "photoswipe", "fuse.js", "html2canvas-pro", "shiki", "@popperjs/core", "@tailwindcss/vite", "@tsconfig/node22", "@types/lodash", "@types/node", "@vue/tsconfig", "@vueuse/components", "@vueuse/core", "autoprefixer", "class-transformer", "lodash", "moment", "npm-run-all2", "pinia", "reflect-metadata", "splitpanes", "tailwindcss", "typescript", "vite", "vue-axios", "vue-multipane", "vue-tsc", "vuedraggable", "vueuc", "webpack", "webpack-cli", "yup", "vue-draggable-plus", "@vitejs/plugin-vue", "@vitejs/plugin-vue-jsx", "prettier", "prettier-plugin-tailwindcss", "unplugin-vue-components", "@vue/devtools-api", "@tailwindcss/vite", "grapesjs", "@iconify/tailwind4"],
        },
        base: "/vue/" + (command === "serve" ? 'dist' : outDir),
        build: {
            outDir: path.resolve(projectRoot, "../www/vue/" + outDir),
            rollupOptions: {
                input: path.resolve(projectRoot, "./src/main.js"),
                external: [path.resolve(projectRoot, "../www/jolanda/front-vue")],
                output: {
                    entryFileNames: "build-[hash].js",
                    chunkFileNames: "build-[name]-[hash].js",
                    assetFileNames: ({ name }) => {
                        if (name) {
                            if (/\.css$/.test(name)) return "build-[hash][extname]";
                            else return "assets/[name]-[hash][extname]";
                        }

                        return "";
                    },
                },
            },
        },
        server: {
            fs: {
                allow: [".."],
            },
        },
        ...overrides,
    };
});
