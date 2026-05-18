<?php

namespace Jolanda\Controls\Dashboard;

class DashboardData {
    const PANEL_TYPE_SOLVER = 'solver';
    const PANEL_TYPE_AUTHOR = 'author';
    const PANEL_TYPE_PROJECT = 'project';
    const PANEL_TYPE_DEPARTMENT = 'department';
    const PANEL_TYPE_CUSTOM = 'custom';

    private array $panels = [];

    public static function createPanel(
        int|string $panelId,
        string $title,
        string $color,
        ?string $icon = null,
        string $type = self::PANEL_TYPE_SOLVER,
        array $taskLists = []
    ): array {
        return [
            'id' => $panelId,
            'title' => $title,
            'color' => $color,
            'icon' => $icon,
            'type' => $type,
            'minimized' => false,
            'maximized' => false,
            'isVisible' => true,
            'taskLists' => $taskLists,
        ];
    }

    public static function createTaskList(
        int|string $panelId,
        int|string $taskListId,
        string $title
    ): array {
        return [
            'id' => $taskListId,
            'panelId' => $panelId,
            'title' => $title,
            'shown' => true,
            'isVisible' => true,
            'tasks' => []
        ];
    }

    public static function createTask(
        int|string $panelId,
        int|string $taskListId,
        int|string $taskId,
        string $title,
        ?string $number,
        ?string $content,
        array $author = [],
        array $solver = [],
        array $otherSolvers = [],
        ?string $dateCreated = null,
        ?string $dateStart = null,
        ?string $dateUpdated = null,
        ?string $dateDeadline = null,
        ?string $priority = null,
        ?string $state = null,
        bool $approved = false,
        ?string $dateApproved = null,
        int $percentProgress = 0,
        bool $viewedFlag = false,
        bool $errorFlag = false,
        bool $priorityFlag = false,
        bool $deferredFlag = false,
        array $attachments = [],
        array $replies = [],
        ?int $expectedHours = null,
        ?int $expectedReturnFinance = null,
        ?string $expectedReturn = null,
        array $department = [],
        array $categories = [],
        array $project = [],
        int|string|null $parentTaskId = null,
        int $subTaskCount = 0,
        array $customPanelUsers = [],
    ): array {
        $links = [];
        if(!empty($content)) {
            preg_match_all('/\bhttps?:\/\/(?![^\s()<>]+\.(jpg|jpeg|png|gif|pdf|zip|docx|xlsx|pptx|mp3|mp4|avi)[^\s]*)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))/i', $content, $matches);
            if(!empty($matches[0]))
                $links = $matches[0];
        }

        if(!empty($replies)) {
            foreach ($replies as $reply) {
                preg_match_all('/\bhttps?:\/\/(?![^\s()<>]+\.(jpg|jpeg|png|gif|pdf|zip|docx|xlsx|pptx|mp3|mp4|avi)[^\s]*)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))/i', $reply['content'] ?? '', $matches);
                if (!empty($matches[0])) {
                    $links = array_merge($links, $matches[0]);
                }
            }

            $replies[count($replies) - 1]['minimized'] = false;
        }

        $links = array_values(array_unique($links));

        return [
            'id' => $taskId,
            'taskListId' => $taskListId,
            'panelId' => $panelId,
            'title' => $title,
            'number' => $number,
            'content' => $content,
            'author' => $author,
            'solver' => $solver,
            'otherSolvers' => $otherSolvers,
            'dateCreated' => $dateCreated,
            'dateStart' => $dateStart,
            'dateUpdated' => $dateUpdated,
            'dateDeadline' => $dateDeadline,
            'priority' => $priority,
            'state' => $state,
            'approved' => $approved,
            'dateApproved' => $dateApproved,
            'percentProgress' => $percentProgress,
            'viewedFlag' => $viewedFlag,
            'errorFlag' => $errorFlag,
            'priorityFlag' => $priorityFlag,
            'deferredFlag' => $deferredFlag,
            'attachments' => $attachments,
            'links' => $links,
            'replies' => $replies,
            'expectedHours' => $expectedHours,
            'expectedReturnFinance' => $expectedReturnFinance,
            'expectedReturn' => $expectedReturn,
            'department' => $department,
            'categories' => $categories,
            'project' => $project,
            'parentTaskId' => $parentTaskId,
            'subTaskCount' => $subTaskCount,
            'customPanelUsers' => $customPanelUsers,
            'isVisible' => true,
            'searchString' => strtolower(implode('|', array_filter([
                $title,
                $number,
                $author['name'],
                $author['initials'],
                $solver['name'],
                $solver['initials'],
            ], fn($searchTerm) => !empty($searchTerm)))),
        ];
    }

    public static function createUser(int|string $id, string $name, string $initials, ?string $icon = null): array {
        return [
            'id' => $id,
            'name' => $name,
            'initials' => $initials,
            'icon' => $icon,
        ];
    }

    public static function createDepartment(int|string $id, string $name, string $color, array $managerIds = []): array {
        return [
            'id' => $id,
            'name' => $name,
            'color' => $color,
            'managerIds' => $managerIds,
        ];
    }

    public static function createProject(int|string $id, int|string $milestoneId, string $name, string $color, ?string $icon = null, array $managerIds = []): array {
        return [
            'id' => $id,
            'milestoneId' => $milestoneId,
            'name' => $name,
            'color' => $color,
            'icon' => $icon,
            'managerIds' => $managerIds,
        ];
    }

    public static function createCategory(int|string $id, string $name): array {
        return [
            'id' => $id,
            'name' => $name,
        ];
    }

    public static function createAttachment(int|string $id, string $name, int $fileSize): array {
        return [
            'id' => $id,
            'name' => $name,
            'fileSize' => $fileSize,
        ];
    }

    public static function createReply(int|string $id, int $timeStamp, string $state, string $content, array $author, array $attachments = [], array $comments = []): array {
        return [
            'id' => $id,
            'timestamp' => $timeStamp,
            'state' => $state,
            'content' => $content,
            'author' => $author,
            'attachments' => $attachments,
            'comments' => $comments,
            'minimized' => true,
        ];
    }

    public static function createComment(int|string $id, int|string $replyId, int $timeStamp, string $content, array $author): array {
        return [
            'id' => $id,
            'replyId' => $replyId,
            'timestamp' => $timeStamp,
            'content' => $content,
            'author' => $author,
        ];
    }

    public function addPanel(array $panel): void {
        $this->panels[] = $panel;
    }

    public function addTaskList(array $taskList): void {
        $this->panels[array_search($taskList['panelId'], array_column($this->panels, 'id'))]['taskLists'][] = $taskList;
    }

    public function addTask(array $task): void {
        $panelIndex = array_search($task['panelId'], array_column($this->panels, 'id'));
        $taskListIndex = array_search($task['taskListId'], array_column($this->panels[$panelIndex]['taskLists'], 'id'));

        $this->panels[$panelIndex]['taskLists'][$taskListIndex]['tasks'][] = $task;
    }

    public function panelExists(int|string $panelId): bool {
        return in_array($panelId, array_column($this->panels, 'id'));
    }

    public function taskListExists(int|string $panelId, int|string $taskListId): bool {
        $panelIndex = array_search($panelId, array_column($this->panels, 'id'));
        if($panelIndex === false)
            return false;

        return in_array($taskListId, array_column($this->panels[$panelIndex]['taskLists'], 'id'));
    }

    public function taskExists(int|string $panelId, int|string $taskListId, int|string $taskId): bool {
        $panelIndex = array_search($panelId, array_column($this->panels, 'id'));
        if($panelIndex === false)
            return false;

        $taskListIndex = array_search($taskListId, array_column($this->panels[$panelIndex]['taskLists'], 'id'));
        if($taskListIndex === false)
            return false;

        return in_array($taskId, array_column($this->panels[$panelIndex]['taskLists'][$taskListIndex]['tasks'], 'id'));
    }

    public function getPanels(): array {
        return $this->panels;
    }

    public static function getTaskListIDEnum(): array {
        return [
            'priority' => 'Prioritní',
            'awaitingApproval' => 'Čekající na schválení',
            'default' => 'Úkoly',
            'deferred' => 'Odložené'
        ];
    }
}