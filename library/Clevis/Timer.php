<?php

require_once 'Clevis/Common.php';

/**
 * Timer
 *
 * @author Martin Srom <srom.martin@gmail.com>
 */
class Clevis_Timer {
    
    const APPLICATION = 'app';
    
    private static $timer = array();
    
    /**
     * Timer start
     */
    public static function start($name) {
        $timer = &self::$timer[$name];
        $timer['start']  = get_time_ms();
    }
    
    /**
     * Timer stop
     */
    public static function stop($name, $timerStart = null) {
        $timer = &self::$timer[$name];
        if ( $timerStart != null )
            $timer['start'] = self::$timer[$timerStart]['start'];
        $timer['stop'] = get_time_ms();
        if ( array_key_exists('start', $timer) && array_key_exists('stop', $timer) )
            $timer['duration'] = $timer['stop'] - $timer['start'];
    }

    /**
     * Get timer duration
     * 
     * @param $name
     * @return double
     */
    public static function getDuration($name) {
        $timer = &self::$timer[$name];
        if ( array_key_exists('duration', $timer) == false )
            return null;
        return $timer['duration'];
    }
    
    /**
     * Render
     * 
     * @return string
     */
    public static function render() {
        // Stop application timer
        Clevis_Timer::stop(Clevis_Timer::APPLICATION);

        if ( Zend_Controller_Front::getInstance()->getRequest()->isXmlHttpRequest() ) {
            $output = '';
            foreach ( self::$timer as $name => $timer ) {
                if ( array_key_exists('duration', $timer) == false )
                    continue;
                if ( $name == 'run' || $name == 'run-after' )
                    continue;
                if ( strlen($output) > 0 )
                    $output .= ', ';
                $output .= sprintf('%s: %0.2f ms', $name, $timer['duration']);
            }
            return $output;
        }

        // Visible timers definition
        $definition = array();
        $definition[Clevis_Timer::APPLICATION] = array(Clevis_Timer::APPLICATION);
        $definition['action'] = array('run-action');

        // Render visible timers
        $output = '';
        foreach ( $definition as $item => &$timers ) {
            $duration = 0.0;
            foreach ( $timers as $name ) {
                /*if ( array_key_exists('duration', self::$timer[$name]) == false )
                    continue;
                $duration = $duration + self::$timer[$name]['duration'];*/
            }
            if ( strlen($output) > 0 )
                $output .= ', ';
            $output .= sprintf('%s: %0.2f ms', $item, $duration);
        }

        // Render hidden panel of all timers
        $panel = '<div id="clevis-timer" class="site-bottom-timer"' . (Clevis_Helper::isDevelopmentEnvironment() ? ' style="display: block;"' : '') . '>';
        $panel .= '<b>Durations:</b>';
        $panel .= '<a style="float: right; cursor: pointer;" onclick="dojo.style(\'clevis-timer\', \'display\', \'none\' );">Zavřít</a>';
        $panel .= '<table style="margin-top: 5px;">';
        ksort(self::$timer);
        foreach ( self::$timer as $name => $timer ) {
            if ( array_key_exists('duration', $timer) == false )
                continue;
            $panel .= sprintf('<tr><td>%s &nbsp;&nbsp;</td><td align="right">%0.2f ms</td></tr>', $name, $timer['duration']);
        }
        $panel .= '</table>';
        $panel .= '</div>';

        return $panel . '<a style="cursor: pointer;" onclick="dojo.style(\'clevis-timer\', \'display\', dojo.style(\'clevis-timer\', \'display\') == \'none\' ? \'block\' : \'none\');">Durations</a> [' . $output . ']';
    }
}

?>