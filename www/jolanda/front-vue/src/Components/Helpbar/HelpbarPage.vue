<script setup>
    import { useApp } from "@/App/composables/useApp.js";
    import { useHelpbarStore } from "@/Components/Helpbar/stores/helpbarStore.js"; // TODO composable?
    import {ref, onMounted, onUpdated, watch, nextTick} from 'vue';

    const {user} = useApp();

    const props = defineProps({
        data: {},
    })

    const navigationBreadcrumbData = ref([]);
    const showImageModal = ref(false);
    const modalImageSrc = ref('');

    const helpbarStore = useHelpbarStore();
    const emit = defineEmits(['toggleEdit', 'setCurrentDocument', 'deletePage']);

    function buildNavigationBreadcrumb() {
        let isLast = true;
        const navigationList = [];
        if(typeof props?.data !== 'undefined') {
            let currentNavItem = helpbarStore.getNavigationItem(props.data?.id);
            while(currentNavItem) {
                navigationList.unshift({id: currentNavItem.id, title: currentNavItem.title, last: isLast });
                isLast = false;
                currentNavItem = currentNavItem.parent;
            }
            navigationBreadcrumbData.value = navigationList;
        }
    }

    function handleImageClick(event) {
        event.preventDefault();
        let imgSrc = event.target.src;
        
        if (!imgSrc) {
            console.warn('No image source found');
            return;
        }

        // Log the original src for debugging
        console.log('Original image src:', imgSrc);

        // If the URL is relative, convert it to absolute
        if (imgSrc.startsWith('/') || (!imgSrc.startsWith('http') && !imgSrc.startsWith('data:'))) {
            const baseUrl = window.location.origin;
            if (imgSrc.startsWith('/')) {
                imgSrc = baseUrl + imgSrc;
            } else {
                // Handle relative paths that don't start with /
                const currentPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                imgSrc = baseUrl + currentPath + imgSrc;
            }
        }

        console.log('Final image src:', imgSrc);

        // Show in modal instead of new window
        modalImageSrc.value = imgSrc;
        showImageModal.value = true;
    }

    function closeImageModal() {
        showImageModal.value = false;
        modalImageSrc.value = '';
    }

    function attachImageClickListeners() {
        nextTick(() => {
            const contentElement = document.querySelector('.content-text');
            if (contentElement) {
                const images = contentElement.querySelectorAll('img');
                images.forEach(img => {
                    // Remove existing listener to avoid duplicates
                    img.removeEventListener('click', handleImageClick);
                    // Add click listener
                    img.addEventListener('click', handleImageClick);
                    // Add cursor pointer style
                    img.style.cursor = 'pointer';
                });
            }
        });
    }

    onMounted(() => {
        buildNavigationBreadcrumb();
        attachImageClickListeners();
    })

    onUpdated(() => {
        attachImageClickListeners();
    })

    watch(() => props.data, () => {
        buildNavigationBreadcrumb();
        attachImageClickListeners();
    });

</script>

<template>
    <div class="helpbar-page">
        <div class="page-title">
            <div class="page-title-info">
                <div class="page-title-info-text">
                    {{ data.title }}
                </div>
                <div class="page-title-breadcrumb" v-if="navigationBreadcrumbData.length > 1">
                    <span v-for="doc in navigationBreadcrumbData">
                        <span :class="['breadcrumb-item', (doc.last ? 'font-bold cursor-default' : '')]"
                              @click="emit('setCurrentDocument', doc.id, true)">{{ doc.title }}</span>
                        {{ doc.last ? '' : '> ' }}
                    </span>
                </div>
                <div class="page-title-info-creator">
                    <p>Vytvořil: <strong>{{ data.createdby }}</strong> <i>{{ new Date(data.createdat).toLocaleString() }}</i></p>
                    <p>Aktualizováno: <strong>{{ data.updatedby }}</strong> <i>{{ new Date(data.updatedat).toLocaleString() }}</i></p>
                </div>
            </div>
            <div class="flex">
                <button class="page-title-button" @click="emit('toggleEdit')" v-if="data.id && user.hasAdminAccess()">
                    <Icon icon="edit" color="#506069" :width="18" :height="18"/>
                </button>
                <button class="page-title-button" @click="emit('deletePage')" v-if="data.id && user.hasAdminAccess()">
                    <Icon icon="delete" color="#506069" :width="18" :height="18"/>
                </button>
            </div>
        </div>
        <hr class="page-divider">
<!--    TODO dobře zvalidovat content pro prevenci XSS útoků         -->
        <div class="page-content">
            <div class="content-text" v-html="data.content"></div>
        </div>

        <!-- Image Modal -->
        <div v-if="showImageModal" class="image-modal-overlay" @click="closeImageModal">
            <div class="image-modal-content" @click.stop>
                <button class="image-modal-close" @click="closeImageModal">&times;</button>
                <img :src="modalImageSrc" alt="Full size image" class="modal-image" />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .helpbar-page {
        height: 100%;
        display: flex;
        flex-direction: column;
        .page-title {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .page-title-info {
                padding-right: 10px;

                .page-title-info-text {
                    font-size: 1.8rem;
                    line-height: 1.7rem;
                    font-weight: 700;
                    margin-bottom: 10px;
                }

                .page-title-breadcrumb {
                    font-weight: 400;
                    font-size: 10px;
                    line-height: 0.9rem;
                    padding-bottom: 5px;

                    .breadcrumb-item {
                        &:hover {
                            text-decoration: underline;
                            cursor: pointer;
                        }
                    }
                }

                .page-title-info-creator {

                }
            }

            .page-title-button {
                cursor: pointer;
                padding-right: 5px;
            }
        }
        .page-divider {
            margin: 6px 0;
            opacity: 0.7;
        }
        .page-content {
            display: flex;
            padding: 0 15px 10px 5px;
            flex-grow: 1;
            overflow-y: auto;
            min-height: 0;
            line-height: 1.35rem;

            .content-text {
                text-align: justify;
            }
        }

        .page-content :deep(.content-text) {
            ul {
                padding-left: 5px;
                list-style: inside !important;

                li::marker {
                    color: black;
                    content: normal;
                }
            }

            img {
                max-width: 40vw;
                width: 100%;
                cursor: pointer;
            }

            a {
                color: #0a82fa;
                text-decoration: underline;

                &:hover {
                    text-decoration: none;
                }
            }

            p, ul, ol {
                margin-bottom: 6px;
            }
        }

        /* Image Modal Styles */
        .image-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            cursor: pointer;
        }

        .image-modal-content {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            cursor: default;
        }

        .image-modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 40px;
            cursor: pointer;
            z-index: 1001;
            padding: 5px 10px;
            line-height: 1;

            &:hover {
                opacity: 0.7;
            }
        }

        .modal-image {
            max-width: 100%;
            max-height: 90vh;
            width: auto;
            height: auto;
            display: block;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }
    }
</style>