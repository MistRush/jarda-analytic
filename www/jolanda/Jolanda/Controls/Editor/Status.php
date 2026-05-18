<?php

namespace Jolanda\Controls\Editor;

class Status
{
    private string $msg;
    private string $type;
    private bool $confirmAfterNotify;
    private ?string $afterNotifyFunction;

    public const TYPE_ERROR = 'error';
    public const TYPE_INFO = 'info';
    public const TYPE_SUCCESS = 'success';

    public function __construct($type, $msg, $confirmAfterNotify = false)
    {
        $this->type = $type;
        $this->msg = $msg;
        $this->confirmAfterNotify = $confirmAfterNotify;
        $this->afterNotifyFunction = null;
    }

    public function __toString(): string
    {
        return json_encode($this->getStatus());
    }

    public function getStatus(): array
    {
        return [
            'type' => $this->type,
            'msg' => $this->msg,
            'confirmAfterNotify' => (int)$this->confirmAfterNotify,
            'afterNotifyFunction' => $this->afterNotifyFunction,
        ];
    }

    public function setAfterNotifyFunction(string $function): self
    {
        $this->afterNotifyFunction = $function;

        return $this;
    }

    public function getAfterNotifyFunction(): ?string
    {
        return $this->afterNotifyFunction;
    }

}