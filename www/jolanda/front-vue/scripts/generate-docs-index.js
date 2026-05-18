import fs from "fs";
import path from "path";
import fg from "fast-glob";

const docsPath = path.resolve("./src/Docs");
const outputPath = path.resolve("./src/Docs/docs-index.json");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// 💡 Bere jen soubory ve složkách (ne v rootu)
const files = await fg(["*/**/*.vue"], { cwd: docsPath });

const result = [];

for (const file of files) {
    const fullPath = path.join(docsPath, file);
    let fileContent = fs.readFileSync(fullPath, "utf-8");

    fileContent = fileContent
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .trim();

    const titleMatch = fileContent.match(/<template\s+#title>([\s\S]*?)<\/template>/);
    const title = titleMatch ? titleMatch[1].trim().replace(/\r?\n/g, " ") : path.basename(file, ".vue");

    const plainText = fileContent
        .replace(/<Prop>(.*?)<\/Prop>/gi, "[$1]")
        .replace(/<code>(.*?)<\/code>/gi, "`$1`")
        .replace(/<\/?[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 12000);

    result.push({
        component: path.basename(file, ".vue"),
        // 💡 Vypočti správnou cestu i z podsložek
        path: file.replace(/\Doc.vue$/, "").toLowerCase(),
        title,
        content: plainText,
    });
}

fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
console.log(`✅ Docs index saved to ${outputPath}`);
