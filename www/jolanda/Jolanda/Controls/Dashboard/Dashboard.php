<?php

namespace Jolanda\Controls\Dashboard;

class Dashboard {
    protected int|string|null $initTask = null;

    protected array $endpoints = [];
    protected ?int $currentUser = null;
    protected array $currentUserSubUsers = [];

    protected array $permissions = [];
    protected array $allowedFeatures = [];

    public function setEndpoints(array $endpoints): void {
        $this->endpoints = $endpoints;
    }

    public function setCurrentUser(int $userId): void {
        $this->currentUser = $userId;
    }

    public function setCurrentUserSubUsers(array $subUserIds): void {
        $this->currentUserSubUsers = $subUserIds;
    }

    public function setPermissions(array $permissions): void {
        $this->permissions = $permissions;
    }

    public function setAllowedFeatures(array $allowedFeatures): void {
        $this->allowedFeatures = $allowedFeatures;
    }

    public function initTask(int|string|null $taskId): void {
        $this->initTask = $taskId;
    }

    public function toArray(): array {
        return get_object_vars($this);
    }

    public function render(bool $returnString = false): null|string {
        $html = <<<HTML
<div 
    id="__dashboard__vue__"
    class="tailwind"
    data-init-task="{$this->getInitTask()}"
    data-endpoints="{$this->getEndpoints()}"
    data-current-user="{$this->getCurrentUser()}"
    data-current-user-sub-users="{$this->getCurrentUserSubUsers()}"
    data-permissions="{$this->getPermissions()}"
    data-allowed-features="{$this->getAllowedFeatures()}"
></div>
HTML;

        if($returnString) {
            return $html;
        } else {
            echo $html;
            return null;
        }
    }

    public function getInitTask($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->initTask), ENT_QUOTES, 'UTF-8') : $this->initTask;
    }

    public function getEndpoints($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->endpoints), ENT_QUOTES, 'UTF-8') : $this->endpoints;
    }

    public function getCurrentUser($json = true): ?string {
        return $json ? htmlspecialchars(json_encode($this->currentUser), ENT_QUOTES, 'UTF-8') : $this->currentUser;
    }

    public function getCurrentUserSubUsers($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->currentUserSubUsers), ENT_QUOTES, 'UTF-8') : $this->currentUserSubUsers;
    }

    public function getPermissions($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->permissions), ENT_QUOTES, 'UTF-8') : $this->permissions;
    }

    public function getAllowedFeatures($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->allowedFeatures), ENT_QUOTES, 'UTF-8') : $this->allowedFeatures;
    }
}