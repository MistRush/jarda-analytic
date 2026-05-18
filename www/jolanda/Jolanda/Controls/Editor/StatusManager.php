<?php

namespace Jolanda\Controls\Editor;

class StatusManager
{
    private array $statuses;

    private static self $instance;

    public function __construct()
    {
        $this->clearStatuses();
    }

    public function addStatus($type, $msg, $confirmAfterNotify = false): Status
    {
        $status = new Status($type, $msg, $confirmAfterNotify);
        $this->statuses[$type][] = $status;

        return $status;
    }

    public function addError($msg, $confirmAfterNotify = false): Status
    {
        return $this->addStatus(Status::TYPE_ERROR, $msg, $confirmAfterNotify);
    }

    public function addInfo($msg, $confirmAfterNotify = true): Status
    {
        return $this->addStatus(Status::TYPE_INFO, $msg, $confirmAfterNotify);
    }

    public function addSuccess($msg, $confirmAfterNotify = true): Status
    {
        return $this->addStatus(Status::TYPE_SUCCESS, $msg, $confirmAfterNotify);
    }

    public function getStatuses(): array
    {
        return $this->statuses;
    }

    private function getStatusesByType($type): array
    {
        return $this->statuses[$type];
    }

    public function getErrors(): array
    {
        return $this->getStatusesByType(Status::TYPE_ERROR);
    }

    public function getInfos(): array
    {
        return $this->getStatusesByType(Status::TYPE_INFO);
    }

    public function getSuccesses(): array
    {
        return $this->getStatusesByType(Status::TYPE_SUCCESS);
    }

    public function clearStatuses(): array
    {
        return $this->statuses = [
            Status::TYPE_ERROR => [],
            Status::TYPE_INFO => [],
            Status::TYPE_SUCCESS => [],
        ];
    }

    private function clearType($type): array
    {
        return $this->statuses[$type] = [];
    }

    public function clearErrors(): array
    {
        return $this->clearType(Status::TYPE_ERROR);
    }

    public function clearInfos(): array
    {
        return $this->clearType(Status::TYPE_INFO);
    }

    public function clearSuccesses(): array
    {
        return $this->clearType(Status::TYPE_SUCCESS);
    }

    private function hasType(string $type): bool
    {
        return (bool)count($this->statuses[$type]);
    }

    public function hasErrors(): bool
    {
        return $this->hasType(Status::TYPE_ERROR);
    }

    public function hasInfos(): bool
    {
        return $this->hasType(Status::TYPE_INFO);
    }

    public function hasSuccesses(): bool
    {
        return $this->hasType(Status::TYPE_SUCCESS);
    }

    public function __toString(): string
    {
        $result = [];
        foreach ($this->statuses as $type => $statuses){
            foreach ($statuses as $status){
                $result[] = $status->getStatus();
            }

        }

        if (is_array($result) && count($result)) {
            $result = [
                'statuses' => $result,
            ];
        }

        return json_encode($result);
    }

    public function toArray(): array
    {
        $result = [];
        foreach ($this->statuses as $type => $statuses){
            foreach ($statuses as $status){
                $result[] = $status->getStatus();
            }

        }

        return $result;
    }

    public static function getInstance(): self
    {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }
}
