<?php


namespace Jolanda\Translations;

use common\logic\Languages;
use Default_Logic_Translation as Translation;
use Exception;
use Sepia\PoParser\Catalog\Entry;
use Sepia\PoParser\Parser;
use Sepia\PoParser\PoCompiler;
use Sepia\PoParser\SourceHandler\FileSystem;
use Laminas\I18n\Translator\Translator;
use Tracy\Debugger;
use TrekkSoft\Potomoco\Compiler;

class Lang {

    /** Single instance */
    private static $instance;

    private $translator;

    private $locale;
    private $keys = null;

    private function __construct() {
        $this->translator = new Translator();
        $this->locale = strtolower(Translation::getInstance(true)->getLocale());

        if($this->locale === 'cz')
            $this->locale = 'cs';

        $this->translator->addTranslationFilePattern('gettext',__DIR__ . '/',"%s.mo");
        $this->translator->setLocale(strtolower($this->locale));
    }

    public function translate($message, $locale = null) : string {
        if ($locale == null)
            $locale = $this->locale;
        return $this->translator->translate($message, 'default', strtolower($locale));
    }

    private function getStrings() {
        return $this->loadKeys();
    }

    /**
     * @return void
     * @throws Exception
     */
    public function updateLangs()
    {
        $compiler = new PoCompiler();
        $moCompiler = new Compiler();

        $this->updateCatalog(__DIR__ . '/translations.pot', $compiler);

        foreach (glob(__DIR__ . '/*.po') as $file) {
            $this->updateCatalog($file, $compiler, $moCompiler);
        }
    }

    /**
     * @param string $file
     * @param PoCompiler $compiler
     * @param Compiler|null $moCompiler
     * @return void
     * @throws Exception
     */
    private function updateCatalog(string $file, PoCompiler $compiler, ?Compiler $moCompiler = null)
    {
        $fileHandler = new FileSystem($file);
        $poParser = new Parser($fileHandler);
        $catalog = $poParser->parse();

        foreach ($this->getStrings() as $str) {
            if ($catalog->getEntry($str) === null) {
                $catalog->addEntry(new Entry($str));
            }
        }

        $fileHandler->save($compiler->compile($catalog));
        $moCompiler?->compile(__DIR__ . DIRECTORY_SEPARATOR . pathinfo($file)['filename'] . '.po');
    }

    public function getLangsArray(?string $locale = null): array
    {

        if (!$locale)
            $locale = $this->locale;

        $fileHandler = new FileSystem(__DIR__ . '/' . strtolower($locale) . '.po');
        $poParser = new Parser($fileHandler);
        $template = $poParser->parse();

        $result = [];

        foreach ($template->getEntries() as $entry) {
            $result[$entry->getMsgId()] = $entry->getMsgStr();
        }

        return $result;
    }

    public function getJsonLangs()
    {
        return json_encode($this->getLangsArray());
    }

    public static function getInstance(): self
    {
        if (!isset(self::$instance))
            self::$instance = new self();

        return self::$instance;
    }

    public function getLangs($asKeyLangs = false)
    {
        $langs = [];
        foreach (glob(__DIR__ . '/*.po') as $file) {
            $locale = pathinfo($file)['filename'];
            $langs[$locale] = $this->getLangsArray($locale);
        }

        if($asKeyLangs){
            $result = [];
            $strings = $this->getStrings();

            foreach ($strings as $str) {
                $result[$str] = [];

                foreach ($langs as $lang => $translations){
                    $result[$str][$lang] = $translations[$str] ?? '';
                }
            }

            return $result;
        }

        return $langs;
    }

    public function loadKeys(){
        if($this->keys !== null){
            return $this->keys;
        }

        $keys = file_get_contents(__DIR__ . '/keys.json');

        $this->keys = $keys ? json_decode($keys) : [];

        return $this->keys;
    }

    public function saveKeys($keys){
        $this->keys = $keys;

        file_put_contents(__DIR__ . '/keys.json', json_encode($keys));
    }

    public function updateKeyLangs($key, $langs){
        $compiler = new PoCompiler();
        $moCompiler = new Compiler();

        $this->updateCatalog(__DIR__ . '/translations.pot', $compiler);

        foreach (glob(__DIR__ . '/*.po') as $file) {
            $lang = pathinfo($file)['filename'];

            if(!array_key_exists($lang, $langs) || $langs[$lang] === ''){
                continue;
            }

            $fileHandler = new FileSystem($file);
            $poParser = new Parser($fileHandler);
            $catalog = $poParser->parse();

            $entry = $catalog->getEntry($key);
            if(!$entry){
                continue;
            }

            if($entry->getMsgStr() === $langs[$lang]){
                continue;
            }

            $entry->setMsgStr($langs[$lang]);

            $fileHandler->save($compiler->compile($catalog));
            $moCompiler?->compile(__DIR__ . DIRECTORY_SEPARATOR . $lang . '.po');
        }

    }

}