<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    icon: {
        type: [String, Object],
        required: true,
    },
    width: [Number, String],
    height: [Number, String],
    color: String,
});

const isIconify = ref(false);

const iconComponent = computed(() => {
    const iconMap = {};

    if (typeof props.icon === "string") {
        if (props.icon.startsWith("icon-")) {
            // Iconify class (necháš na <span>)
            isIconify.value = true;
            return null;
        }

        const projectModules = import.meta.glob("../../../../../vue/src/icons/*.vue", { eager: true, import: "default" });
        const localModules = import.meta.glob("./*.vue", {
            eager: true,
            import: "default",
        });

        const resolveModules = (modules) => {
            for (const path in modules) {
                // Získáme název souboru, např. "ArrowIcon" z "./ArrowIcon.vue"
                const fileName = path.split("/").pop().replace(".vue", "");
                // Odvodíme klíč: převedeme na malá písmena a odstraníme slovo "icon" a pomlčky
                const key = fileName.toLowerCase().replace(/icon/gi, "").replace(/-/g, "");
                iconMap[key] = modules[path]; // přímo component (default export)
            }
        };

        resolveModules(localModules);
        resolveModules(projectModules);

        const iconKey = props.icon.toLowerCase().replace(/icon/gi, "").replace(/-/g, "");
        return iconMap[iconKey] ?? null;
    } else {
        // Přišel rovnou komponent/objekt
        return props.icon;
    }
});
</script>

<template>
    <span v-if="isIconify" :class="props.icon" v-bind="$attrs"></span>
    <component v-else :is="iconComponent" :width="width" :height="height" :color="color" class="icon" v-bind="$attrs" />
</template>
