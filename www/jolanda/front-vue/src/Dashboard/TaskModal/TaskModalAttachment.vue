<script setup>
    import axios from "axios";
    import {useTranslations} from "@/Composables/useTranslation.js";

    import {useAlerts} from "@/Composables/useAlerts.js";

    const props = defineProps({
        attachment: Object,
        endpoints: Object,
    });

    const emit = defineEmits(["deleted"]);
    const {translations} = useTranslations();
    const alerts = useAlerts();
    
    function downloadFile() {
        axios({
            method: 'post',
            url: props.endpoints.downloadAttachment,
            data: {
                ID: props.attachment.id,
            },
            responseType: 'blob',
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(response => {
            if(response.status === 200) {
                const blob = new Blob([response.data]);
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download = props.attachment.name;
                link.click();
                link.remove();
                window.URL.revokeObjectURL(blobUrl);
            } else {
                alerts.alert(translations.DOWNLOAD_FILE_ERROR, 'error');
            }
        }).catch(error => {
            alerts.alert(translations.DOWNLOAD_FILE_ERROR, 'error');
        });
    }

    function deleteFile() {
        if(!confirm('Opravdu chcete smazat soubor?'))
            return;

        emit('deleted', props.attachment);

        axios({
            method: 'post',
            url: props.endpoints.deleteAttachment,
            data: {
                id: props.attachment.id,
            },
            headers: { 'Content-Type': 'multipart/form-data' },
        }).then(response => {
            if(response.status === 200) {
                alerts.alert(translations.FILE_DELETED, 'success');
            } else {
                alerts.alert(translations.DELETE_FILE_ERROR, 'error');
            }
        }).catch(error => {
            alerts.alert(translations.DELETE_FILE_ERROR, 'error');
        });
    }
</script>

<template>
    <div class="task-detail-attachment" @click="downloadFile">
        <Icon icon="file" :width="16" :height="16" color="#36557f" />
        <div>{{ attachment.name }}</div>
        <div class="file-size">{{ attachment.fileSize > 1000000 ? ((Math.round(attachment.fileSize / 100000) / 10) + ' MB') : ((Math.round(attachment.fileSize / 100) / 10) + ' kB')}}</div>
        <Icon icon="delete" class="delete-icon" :width="16" :height="16" color="#e82121" @click.stop="deleteFile" />
    </div>
</template>

<style scoped>
    .task-detail-attachment {
        display: flex;
        align-items: center;
        gap: 8px;
        border-radius: 8px;
        border: 1px solid #cde;
        background: #fff;
        padding: 6px 4px;
        cursor: pointer;

        &:hover {
            background: #cde;
        }

        .file-size {
            color: #36557f;
            margin-left: 16px;
        }
    }

    .task-detail-attachment .delete-icon:hover:deep(path) {
        fill: #e22;
    }

    html.prefer-dark, html.dark-theme {
        .task-detail-attachment {
            border: 1px solid #152234;
            background: #2b3f5e;

            &:hover {
                background: #506485;
            }

            svg:not(.delete-icon) {
                color: #c8c8c8 !important;
            }

            .file-size {
                color: #c8c8c8;
            }
        }
    }
</style>