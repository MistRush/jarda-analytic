<?php
/**
 * ZFDebug Doctrine ORM plugin
 *
 */
class Clevis_Zend_Debug_Controller_Plugin_Debug_Plugin_Doctrine extends Clevis_Zend_Debug_Controller_Plugin_Debug_Plugin_Dynamic
{
    public  static $instance;

    /**
     * Contains plugin identifier name
     *
     * @var string
     */
    protected $_identifier = 'doctrine';

    /**
     * @var array Doctrine connection profiler that will listen to events
     */
    protected $_profilers = array();

    /**
     * Create Clevis_Zend_Debug_Controller_Plugin_Debug_Plugin_Variables
     *
     * @param Doctrine_Manager|array $options
     * @return void
     */
    public function __construct(array $options = array())
    {
        if(!isset($options['manager']) || !count($options['manager'])) {
            if (Doctrine_Manager::getInstance()) {
                $options['manager'] = Doctrine_Manager::getInstance();
            }
        }

        foreach ($options['manager']->getIterator() as $connection) {
            $this->_profilers[$connection->getName()] = new Doctrine_Connection_Profiler();
            $connection->setListener($this->_profilers[$connection->getName()]);
        }

        self::$instance = $this;
    }

    public function clear()
    {
        foreach ($this->_profilers as $name => $profiler) {
            $profiler->clear();
        }
    }

    public function printQueries()
    {
        echo '<pre>';
        foreach ($this->_profilers as $name => $profiler) {
            foreach ( $profiler as $event ) {
                if (in_array($event->getName(), array('query', 'execute', 'exec'))) {
                    $query = $event->getQuery();
                    if ( preg_match("/^INSERT/", $query) ) {
                        $params = $event->getParams();
                        for ( $index = 0; $index < count($params); $index++ ) {
                            $query = preg_replace('/\?/', $params[$index], $query, 1);
                        }
                        echo "<span style='color: #009900;'>$query</span>\n";
                    }
                    else if ( preg_match("/^UPDATE/", $query) ) {
                        echo "<span style='color: #000099;'>$query</span>\n";
                    }
                    else {
                        echo "$query\n";
                    }
                }
            }
        }
        echo '</pre>';
    }

    /**
     * Gets dynamic data
     *
     * @return string
     */
    public function getData()
    {
        $data = array();
        foreach ($this->_profilers as $name => $profiler) {
            $dataProfiler = &$data[$name];
            $dataProfiler = array();
            foreach ( $profiler as $event ) {
                $dataProfilerEvent = array();
                if (in_array($event->getName(), array('query', 'execute', 'exec'))) {
                    $query = $event->getQuery();
                    if ( $query == "SELECT version FROM migration_version" )
                        continue;
                    $dataProfilerEvent["content"] = htmlspecialchars($query);
                    $dataProfilerEvent["content-type"] = "query";
                } else {
                    // Skip commands
                    continue;
                    //$dataProfilerEvent["content"] = htmlspecialchars($event->getName());
                    //$dataProfilerEvent["content-type"] = "command";
                }

                $dataProfilerEvent["duration"] = round($event->getElapsedSecs() * 1000, 2);

                $params = $event->getParams();
                if (!empty($params)) {
                    $dataProfilerEvent["bindings"] = $params;
                }

                $dataProfiler[] = $dataProfilerEvent;
            }
        }
        return $data;
    }

    /**
     * On init script type notification
     *
     * @param Clevis_View_ScriptType $scriptType
     */
    protected function onInitScriptType(Clevis_View_ScriptType & $scriptType) {
        parent::onInitScriptType($scriptType);

        // Refresh data
        $refresh = "";
        $refresh .=
            "var content = '<b>Database queries</b>';\n" .
            "var count = 0;\n" .
            "var duration = 0.0;\n" .
            "for ( var profiler in this.data ) {\n" .
            "    content += '<h4>Connection ' + profiler + ':</h4><ol>';\n" .
            "    profiler = this.data[profiler];\n" .
            "    for ( var event in profiler ) {\n" .
            "        event = profiler[event];\n" .
            "        duration += event.duration;\n" .
            "        count += 1;\n" .
            "        var eventContent = event.content;\n" .
            "        if ( event['content-type'] == 'command' )\n" .
            "            eventContent = '<em>' + eventContent + '</em>';\n" .
            "        content += '<li><strong>[' + event.duration + ' ms]</strong>';\n" .
            "        content += ' ' + eventContent;\n" .
            "        if ( event.bindings != null && event.bindings.length > 0 ) {\n" .
            "            var bindings = '';\n" .
            "            for ( var binding in event.bindings ) {\n" .
            "                binding = event.bindings[binding];\n" .
            "                if ( bindings != '' )\n" .
            "                    bindings += ', ';\n" .
            "                bindings += binding;\n" .
            "            }\n" .
            "            content += ' <strong>[bindings: ' + bindings + ']</strong>';\n" .
            "        }\n" .
            "        content += '</li>';\n" .
            "    }\n" .
            "    content += '</ol>';\n" .
            "}\n" .
            "this.setContent(content);\n" .
            "this.setTitle(count + ' in ' + common.roundNumber(duration,2) + ' ms');";
        $scriptType->provideMethodBody("refresh",$refresh);
    }                   
    
    /**
     * Gets menu tab for the Debugbar
     *
     * @return string
     */
    /*public function getTab()
    {
        if (!$this->_profilers)
            return 'No Profiler';

        foreach ($this->_profilers as $profiler) {
            $time = 0;
            foreach ($profiler as $event) {
                $time += $event->getElapsedSecs();
            }
            $profilerInfo[] = $profiler->count() . ' in ' . round($time*1000, 2)  . ' ms';
        }
        $html = implode(' / ', $profilerInfo);

        return $html;
    }*/

    /**
     * Gets content panel for the Debugbar
     *
     * @return string
     */
    /*public function getPanel()
    {
        if (!$this->_profilers)
            return '';

        $html = '<h4>Database queries</h4>';

        foreach ($this->_profilers as $name => $profiler) {
                $html .= '<h4>Connection '.$name.'</h4><ol>';
                foreach ($profiler as $event) {
                    if (in_array($event->getName(), array('query', 'execute', 'exec'))) {
                        $info = htmlspecialchars($event->getQuery());
                    } else {
                        $info = '<em>' . htmlspecialchars($event->getName()) . '</em>';
                    }

                    $html .= '<li><strong>[' . round($event->getElapsedSecs()*1000, 2) . ' ms]</strong> ';
                    $html .= $info;

                    $params = $event->getParams();
                    if(!empty($params)) {
                        $html .= '<ul><em>bindings:</em> <li>'. implode('</li><li>', $params) . '</li></ul>';
                    }
                    $html .= '</li>';
                }
                $html .= '</ol>';
        }

        return $html;
    }*/

}