<script setup>
import {codeToHtml} from "shiki";
import { ref, onMounted, nextTick, watch } from "vue";
import Copy from "@/Components/Other/Helper/Copy.vue";
import Button from "@/Components/Inputs/Button.vue";

const props = defineProps({
    code: {
        type: String,
        required: true,
    },
    lang: {
        type: String,
        default: "vue",
    },
    format: {
        type: Boolean,
        default: false,
    },
});

const formatCode = (code, lang) => {
    if (!code) return code;
    
    try {
        switch (lang) {
            case 'json':
                return JSON.stringify(JSON.parse(code), null, 2);
            case 'javascript':
            case 'js':
            case 'typescript':
            case 'ts':
                // Základní formátování JS/TS
                let jsIndent = 0;
                return code
                    .replace(/([{};])\s*/g, (match, char) => {
                        if (char === '{') return '{\n';
                        if (char === '}') return '\n}\n';
                        if (char === ';') return ';\n';
                        return match;
                    })
                    .split('\n')
                    .map((line) => {
                        const trimmed = line.trim();
                        if (!trimmed) return '';
                        
                        // Snížení odsazení před zavírací závorkou
                        if (trimmed === '}') {
                            jsIndent = Math.max(0, jsIndent - 1);
                        }
                        
                        const indent = '  '.repeat(jsIndent);
                        const result = indent + trimmed;
                        
                        // Zvýšení odsazení po otevírací závorce
                        if (trimmed.endsWith('{')) {
                            jsIndent++;
                        }
                        
                        return result;
                    })
                    .filter(line => line !== '')
                    .join('\n');
            case 'html':
            case 'xml':
            case 'vue':
                // Formátování HTML/XML - zalamování tagů
                let indentLevel = 0;
                return code
                    .replace(/>\s+</g, '>\n<')
                    .split('\n')
                    .map((line) => {
                        const trimmed = line.trim();
                        if (!trimmed) return '';
                        
                        // Snížení odsazení před zavíracím tagem
                        if (trimmed.startsWith('</')) {
                            indentLevel = Math.max(0, indentLevel - 1);
                        }
                        
                        const indent = '  '.repeat(indentLevel);
                        const result = indent + trimmed;
                        
                        // Zvýšení odsazení po otevíracím tagu (pokud není self-closing)
                        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
                            indentLevel++;
                        }
                        
                        return result;
                    })
                    .filter(line => line !== '')
                    .join('\n');
            case 'css':
                return code
                    .replace(/{/g, '{\n  ')
                    .replace(/}/g, '\n}\n')
                    .replace(/;/g, ';\n  ')
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line !== '')
                    .join('\n');
            default:
                return code;
        }
    } catch (e) {
        // Pokud formátování selže, vrátíme původní kód
        return code;
    }
};

const codeToHighlight = props.format ? formatCode(props.code, props.lang) : props.code;

const highlighted = codeToHighlight
        ? await codeToHtml(codeToHighlight, {
            lang: props.lang,
            themes: {
                light: "github-light-default",
                dark: "github-dark-default",
            },
        })
        : null;

const isCollapsed = ref(false);
const codeElement = ref(null);
const showToggle = ref(false);
const COLLAPSED_HEIGHT = 200;

const checkCodeHeight = async () => {
    await nextTick();
    if (codeElement.value) {
        const height = codeElement.value.scrollHeight;
        showToggle.value = height > COLLAPSED_HEIGHT;
    }
};

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
};

onMounted(() => {
    checkCodeHeight();
});

watch(() => [highlighted, props.code], () => {
    checkCodeHeight();
}, { deep: true });
</script>

<template>
    <div class="my-5">
        <div class="relative">
            <div
                    class="flex flex-wrap items-center gap-2.5 border border-outline dark:border-light/30 border-b-0 relative rounded-t-md px-4 py-2.5 overflow-x-auto"
                    v-if="$slots.header"
            >
                <slot name="header"/>
            </div>
            <div
                    class="flex justify-center border border-b-0 border-outline dark:border-light/30 relative p-4 z-[1]"
                    :class="{ 'rounded-t-md': !$slots.header }"
            >
                <slot/>
            </div>
        </div>
        <div class="[&_pre]:!rounded-t-none [&_div.my-5]:!mt-0">
            <div class="relative mb-5 group border border-outline dark:border-light/30 rounded-b-md overflow-hidden">
                <div 
                    ref="codeElement"
                    class="overflow-x-auto relative"
                    :class="{ 'code-collapsed': isCollapsed }"
                    v-html="highlighted"
                ></div>
                <div class="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
                    <Button 
                        v-if="showToggle"
                        variant="white" 
                        size="small" 
                        :icon="isCollapsed ? 'plus' : 'minus'"
                        @click="toggleCollapse"
                        iconOnly
                        outline
                        :title="isCollapsed ? 'Rozbalit' : 'Sbalit'"
                        class="pointer-events-auto toggle-button"
                    />
                    <div class="flex items-center gap-2 pointer-events-auto" :class="{ 'ml-auto': !showToggle }">
                        <span class="px-2 py-1 text-xs font-medium rounded bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary backdrop-blur-sm">
                            {{ props.lang }}
                        </span>
                        <Copy :text="props.code" title="Zkopírovat"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.code-collapsed {
    max-height: 200px;
    overflow-y: hidden;
    overflow-x: auto;
    position: relative;
}

.code-collapsed::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
    pointer-events: none;
}

html.dark-theme .code-collapsed::after {
    background: linear-gradient(to bottom, rgba(21, 34, 52, 0), rgba(21, 34, 52, 1));
}

/* Pro shiki syntax highlighting - přizpůsobení fade efektu */
:deep(pre) {
    margin: 0;
    padding: 0.5rem;
    width: max-content;
    min-width: 100%;
    display: block;
}

:deep(code) {
    display: block;
    width: max-content;
    min-width: 100%;
}

.toggle-button {
    opacity: 0.2;
    transition: opacity 0.2s ease;
}

.toggle-button:hover {
    opacity: 1;
}
</style>
