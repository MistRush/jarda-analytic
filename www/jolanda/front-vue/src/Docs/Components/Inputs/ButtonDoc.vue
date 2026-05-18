<script setup>
import Button from "@/Components/Inputs/Button.vue";
import { variants, sizes } from "@/Components/Inputs/Button.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    variant: {
        variant: "primary",
    },
    outline: {
        outline: true,
        variant: "primary",
    },
    size: {
        size: "small",
    },
    icon: {
        iconDirection: "right",
    },
});
</script>

<template>
    <DocPage import="global">
        <template #title> Button </template>
        <template #content>
            <Example title="Label">
                <p>Defaultní slot buttonu nastaví label</p>
                <Preview
                    code="
          <template>
            <Button>Button</Button>
          </template>
        "
                >
                    <Button>Button</Button>
                </Preview>
            </Example>

            <Example title="Variant">
                <p>Prop <Prop>variant</Prop> mění barvu buttonu</p>
                <Preview
                    code='
          <template>
            <Button variant="primary">Button</Button>
          </template>
        '
                >
                    <template #header>
                        <Select class="w-75!" label="variant" :options="variants.map((v) => ({ text: v, value: v }))" v-model="state.variant.variant" />
                    </template>
                    <Button :variant="state.variant.variant">Button</Button>
                </Preview>
            </Example>

            <Example title="Outline">
                <p>Prop <Prop>outline</Prop> nastavuje typ buttonu na outline</p>
                <Preview
                    code="
          <template>
            <Button outline>Button</Button>
          </template>
        "
                >
                    <template #header>
                        <Checkbox label="outline" v-model="state.outline.outline" class="mr-2" />
                        <Select class="w-75!" label="variant" :options="variants.map((v) => ({ text: v, value: v }))" v-model="state.outline.variant" />
                    </template>
                    <Button :outline="state.outline.outline" :variant="state.outline.variant">Button</Button>
                </Preview>
            </Example>

            <Example title="Size">
                <p>Prop <Prop>size</Prop> nastavuje velikost buttonu</p>
                <Preview
                    code='
          <template>
            <Button size="small">Button</Button>
          </template>
        '
                >
                    <template #header>
                        <Select class="w-75!" label="size" :options="sizes.map((v) => ({ text: v, value: v }))" v-model="state.size.size" />
                    </template>
                    <Button :size="state.size.size">Button</Button>
                </Preview>
            </Example>

            <Example title="Icon">
                <p>Prop <Prop>icon</Prop> nastavuje ikonu do buttonu ze seznamu dostupných ikon. <Prop>iconColor</Prop> mění barvu ikony, <Prop>iconDirection</Prop> nastavuje pozici ikony na začátku nebo na konci. Přes <Prop>iconProps</Prop> můžeme předávat object specifických props pro každou ikonu, například direction pro ArrowIcon</p>
                <Preview
                    code='
          <template>
            <Button icon="delete">Button</Button>
          </template>
        '
                >
                    <template #header>
                        <Select
                            class="w-75!"
                            label="iconDirection"
                            :options="[
                                { text: 'right', value: 'right' },
                                { text: 'left', value: 'left' },
                            ]"
                            v-model="state.icon.iconDirection"
                        />
                    </template>
                    <Button icon="delete" :iconDirection="state.icon.iconDirection">Button</Button>
                </Preview>
            </Example>

            <Example title="Disabled">
                <Preview
                    code="
          <template>
            <Button disabled>Button</Button>
          </template>
        "
                >
                    <Button disabled>Button</Button>
                </Preview>
            </Example>

            <Example title="Tooltip">
                <Preview
                    code='
          <template>
            <Button tooltip="some tooltip">Button</Button>
          </template>
        '
                >
                    <Button tooltip="some tooltip">Button</Button>
                </Preview>
            </Example>

            <Example title="Použití ve formu">
                <p>Ve formu můžeme nastavovat typ buttonu přes prop <Prop>type</Prop> na submit</p>
                <Preview
                    code='
          <template>
            <Form @submit="smth()">
              <Button type="submit">Button</Button>
            </Form>
          </template>
        '
                >
                    <Form @submit="console.log('submit')">
                        <Button type="submit">Button</Button>
                    </Form>
                </Preview>
            </Example>

            <Example title="Vlastnosti">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2">Prop</th>
                                <th class="px-4 py-2">Typ</th>
                                <th class="px-4 py-2">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>type</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Např. <code>button</code>, <code>submit</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>variant</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Barevný styl tlačítka.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>outline</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Použije outline místo výplně.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>size</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Velikost: <code>small</code>, <code>base</code>, <code>large</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>icon</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Ikona v buttonu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>iconColor</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Barva ikony.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>iconDirection</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Pozice ikony – <code>left</code> nebo <code>right</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>iconProps</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Další props pro komponentu ikony.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>disabled</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Znepřístupní tlačítko.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>hoverClass</Prop></td>
                                <td class="px-4 py-2"><code>String | Object</code></td>
                                <td class="px-4 py-2">Třída použitá při hoveru.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>tooltip</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">Zobrazí tooltip.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>iconOnly</Prop></td>
                                <td class="px-4 py-2"><code>Boolean</code></td>
                                <td class="px-4 py-2">Pouze ikona, bez textu.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>form</Prop></td>
                                <td class="px-4 py-2"><code>String</code></td>
                                <td class="px-4 py-2">ID formuláře, se kterým je button propojen.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>

            <Example title="Události">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2 whitespace-nowrap">Událost</th>
                                <th class="px-4 py-2 whitespace-nowrap">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@click</code></td>
                                <td class="px-4 py-2">Vyvoláno při kliknutí na tlačítko.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>
