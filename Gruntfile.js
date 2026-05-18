module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            options: {
                implementation: require('sass'),
                sourceMap: true
            },
            dist: {
                files: {
                    'www/css/web/web.css': 'www/css/web/scss/web.scss',
                }
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: [
                    ["@babel/preset-env", {
                        'modules':false
                    }]
                ],
                plugins: ['@babel/plugin-syntax-class-properties','@babel/plugin-proposal-class-properties']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'www/js/app/src',
                    src: ['**/*.js'],
                    dest: 'www/js/app/dest',
                    ext: '.js'
                }]
            }
        },
        concat: {
            app: {
                src: ['www/js/app/src/*/*.js', 'www/js/app/src/app.js'],
                dest: 'www/js/app/app.js',
            },
            legacyApp: {
                src: ['www/js/app/dest/*/*.js', 'www/js/app/dest/app.js'],
                dest: 'www/js/app/app.legacy.js',
            }
        },
        watch: {
            sass: {
                files: ['www/css/web/scss/web/*.scss', 'www/css/web/scss/web/*/*.scss', 'www/css/web/scss/web/*/*/*.scss'],
                tasks: ['sass']
            },
            devConcat: {
                files: ['www/js/app/src/**/*.js'],
                tasks: ['concat:app']
            },
//            babel: {
//                files: ['www/js/app/**/*.js'],
//                tasks: ['babel']
//            },
//            prodConcat: {
//               files: ['www/js/dest/**/*.js'],
//                tasks: ['concat:legacyApp']
//            }
        },
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-concat');


    // Default task(s).
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('buildApp', ['babel', 'concat']);
};