<?php

namespace Jolanda\Config;

use Jolanda\Config\ConfigLoader;

class Config extends ConfigLoader
{
    public static function loadVue(): ?array
    {
        return self::getConfig('VUE', false) ?? null;
    }

    public static function loadAlerts(): ?array
    {
        return self::getConfig('ALERTS', false) ?? null;
    }

    public static function loadHelpbar(): ?array {
        return self::getConfig('HELPBAR', false) ?? null;
    }

    public static function loadMenu(): ?array
    {
        return self::getConfig('MENU', false) ?? null;
    }

    public static function vueAlerts()
    {
        $alerts = self::loadAlerts();

        if(!$alerts){
            return false;
        }

        return (bool) ($alerts['vueAlerts'] ?? false);
    }

    public static function alertsHistoryBar()
    {
        $alerts = self::loadAlerts();

        if(!$alerts){
            return false;
        }

        return (bool) ($alerts['historyBar'] ?? false);
    }

    public static function vueHelpbar()
    {
         $helpbar = self::loadHelpbar();

         if(!$helpbar){
             return false;
         }

         return (bool) ($helpbar['vueHelpbar'] ?? false);
    }

    public static function jolandaDocsDatabase() : string
    {
        $helpbarConfig = self::loadHelpbar();
        return ($helpbarConfig['jolandaDocsDatabase'] ?? 'd_cdbremante');
    }


    public static function menu()
    {
        $menu = self::loadMenu();

        if(!$menu){
            return false;
        }

        return (bool) ($menu ?? false);
    }
}