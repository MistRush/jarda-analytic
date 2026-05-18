<script setup></script>

<template>
    <div role="status" class="loading-bar-wrapper">
        <div class="loading-bar"></div>
    </div>
</template>

<style scoped>
.loading-bar-wrapper {
    width: 100%;
    position: relative;
    height: 5px;
    overflow: hidden;
}

.loading-bar {
    width: 60%; /* Šířka animace na začátku (60% šířky nadřazeného prvku) */
    animation: loading 1s infinite cubic-bezier(0.4, 0, 0.6, 1); /* Animace s křivkou časového průběhu */
    transform: translateX(-100%); /* Začátek animace mimo viditelnou oblast */
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--color-primary);
}

@keyframes loading {
    0% {
        transform: translateX(-100%); /* Začátek animace mimo viditelnou oblast */
    }
    100% {
        transform: translateX(calc(100% + 70%)); /* Konec animace přes celou šířku nadřazeného prvku */
    }
}
</style>
