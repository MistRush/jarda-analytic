<script setup>
import { ref, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
    text: {
        type: [String, Function],
        required: true
    },
    maxWidth: {
        type: String,
        default: '250px'
    },
    preferredPosition: {
        type: String,
        default: 'below',
        validator: value => ['above', 'below'].includes(value)
    },
    html: {
        type: Boolean,
        default: false
    }
});

const tooltipWrapper = ref(null);
const tooltipContent = ref(null);
const isTooltipVisible = ref(false);
const tooltipStyle = ref({});
const arrowStyle = ref({});

const showTooltip = async () => {
    if(isTooltipVisible.value) return;
    isTooltipVisible.value = true;
    await nextTick();
    updateTooltipPosition();
};

const hideTooltip = () => {
    if(!isTooltipVisible.value)
        return;

    isTooltipVisible.value = false;
};

const updateTooltipPosition = (e) => {
    if(!isTooltipVisible.value) return;

    const wrapper = tooltipWrapper.value;
    const tooltip = tooltipContent.value;

    if (wrapper && tooltip){
        const rect = wrapper.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const arrowHeight = 5;

        let top, arrowBottom, arrowTop, arrowBorderTop, arrowBorderBottom;
        let position = props.preferredPosition ?? 'below';

        if(position === 'below'){
            if(rect.top + window.scrollY - tooltipRect.height - arrowHeight < 0){

            }else{
                position = 'above';
            }
        }else{
            if(!rect.top + window.scrollY - tooltipRect.height - arrowHeight < 0){

            }else{
                position = 'below';
            }
        }

        if (position === 'below') {
            // Position below
            top = rect.bottom + window.scrollY + 10;
            arrowTop = '-5px';
            arrowBottom = 'unset';
            arrowBorderTop = 'none';
            arrowBorderBottom = '5px solid #333';
        } else {
            // Position above
            top = rect.top + window.scrollY - tooltipRect.height - arrowHeight;
            arrowTop = 'unset';
            arrowBottom = '-5px';
            arrowBorderTop = '5px solid #333';
            arrowBorderBottom = 'none';
        }

        let left = rect.left + window.scrollX + rect.width / 2;
        let arrowLeft = tooltipRect.width / 2 - arrowHeight;

        // Adjust if the tooltip goes beyond the right edge of the screen
        if (left + tooltipRect.width / 2 > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width / 2 - 10;
            arrowLeft = tooltipRect.width / 2 + (window.innerWidth - (rect.left + window.scrollX + rect.width / 2)) - 10;
        }

        // Adjust if the tooltip goes beyond the left edge of the screen
        if (left - tooltipRect.width / 2 < 0) {
            left = tooltipRect.width / 2 + 10;
            arrowLeft = tooltipRect.width / 2 - (rect.left + window.scrollX) + 10;
        }

        tooltipStyle.value = {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            transform: 'translateX(-50%)',
            whiteSpace: 'normal',
            visibility: 'visible !important'
        };

        arrowStyle.value = {
            borderTop: arrowBorderTop,
            borderBottom: arrowBorderBottom,
            top: arrowTop,
            bottom: arrowBottom,
            left: '50%',
            transform: 'translateX(-50%)'
        };

        arrowStyle.value.left = `${arrowLeft}px`;
    }
};

// onMounted(() => {
//     window.addEventListener('scroll', updateTooltipPosition);
//     window.addEventListener('resize', updateTooltipPosition);
// });

onUnmounted(() => {
    window.removeEventListener('scroll', updateTooltipPosition);
    window.removeEventListener('resize', updateTooltipPosition);
});

watch(isTooltipVisible, (newValue) => {
    if (newValue) {
        window.addEventListener('scroll', updateTooltipPosition);
        window.addEventListener('resize', updateTooltipPosition);
        updateTooltipPosition();
    }else{
        window.removeEventListener('scroll', updateTooltipPosition);
        window.removeEventListener('resize', updateTooltipPosition);
    }
});
</script>

<template>
    <div ref="tooltipWrapper" class="tooltip-wrapper" @mouseenter.stop="showTooltip" @mouseleave.stop="hideTooltip">
        <slot></slot>
        <Teleport to="#vue_teleport" v-if="isTooltipVisible && text" >
            <div ref="tooltipContent" class="tooltip-content" :style="{visibility: 'hidden', maxWidth: props.maxWidth, ...tooltipStyle ?? {}}">
                <div class="tooltip-arrow" :style="arrowStyle"></div>
                <div v-if="html" v-html="text" />
                <component v-else-if="typeof text === 'function'" :is="text" />
                <template v-else>{{ text }}</template>
            </div>
        </Teleport>
    </div>
</template>


<style scoped>
.tooltip-wrapper {
    position: relative;
    display: inline-block;
}

.tooltip-content {
    background-color: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    white-space: normal;
    z-index: 1000;
    font-size: 10px;
    position: relative;
    word-wrap: break-word; /* Ensure long words are broken */
    display: inline-block;
}

.tooltip-arrow {
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    position: absolute;
}
</style>
