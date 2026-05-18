<script setup>
import Form from "@/Components/Form/Components/Form.vue";
import InputField from "@/Components/Inputs/InputField.vue";
import Button from "@/Components/Inputs/Button.vue";
import Example from "@/Docs/Example.vue";
import Preview from "@/Docs/Preview.vue";
import Prop from "@/Docs/Prop.vue";
import { reactive } from "vue";
import { string, object } from "yup";
import DocPage from "@/Docs/DocPage.vue";

const state = reactive({
    name: "",
    email: "",
});

const schema = object({
    name: string().required("Jméno je povinné"),
    email: string().email("Neplatný e-mail").required("E-mail je povinný"),
});

function handleSubmit(event) {
    alert(JSON.stringify(event.data, null, 2));
}
</script>

<template>
    <DocPage import="global">
        <template #title> Form </template>

        <template #content>
            <Example title="Základní použití">
                <p>Komponenta <Prop>Form</Prop> poskytuje obalení formuláře s validací pomocí <code>yup</code>.</p>

                <Preview
                    code='
                  <script setup>
                    //import { object, string } from &apos;yup&apos;
                    //import { ref } from &apos;vue&apos;;

                    const schema = object({
                      name: string().required(),
                      email: string().email().required(),
                    })

                    const state = ref({
                      name: null,
                      email: null,
                    })
                  </script>

                  <template>
                    <Form :state="state" :schema="schema" @submit="handleSubmit">
                      <InputField name="name" label="Jméno" v-model="state.name" />
                      <InputField name="email" label="E-mail" v-model="state.email" />
                      <Button type="submit">Odeslat</Button>
                    </Form>
                  </template>
        '
                >
                    <Form :state="state" :schema="schema" @submit="handleSubmit">
                        <InputField name="name" label="Jméno" v-model="state.name" />
                        <InputField name="email" label="E-mail" v-model="state.email" />
                        <Button type="submit">Odeslat</Button>
                    </Form>
                </Preview>
            </Example>

            <Example title="Vlastní validace">
                <p>Přes prop <Prop>validate</Prop> můžeš definovat vlastní funkci vracející seznam chyb.</p>
                <Preview
                    code='
          <template>
            <Form
              :state="state"
              :validate="(state) =&gt; state.name.length &lt; 3 ? [{ path: &apos;name&apos;, message: &apos;Jméno je příliš krátké&apos; }] : []"
              @submit="handleSubmit"
            >
              <InputField name="name" label="Jméno" v-model="state.name" />
              <Button type="submit">Odeslat</Button>
            </Form>
          </template>
        '
                >
                    <Form :state="state" :validate="(state) => (state.name.length < 3 ? [{ path: 'name', message: 'Jméno je příliš krátké' }] : [])" @submit="handleSubmit">
                        <InputField name="name" label="Jméno" v-model="state.name" />
                        <Button type="submit">Odeslat</Button>
                    </Form>
                </Preview>
            </Example>

            <Example title="Reaktivní chyby a required pole">
                <p>Pomocí slot props můžeš zobrazit validace nebo zvýraznit povinná pole ručně. Form využívá validační schema, na které se používá knihovna yup</p>
                <Preview
                    code='
                  <script setup>
                    //import { object, string } from &apos;yup&apos;;

                    const schema = object({
                      name: string().required(),
                    })
                  </script>

                  <template>
                    <Form :state="state" :schema="schema" v-slot="{ errors }">
                      <div v-for="err in errors" :key="err.path" class="text-error">{{ err.message }}</div>
                      <InputField name="name" label="Jméno" v-model="state.name" />
                      <Button type="submit">Odeslat</Button>
                    </Form>
                  </template>
                '
                >
                    <Form :state="state" :schema="schema" v-slot="{ errors }">
                        <div v-for="err in errors" :key="err.path" class="text-error text-sm">{{ err.message }}</div>
                        <InputField name="name" label="Jméno" v-model="state.name" />
                        <Button type="submit">Odeslat</Button>
                    </Form>
                </Preview>
            </Example>

            <Example title="Vlastnosti">
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left border border-border dark:border-dark-border">
                        <thead class="bg-muted dark:bg-dark-muted">
                            <tr>
                                <th class="px-4 py-2 whitespace-nowrap">Prop</th>
                                <th class="px-4 py-2 whitespace-nowrap">Typ</th>
                                <th class="px-4 py-2 whitespace-nowrap">Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>state</Prop></td>
                                <td class="px-4 py-2"><code>Object</code></td>
                                <td class="px-4 py-2">Objekt s daty formuláře. Povinný.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>schema</Prop></td>
                                <td class="px-4 py-2"><code>Object|Function</code></td>
                                <td class="px-4 py-2">Validační schema (Yup, Zod, Joi, aj.).</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>validate</Prop></td>
                                <td class="px-4 py-2"><code>Function</code></td>
                                <td class="px-4 py-2">Vlastní funkce pro validaci.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>validateOn</Prop></td>
                                <td class="px-4 py-2"><code>Array</code></td>
                                <td class="px-4 py-2">Seznam triggerů: <code>blur</code>, <code>input</code>, <code>change</code>, <code>submit</code>.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><Prop>id</Prop></td>
                                <td class="px-4 py-2"><code>String|Number</code></td>
                                <td class="px-4 py-2">Volitelný ID formuláře (defaultně generováno).</td>
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
                                <td class="px-4 py-2 font-mono"><code>@submit</code></td>
                                <td class="px-4 py-2">Emitováno při úspěšném odeslání.</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-2 font-mono"><code>@error</code></td>
                                <td class="px-4 py-2">Emitováno při chybě validace.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Example>
        </template>
    </DocPage>
</template>