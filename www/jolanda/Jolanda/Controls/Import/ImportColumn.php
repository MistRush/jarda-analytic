<?php

namespace Jolanda\Controls\Import;

/**
 * Class ImportColumn
 *
 * @package Jolanda\Controls\Import
 */
class ImportColumn
{

    /** @var string $name */
    private string $name;

    /** @var string $title */
    private string $title;

    /** @var string|null $matchName */
    private string|null $matchName;

    /** @var bool $important */
    private bool $important;

    /** @var string|null $description */
    private string|null $description;

    /** @var self[]|null $childrens */
    private array|null $childrens;

    /**
     * @param string $name
     * @param string $title
     * @param string|null $matchName
     * @param bool $important
     * @param string|null $description
     */
    public function __construct(string $name, string $title, ?string $matchName = null, bool $important = false, ?string $description = null)
    {
        $this->setName($name);
        $this->setTitle($title);
        $this->setMatchName($matchName);
        $this->setImportant($important);
        $this->setDescription($description);
        $this->childrens = [];
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return self
     */
    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     * @return self
     */
    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    /**
     * @return string
     */
    public function getMatchName(): string
    {
        return $this->matchName ?? $this->name;
    }

    /**
     * @param string|null $matchName
     * @return static
     */
    public function setMatchName(?string $matchName): static
    {
        $this->matchName = $matchName;

        return $this;
    }

    /**
     * @return bool
     */
    public function isImportant(): bool
    {
        return $this->important;
    }

    /**
     * @param bool $important
     * @return static
     */
    public function setImportant(bool $important = true): static
    {
        $this->important = $important;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @param string|null $description
     * @return self
     */
    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return self[]|null
     */
    public function getChildrens(): ?array
    {
        return $this->childrens;
    }

    /**
     * @param string $name
     * @param string|null $description
     * @return static
     */
    public function addColumn(string $name, ?string $description = null): static
    {
        return $this->childrens[] = new static($name, $description);
    }

    /**
     * @return bool
     */
    public function hasChildrens(): bool
    {
        return count($this->childrens) > 0;
    }

    /**
     * @return array
     */
    public function childrensToArray(): array
    {
        return array_map(function ($val) {
            return $val->toArray();
        }, $this->childrens);
    }

    /**
     * @return array
     */
    public function toArray(): array
    {
        if ($this->hasChildrens())
            return ['text' => $this->getTitle(), 'children' => $this->childrensToArray()];
        else
            return ['id' => $this->getName(), 'text' => $this->getTitle(), 'description' => $this->getDescription(), 'matchName' => $this->getMatchName(), 'important' => $this->isImportant()];
    }
}