<?php
use common\logic\Languages;
use Laminas\I18n\Translator\Translator;
use Vodacek\GettextExtractor\NetteExtractor;
use Sepia\PoParser\PoCompiler;
use TrekkSoft\Potomoco\Compiler;
use Sepia\PoParser\SourceHandler\FileSystem;
use Sepia\PoParser\Parser;
use Sepia\PoParser\Catalog\Entry;

class Default_Logic_Translation {

    const TRANSLATION_FOLDER = APPLICATION_PATH . '/../data/translation/';

    /** Single instance */
    private static self $instance;

    /** @var Translator */
    private Translator $translator;

    /** @var string */
    private string $locale;

    private function __construct() {
        $this->translator = new Translator();
        $this->locale = Languages::getInstance()->getCurrentLanguageCode();
        $this->translator->addTranslationFilePattern('gettext',APPLICATION_PATH . "/../data/translation/","%s.mo");
        $this->translator->setLocale(strtolower($this->locale));
    }

    /**
     * @param string $message
     * @param string|null $locale
     * @return string
     */
    public function translate(string $message, string $locale = null): string {
        if ($locale == null)
            $locale = $this->locale;
        return $this->translator->translate($message, 'default', strtolower($locale));
    }

    public function generateTemplate() {
        if (file_exists(self::TRANSLATION_FOLDER . 'translations.pot'))
            unlink(self::TRANSLATION_FOLDER . 'translations.pot');
        $extractor = new NetteExtractor();
        //$extractor->setupForms()->setupDataGrid();
        $extractor->setMeta('Language', 'cs_CZ');
        $extractor->scan([
            APPLICATION_PATH . '/modules/default',
            APPLICATION_PATH . '/modules/admin/logic/Order',
            APPLICATION_PATH . '/modules/common/logic/',
        ]);
        $extractor->save(self::TRANSLATION_FOLDER . 'translations.pot');
    }

    /**
     * @param string $locale
     */
    public function updateFromPot(string $locale) {
        $compiler = new PoCompiler();
        $moCompiler = new Compiler();

        $fileHandler = new FileSystem(self::TRANSLATION_FOLDER . 'translations.pot');
        $poParser = new Parser($fileHandler);
        $template  = $poParser->parse();

        $fileHandler = new FileSystem(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
        $poParser = new Parser($fileHandler);
        $catalog = $poParser->parse();

        $t_entries = [];

        foreach ($template->getEntries() as $t_entry){
            $t_entries[] = $t_entry->getMsgId();
            if ($catalog->getEntry($t_entry->getMsgId()) == null) {
                $entry = new Entry($t_entry->getMsgId());
                $catalog->addEntry($entry);
            }
            $catalog->getEntry($t_entry->getMsgId())->setReference($t_entry->getReference());
        }
        foreach ($catalog->getEntries() as $entry) {
            if (!in_array($entry->getMsgId(), $t_entries))
                $catalog->removeEntry($entry->getMsgId());
        }
        $fileHandler->save($compiler->compile($catalog));
        $moCompiler->compile(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
    }

    /**
     * @param string $locale
     * @return array
     */
    public function getStrings(string $locale): array {
        $fileHandler = new FileSystem(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
        $poParser = new Parser($fileHandler);
        $catalog = $poParser->parse();

        $strings = [];
        foreach ($catalog->getEntries() as $entry) {
            $strings[md5($entry->getMsgId())] = [
                'orig' => $entry->getMsgId(),
                'text' => $entry->getMsgStr()
            ];
        }

        return $strings;
    }

    /**
     * @param string $locale
     * @param array $values
     */
    public function updateCatalog(string $locale, array $values) {
        $compiler = new PoCompiler();
        $moCompiler = new Compiler();

        $fileHandler = new FileSystem(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
        $poParser = new Parser($fileHandler);
        $catalog = $poParser->parse();

        $hashes = [];

        foreach ($catalog->getEntries() as $entry) {
            $hashes[md5($entry->getMsgId())] = $entry->getMsgId();
        }

        foreach ($values as $value) {
            if (isset($hashes[$value->name]))
                $catalog->getEntry($hashes[$value->name])->setMsgStr($value->value);
        }

        $fileHandler->save($compiler->compile($catalog));
        $moCompiler->compile(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
    }

    /**
     * @param string $file
     * @param string $locale
     * @param string $type
     */
    public function updateFromFile(string $file, string $locale, string $type) {
        $compiler = new PoCompiler();
        $moCompiler = new Compiler();

        $fileHandler = new FileSystem($file);
        $poParser = new Parser($fileHandler);
        $uploadedCatalog = $poParser->parse();

        $fileHandler = new FileSystem(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
        $poParser = new Parser($fileHandler);
        $catalog = $poParser->parse();

        foreach ($catalog->getEntries() as $entry) {
            if ($type == 'rewrite_missing') {
                if ($entry->getMsgStr() == '')
                    $entry->setMsgStr($uploadedCatalog->getEntry($entry->getMsgId())->getMsgStr());
            } elseif ($type == 'rewrite'){
                $entry->setMsgStr($uploadedCatalog->getEntry($entry->getMsgId())->getMsgStr());
            }
        }

        $fileHandler->save($compiler->compile($catalog));
        $moCompiler->compile(self::TRANSLATION_FOLDER .  strtolower($locale) . '.po');
    }

    /**
     * @return string
     */
    public function getLocale(): string {
        return $this->locale;
    }

    /**
     * @return Default_Logic_Translation
     */
    public static function getInstance(): Default_Logic_Translation {
        if (!isset(self::$instance))
            self::$instance = new Default_Logic_Translation();

        return self::$instance;
    }
}