<script setup>
    import {computed,ref} from "vue";

    import TaskModalAttachment from "@/Dashboard/TaskModal/TaskModalAttachment.vue";
    import Tooltip from "@/Components/Other/Tooltip.vue";
    import Popover from "@/Components/Popover/Popover.vue";
    import {useDashboardStore} from "@/Dashboard/stores/dashboardStore.js";
    import TaskModalReplyComment from "@/Dashboard/TaskModal/TaskModalReplyComment.vue";

    const props = defineProps({
        task: Object,
        reply: Object,
        endpoints: Object,
        states: Object
    });

    const dashboardStore = useDashboardStore(window.pinia);

    const isMobile = computed(() => {
        return screen.width <= 768;
    });

    const dateString = computed(() => {
        if(!props.reply.timestamp)
            return '';

        const date = new Date(props.reply.timestamp * 1000);
        if(isMobile.value)
            return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`;
        else return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()} ${(date.getHours() < 10 ? '0' : '') + date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;
    });

    const replyContent = computed(() => {
        if(!props.reply.content || props.reply.content.length === 0)
            return props.reply.content;

        return props.reply.content.replace(
            /<a\s+([^>]*?)(target\s*=\s*(['"])[^>]*?\3)?([^>]*?)>/gi,
            (match, p1, p2, p3, p4) => {
                if (!p2) {
                    return `<a ${p1} target="_blank" ${p4}>`;
                }

                return match;
            }
        );
    });

    const hasLinks = computed(() => {
        return replyContent.value.includes('</a>');
    })

    const statesTranslated = {
        [props.states.new.value]: props.states.new.name,
        [props.states.onHold.value]: props.states.onHold.name,
        [props.states.amended.value]: props.states.amended.name,
        [props.states.solutionRuns.value]: props.states.solutionRuns.name,
        [props.states.awaitingApproval.value]: props.states.awaitingApproval.name,
        [props.states.completed.value]: props.states.completed.name,
        [props.states.canceled.value]: props.states.canceled.name,
    }

    const stateClass = computed(() => {
        return {
            'light-green': props.reply.state === props.states.new.value || props.reply.state === props.states.solutionRuns.value || props.reply.state === props.states.onHold.value || props.reply.state === props.states.amended.value,
            'green': props.reply.state === props.states.completed.value,
            'yellow': props.reply.state === props.states.awaitingApproval.value,
            'red': props.reply.state === props.states.canceled.value,
        }
    });

    function onReplyAttachmentDeleted(attachment) {
        const fileIndex = props.reply.attachments.findIndex(a => a.id === attachment.id);
        if (fileIndex !== -1)
            props.reply.attachments.splice(fileIndex, 1);
    }

    function toggleMinimize() {
        if(addingComment.value)
            return;

        props.reply.minimized = !props.reply.minimized;
    }

    const addingComment = ref(false);
    const commentValue = ref('');
    function addComment() {
        if(commentValue.value.length < 3) {
            return;
        }

        dashboardStore.updateTask(props.endpoints.updateTask, props.endpoints.updateTaskOrder, props.task, {
            replyComment: {
                replyId: props.reply.id,
                content: commentValue.value,
                userId: props.currentUser
            },
        });

        commentValue.value = '';
        commentsPopoverScrollToBottom(0)
    }

    function onUpdateCommentsPopover(opened) {
        addingComment.value = opened;

        if(opened)
            commentsPopoverScrollToBottom()
    }

    function commentsPopoverScrollToBottom(timeout = 250) {
        setTimeout(() => {
            const els = document.querySelectorAll('.task-reply-comments-container .task-reply-comments');
            [...els].forEach(el => {
               el.scrollTop = el.scrollHeight;
            });
        }, timeout);
    }
</script>

<template>
    <div class="task-reply" :class="{ minimized: reply.minimized }">
        <div class="task-reply-header" @click="toggleMinimize">
            <Icon icon="plus" v-if="reply.minimized" color="#36557F" :width="12" :height="12" />
            <Icon icon="user-photo" color="#36557F" :width="20" :height="20" :photo-path="reply.author?.icon" />
            <div class="task-reply-author">{{ reply.author?.name }}</div>
            <div class="task-reply-date">{{ dateString }}</div>
            <Popover v-if="!isMobile" :open="addingComment" :disabled="reply.minimized" @update:open="onUpdateCommentsPopover" class="task-reply-add-comment-button">
                <div class="comment-count">
                    <Icon icon="chat-bubble" color="#36557F" :width="12" :height="12"/>
                    <div class="count">{{ reply.comments?.length ?? 0 }}</div>
                </div>
                <template #panel>
                    <div class="task-reply-comments-container">
                        <div class="task-reply-comments">
                            <TaskModalReplyComment
                                v-for="comment in reply.comments"
                                :comment="comment"
                            />
                        </div>
                        <div class="task-reply-add-comment">
                            <TextArea v-model="commentValue" />
                            <Button variant="green" class="ml-auto" @click="addComment">Přidat komentář</Button>
                        </div>
                    </div>
                </template>
            </Popover>
            <Icon style="margin-left: 4px" v-if="(reply.attachments?.length ?? 0) > 0" icon="clip" color="#36557F" :width="12" :height="12"/>
            <Icon style="margin-left: 4px" v-if="hasLinks" icon="link" color="#36557F" :width="12" :height="12"/>
            <div class="task-reply-state" :class="stateClass">{{ statesTranslated[reply.state] ?? reply.state }}</div>
        </div>
        <div class="task-reply-content no-tailwind" v-html="replyContent" />
        <div class="task-attachment-list">
            <TaskModalAttachment
                v-for="attachment in reply.attachments"
                :key="attachment.id"
                :attachment="attachment"
                :endpoints="endpoints"
                @deleted="onReplyAttachmentDeleted"
            />
        </div>
    </div>
</template>

<style scoped>
    .task-reply {
        border-top: 1px solid #DCE5F7;
        padding: 4px 0;

        .task-reply-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 2px 4px 2px 0;
            cursor: pointer;

            .task-reply-author {
                font-weight: 700;
            }

            .task-reply-state {
                border-radius: 4px;
                padding: 0 6px;
                border: 1px solid #DCE5F7;
                background-color: #f7faff;
                color: #36557F;
                margin-left: auto;

                &.light-green {
                    border: 1px solid #24c586;
                    background-color: #dfd;
                    color: #24c586;
                }

                &.green {
                    border: 1px solid #24c586;
                    background-color: #24c586;
                    color: #fff;
                }

                &.yellow {
                    border: 1px solid #EFAD1F;
                    background-color: #fff1db;
                    color: #EFAD1F;
                }

                &.red {
                    border: 1px solid #e22;
                    background-color: #ffd4d4;
                    color: #e22;
                }
            }

            .task-reply-date {
                margin-right: 8px;
            }

            .task-reply-add-comment-button {
                .comment-count {
                    position: relative;
                    color: #fff;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;

                    & > * {
                        position: absolute;
                    }
                }

                .task-reply-comments-container {
                    width: 300px;
                }

                .task-reply-comments {
                    overflow: auto;
                    max-height: 300px;

                    & > div {
                        border-bottom: 1px solid #d5dbea;
                    }
                }

                .task-reply-add-comment {
                    padding: 4px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
            }
        }

        &.minimized {
            opacity: .5;

            .task-reply-content, .task-attachment-list {
                display: none !important;
            }
        }

        .task-attachment-list {
            display: flex;
            align-items: center;
            gap: 4px;
            flex-wrap: wrap;
        }

        .task-reply-content {
            padding: 0 4px 0 0 !important;
            color: #36557f !important;
        }

        .task-reply-content :deep(img) {
            object-fit: scale-down !important;
            height: auto !important;
            max-width: 100% !important;
        }
    }

    html.prefer-dark, html.dark-theme {
        .task-reply {
            border-top: 1px solid #2b3f5e;

            .task-reply-header {
                svg {
                    color: #d5dbea !important;
                }

                .task-reply-state {
                    border: 1px solid #152234;
                    background-color: #2b3f5e;
                    color: #d5dbea;

                    &.light-green {
                        border: 1px solid #24c586;
                        background-color: #596c59;
                        color: #24c586;
                    }

                    &.green {
                        border: 1px solid #24c586;
                        background-color: #24c586;
                        color: #fff;
                    }

                    &.yellow {
                        border: 1px solid #EFAD1F;
                        background-color: #837662;
                        color: #EFAD1F;
                    }

                    &.red {
                        border: 1px solid #e22;
                        background-color: #835e5e;
                        color: #e22;
                    }
                }

                .task-reply-add-comment-button {
                    .comment-count {
                        color: #152234;
                    }
                }
            }

            .task-reply-content {
                color: #d5dbea !important;
            }
        }
    }
</style>