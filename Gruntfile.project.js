/*global module:false*/
module.exports = function (grunt) {
    var projectPath = 'www/project';
    var copy_index = 0;

    var sass_files = {
        'project': {}
    }

    sass_files.project[projectPath + '/css/project.css'] = projectPath + '/css/scss/project.scss';

    var cssmin_files = {
        'project': {}
    }

    cssmin_files.project[projectPath + '/css/project.min.css'] = projectPath + '/css/project.css';


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            js: {
                expand: true,
                cwd: './node_modules',
                dest: './'+projectPath+'/js/libs',
                flatten: true,
                filter: 'isFile',
                src: [
                    './quagga/dist/quagga.js',
                    './a-color-picker/dist/acolorpicker.js',
                    './tinymce/tinymce.js',
                    './jsqr/dist/jsQR.js',
                    './qrcode/build/qrcode.js',
                    './fabric/dist/fabric.js',
                ],
                rename: function (dest, src) {
                    copy_index++;
                    return dest+'/'+copy_index+'_'+src;
                }
            },
            css: {
                expand: true,
                cwd: './node_modules',
                dest: './'+projectPath+'/css/libs',
                flatten: true,
                filter: 'isFile',
                src: [

                ]
            }
        },
        concat: {
            options: {
                stripBanners: true,
                nonull: true
            },
            project_components: {
                src: [projectPath+'/js/libs/*.js', projectPath+'/js/dist/*/*.js', projectPath+'/js/dist/*.js'],
                dest: projectPath+'/js/components.js',
                filter: 'isFile'
            },
        },
        uglify: {
            project_dist: {
                src: projectPath + '/js/components.js',
                dest: projectPath+'/js/components.min.js'
            }
        },
        cssmin: {
            project: {
                files: cssmin_files.project
            }
        },
        sass: {
            project: {
                files: sass_files.project
            }
        },
        watch: {
            sass_project: {
                files: [projectPath+'/css/scss/**/*.scss'],
                tasks: ['sass:project'],
                options: {
                    spawn: false
                }
            },
            css_project: {
                files: [
                    projectPath+'/css/project.css'
                ],
                tasks: ['cssmin:project'],
                options: {
                    spawn: false
                }
            },
        },
        babel: {
            project_components: {
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
                        cwd: projectPath+'/js/src',
                        src: ['**/*.js'],
                        dest: projectPath+'/js/dist/'
                    }
                ]
            }
        },
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            dynamic: {
                tasks: ["watch:sass_project", "watch:css_project"]
            },
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('dist', ['copy:css','copy:js', 'sass:project', 'babel', 'concat', 'uglify', 'cssmin:project'])
    grunt.registerTask('watcher', ['concurrent:dynamic']);

};