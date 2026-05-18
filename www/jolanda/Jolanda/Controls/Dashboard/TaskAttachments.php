<?php

namespace Jolanda\Controls\Dashboard;

class TaskAttachments {
    protected array $endpoints = [];
    protected array $states = [];
    protected array $priorities = [];
    protected array $onHoldTypes = [];
    protected array $categories = [];

    protected ?int $user = null;
    protected array $subUsers = [];

    protected array $permissions = [];
    protected array $allowedFeatures = [];

    public function setEndpoints(array $endpoints): void {
        $this->endpoints = $endpoints;
    }

    public function setStates(array $states): void {
        $this->states = $states;
    }

    public function setPriorities(array $priorities): void {
        $this->priorities = $priorities;
    }

    public function setOnHoldTypes(array $onHoldTypes): void {
        $this->onHoldTypes = $onHoldTypes;
    }

    public function setCategories(array $categories): void {
        $this->categories = $categories;
    }

    public function setCurrentUser(int $userId): void {
        $this->user = $userId;
    }

    public function setSubUsers(array $subUserIds): void {
        $this->subUsers = $subUserIds;
    }

    public function setPermissions(array $permissions): void {
        $this->permissions = $permissions;
    }

    public function setAllowedFeatures(array $allowedFeatures): void {
        $this->allowedFeatures = $allowedFeatures;
    }

    public function toArray(): array {
        return get_object_vars($this);
    }

    public function render(bool $returnString = false): null|string {
        $html = <<<HTML
<div 
    id="__task-attachments__vue__"
    data-endpoints="{$this->getEndpoints()}"
    data-states="{$this->getStates()}" 
    data-priorities="{$this->getPriorities()}"
    data-on-hold-types="{$this->getOnHoldTypes()}"
    data-categories="{$this->getCategories()}"
    data-user="{$this->getUser()}"
    data-sub-users="{$this->getSubUsers()}"
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

    public function getEndpoints($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->endpoints), ENT_QUOTES, 'UTF-8') : $this->endpoints;
    }

    public function getStates($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->states), ENT_QUOTES, 'UTF-8') : $this->states;
    }

    public function getPriorities($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->priorities), ENT_QUOTES, 'UTF-8') : $this->priorities;
    }

    public function getOnHoldTypes($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->onHoldTypes), ENT_QUOTES, 'UTF-8') : $this->onHoldTypes;
    }

    public function getCategories($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->categories), ENT_QUOTES, 'UTF-8') : $this->categories;
    }

    public function getUser($json = true): ?string {
        return $json ? htmlspecialchars(json_encode($this->user), ENT_QUOTES, 'UTF-8') : $this->user;
    }

    public function getSubUsers($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->subUsers), ENT_QUOTES, 'UTF-8') : $this->subUsers;
    }

    public function getPermissions($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->permissions), ENT_QUOTES, 'UTF-8') : $this->permissions;
    }

    public function getAllowedFeatures($json = true): array|string {
        return $json ? htmlspecialchars(json_encode($this->allowedFeatures), ENT_QUOTES, 'UTF-8') : $this->allowedFeatures;
    }
}