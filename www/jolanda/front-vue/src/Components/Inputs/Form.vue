<script setup>
    import Button from "@/Components/Inputs/Button.vue";

    // Deklarace, že komponenta může emitovat 'submit' událost
    const emit = defineEmits(['submit']);

    const handleSubmit = () => {
        // Emituje událost 'submit' při odeslání formuláře
        emit('submit');
    };
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <div class="grid gap-6 mb-6">
            <!-- Slot pro přidávání vlastních inputů nebo jiných elementů -->
            <slot></slot>
        </div>
        <!-- TODO Přepsat -->
        <Button variant="green" type="submit">Uložit</Button>
<!--        <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>-->
    </form>
</template>