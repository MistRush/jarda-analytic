<?php

// TODO: tohle přesun nějak hezky do clevisu

/**
 * Class for misc
 *
 * @author Pavel Cihlar
 */
class Clevis_View_Misc {

    public static function renderTinyMCE($id, $name) {
        $output = '';
        $output .= 'tinymce.init({';
        $output .= '    selector: "textarea.' . $name . '",';
        $output .= '    language: "cs",';
        $output .= '    theme: "modern",';
        $output .= '    content_css: "' . _bu() . '/css/tiny-editor7.css",';
        $output .= '    plugins: [';
        $output .= '        "advlist autolink lists link image charmap preview hr anchor pagebreak",';
        $output .= '        "searchreplace wordcount visualblocks visualchars code fullscreen",';
        $output .= '        "insertdatetime media nonbreaking save table directionality",';
        $output .= '        "paste textcolor colorpicker textpattern responsivefilemanager"';
        $output .= '    ],';
        $output .= '    menubar: "insert view format table tools",';
        $output .= '    toolbar1: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",';
        $output .= '    toolbar2: "preview media | forecolor backcolor responsivefilemanager",';
        $output .= '    image_advtab: true,';
        $output .= '    relative_urls: false,';
        $output .= '    external_filemanager_path: "' . _bu() . '/js/filemanager/",';
        $output .= '    filemanager_title: "Responsive Filemanager",';
        $output .= '    external_plugins: {"filemanager": "' . _bu() . '/js/tinymce/plugins/responsivefilemanager/plugin.min.js"},';
        $output .= '    setup: function(ed) {';
        $output .= '        ed.on("change", function(e) {';
        $output .= '            tinyMCE.triggerSave();';
        $output .= '            var tinyValue = $("#tiny-' . $id . '").val();';
        $output .= '            $("#target-' . $id . '").val(tinyValue);';
        $output .= '        });';
        $output .= '    }';
        $output .= '});';

        return $output;
    }
}