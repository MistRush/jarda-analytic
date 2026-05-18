<script setup>
    import {computed} from "vue";

    const props = defineProps({
        comment: Object
    });

    const dateString = computed(() => {
        if(!props.comment.timestamp)
            return '';

        const date = new Date(props.comment.timestamp * 1000);
        return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()} ${(date.getHours() < 10 ? '0' : '') + date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
    });
</script>

<template>
    <div class="reply-comment">
        <div class="comment-header">
            <Icon icon="user-photo" color="#36557F" :width="20" :height="20" :photo-path="comment.author?.icon" />
            <div class="comment-author">{{ comment.author?.name }}</div>
            <div class="comment-date">{{ dateString }}</div>
        </div>
        <div class="comment-content" v-html="comment.content"></div>
    </div>
</template>

<style scoped>
    .reply-comment {
        padding: 4px 8px;

        .comment-header {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 4px;

            .comment-date {
                margin-left: auto;
            }
        }

        .comment-content {
            padding-left: 4px;
            color: #36557f;
        }
    }

    html.prefer-dark, html.dark-theme {
        .comment-content {
            color: #d5dbea;
        }
    }
</style>