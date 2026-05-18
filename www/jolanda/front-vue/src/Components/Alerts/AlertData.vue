<script setup>
    const props = defineProps({
        data: {
            type: [Object, Array, String, Number, Boolean, null],
            required: true,
        },
    });

    function isObject(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    }
</script>

<template>
    <div>
        <div v-if="isObject(data)" class="json-object">
            <div v-for="(value, key) in data" :key="key" class="json-item">
                <strong>{{ key }}:</strong>
                <AlertData :data="value" />
            </div>
        </div>
        <div v-else-if="Array.isArray(data)" class="json-array">
            [
            <div v-for="(item, index) in data" :key="index" class="json-item">
                <AlertData :data="item" />
            </div>
            ]
        </div>
        <div v-else class="json-value">
            {{ data }}
        </div>
    </div>
</template>

<style scoped>


.json-object, .json-array {
    padding-left: 20px;
}

.json-item {
    margin: 2px 0;
    white-space: pre-wrap; /* Maintains whitespace but wraps text */
}

.json-value {
    color: #007BFF;
    overflow-wrap: normal; /* Allows breaking at any character */
}

.json-object > .json-item > strong {
    color: #D9534F;
}

.json-array > .json-item {
    list-style-type: decimal;
}
</style>