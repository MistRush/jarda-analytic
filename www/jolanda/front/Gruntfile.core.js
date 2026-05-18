/*global module:false*/
module.exports = function (grunt) {
    var corePath = '.';

    var static_cssFiles = [
        corePath+'/css/libs/*.css',
        corePath+'/css/datatables.css',
        corePath+'/css/tempus.css',
        corePath+'/css/jstree.css',
        corePath+'/css/cdbicons.css',
        corePath+'/css/style.static.css'
    ];
    var dynamic_cssFiles = [
        corePath+'/css/style.dynamic.css'
    ];
    var copy_index = 0;

    var sass_files = {
        'core_static': {},
        'core_dynamic': {},
    };

    sass_files.core_static[corePath + '/css/style.static.css'] = corePath + '/css/scss/style.static.scss';
    sass_files.core_dynamic[corePath + '/css/style.dynamic.css'] = corePath + '/css/scss/style.dynamic.scss';

    var cssmin_files = {
        'core_static': {},
        'core_dynamic': {},
    }
    cssmin_files.core_static[corePath + '/css/style.static.min.css'] = static_cssFiles;
    cssmin_files.core_dynamic[corePath + '/css/style.dynamic.min.css'] = dynamic_cssFiles;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            js: {
                expand: true,
                cwd: './node_modules',
                dest: './'+corePath+'/js/libs',
                flatten: true,
                filter: 'isFile',
                src: [
                    './chart.js/dist/Chart.js',
                    './lightbox2/dist/js/lightbox.js',
                    './moment/min/moment-with-locales.js',
                    './select2/dist/js/select2.full.js',
                    './popper.js/dist/umd/popper.js',
                    './bootstrap/dist/js/bootstrap.js',
                    './nonblockjs/NonBlock.es5.js',
                    './@pnotify/core/dist/PNotify.js',
                    './@pnotify/bootstrap4/dist/PNotifyBootstrap4.js',
                    './@pnotify/font-awesome5/dist/PNotifyFontAwesome5.js',
                    './@pnotify/font-awesome5-fix/dist/PNotifyFontAwesome5Fix.js',
                    './@pnotify/mobile/dist/PNotifyMobile.js',
                    './bs-custom-file-input/dist/bs-custom-file-input.js',
                    './vanilla-lazyload/dist/lazyload.js',
                    './grapesjs/dist/grapes.min.js',
                    './focus-visible/dist/focus-visible.min.js'
                ],
                rename: function (dest, src) {
                    copy_index++;
                    return dest+'/'+copy_index+'_'+src;
                }
            },
            css: {
                expand: true,
                cwd: './node_modules',
                dest: './'+corePath+'/css/libs',
                flatten: true,
                filter: 'isFile',
                src: [
                    './chart.js/dist/Chart.css',
                    './lightbox2/dist/css/lightbox.css',
                    './select2/dist/css/select2.css',
                    './@pnotify/core/dist/PNotify.css',
                    './@pnotify/bootstrap4/dist/PNotifyBootstrap4.css',
                    './@pnotify/mobile/dist/PNotifyMobile.css',
                    './grapesjs/dist/css/grapes.min.css',
                ]
            }
        },
        webfont: {
            icons: {
                src: corePath + '/img/cdb-icons/*.svg',
                dest: corePath + '/fonts/cdb-icons',
                destCss: corePath + '/css',
                options: {
                    font: 'cdbicons',
                    engine: 'node',
                    autohint: true,
                    normalize: true,
                    optimize: false,
                    descent: 0,
                    relativeFontPath: '../fonts/cdb-icons',
                    templateOptions: {
                        baseClass: 'ci',
                        classPrefix: 'ci-'
                    }
                }

            }
        },
        concat: {
            options: {
                stripBanners: true,
                nonull: true
            },
            assets: {
                src: [
                    corePath + '/js/assets/datatables.js',
                    corePath + '/js/assets/datatables/ColReorderWithResize.js',
                    corePath + '/js/assets/tempus.js',
                    corePath + '/js/assets/jquery-ui.js',
                    corePath + '/js/assets/jstree/jstree.js',
                    corePath + '/js/assets/select/i18n/CZ.js',
                    corePath + '/js/assets/select/i18n/EN.js',
                ],
                dest: corePath+'/js/assets.js',
                filter: 'isFile'
            },
            libs: {
                src: [
                    corePath+'/js/libs/*.js',
                ],
                dest: corePath+'/js/libs.js',
                filter: 'isFile'
            },
            modules: {
                src: [
                    corePath + '/js/modules/dist/Alerts.js',
                    corePath + '/js/modules/dist/Helpers.js',
                    corePath + '/js/modules/dist/TreeView.js',
                    corePath + '/js/modules/dist/CategoryTree.js',
                    corePath + '/js/modules/dist/RelationSwitcher.js',
                    corePath + '/js/modules/dist/Grid.js',
                    corePath + '/js/modules/dist/SubGrid.js',
                    corePath + '/js/modules/dist/Form.js',
                    corePath + '/js/modules/dist/Panel.js',
                    corePath + '/js/modules/dist/EntityEditor.js',
                    corePath + '/js/modules/dist/Breadcrumb.js',
                    corePath + '/js/modules/dist/Dialog.js',
                    corePath + '/js/modules/dist/QuickEditor.js',
                    corePath + '/js/modules/dist/Cookie.js',
                    corePath + '/js/modules/dist/StateRestore.js',
                    corePath + '/js/modules/dist/Iterator.js',
                    corePath + '/js/modules/dist/inputs/Input.js',
                    corePath + '/js/modules/dist/inputs/Select.js',
                    corePath + '/js/modules/dist/inputs/Radio.js',
                    corePath + '/js/modules/dist/inputs/SelectAjax.js',
                    corePath + '/js/modules/dist/inputs/Checkbox.js',
                    corePath + '/js/modules/dist/inputs/DateBox.js',
                    corePath + '/js/modules/dist/inputs/DateTimeBox.js',
                    corePath + '/js/modules/dist/inputs/BlockEditor.js',
                    corePath + '/js/modules/dist/Import.js',
                    corePath + '/js/modules/dist/AuthWindow.js',
                ],
                dest: corePath+'/js/modules.js',
                filter: 'isFile'
            },
            components: {
                src: [corePath+'/js/components/dist/*/*.js', corePath+'/js/components/dist/application.js'],
                dest: corePath+'/js/components.js',
                filter: 'isFile'
            },
            dist: {
                src: [
                    corePath+'/js/libs.js',
                    corePath+'/js/assets.js',
                    corePath+'/js/modules.js',
                    corePath+'/js/components.js',
                ],
                dest: corePath+'/js/app.js',
                filter: 'isFile'
            },
        },
        uglify: {
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: corePath+'/js/app.min.js'
            },
        },
        cssmin: {
            options: {
                // relativeTo: 'www/css',
                root: corePath+'/css',
                rebase: true,
                sourceMap: true
            },
            core_static: {
                files: cssmin_files.core_static
            },
            core_dynamic: {
                files: cssmin_files.core_dynamic
            },
        },
        sass: {
            core_static: {
                files: sass_files.core_static
            },
            core_dynamic: {
                files: sass_files.core_dynamic
            },
        },
        watch: {
            sass_static: {
                files: [corePath+'/css/scss/**/*.scss'],
                tasks: ['sass:core_static'],
                options: {
                    spawn: false
                }
            },
            sass_dynamic: {
                files: [corePath+'/css/scss/**/*.scss'],
                tasks: ['sass:core_dynamic'],
                options: {
                    spawn: false
                }
            },
            css_static: {
                files: static_cssFiles,
                tasks: ['cssmin:core_static'],
                options: {
                    spawn: false
                }
            },
            css_dynamic: {
                files: dynamic_cssFiles,
                tasks: ['cssmin:core_dynamic'],
                options: {
                    spawn: false
                }
            },
            webfonts: {
                files: [corePath + '/img/cdb-icons/*.svg'],
                tasks: ['webfont', 'cssmin:core_static'],
            },
        },
        babel: {
            modules: {
                options: {
                    sourceMap: true,
                    presets: [
                        ["@babel/preset-env", {
                            'modules':false
                        }]
                    ],
                    plugins: ['@babel/plugin-syntax-class-properties','@babel/plugin-proposal-class-properties']
                },
                files: [
                    {
                        expand: true,
                        cwd: corePath+'/js/modules/src',
                        src: ['**/*.js'],
                        dest: corePath+'/js/modules/dist/'
                    }
                ]
            },
            components: {
                options: {
                    sourceMap: true,
                    presets: [
                        ["@babel/preset-env", {
                            'modules':false
                        }]
                    ],
                    plugins: ['@babel/plugin-syntax-class-properties','@babel/plugin-proposal-class-properties']
                },
                files: [
                    {
                        expand: true,
                        cwd: corePath+'/js/components/src',
                        src: ['**/*.js'],
                        dest: corePath+'/js/components/dist/'
                    }
                ]
            },
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dynamic: {
                tasks: ["watch:sass_dynamic", "watch:css_dynamic"]
            },
            static: {
                tasks: ["watch:sass_static", "watch:css_static"]
            },
            webfonts: {
                tasks: ["watch:webfonts"]
            }
        },
    });
    grunt.event.on('watch', function (action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-webfont');

    //grunt.registerTask('dist', ['copy:css','copy:js','sass:core_static', 'sass:core_dynamic', 'babel', 'concat', 'uglify', 'webfont', 'cssmin:core_static', 'cssmin:core_dynamic'])
    grunt.registerTask('dist', ['copy:css', 'copy:js', 'sass:core_static', 'sass:core_dynamic', 'babel', 'concat', 'uglify', 'cssmin:core_static', 'cssmin:core_dynamic'])
    grunt.registerTask('watcher', ['concurrent:dynamic']);
    grunt.registerTask('watcher_static', ['concurrent:static']);
    grunt.registerTask('build webfont', ['webfont', 'cssmin:core_static']);
    grunt.registerTask('watch webfont', ['concurrent:webfonts']);

};