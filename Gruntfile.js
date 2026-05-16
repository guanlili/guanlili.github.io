module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            main: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'js/<%= pkg.name %>.min.js'
            },
            extras: {
                files: {
                    'js/archive.min.js': 'js/archive.js',
                    'js/jquery.nav.min.js': 'js/jquery.nav.js'
                }
            }
        },
        less: {
            expanded: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/<%= pkg.name %>.css": "less/<%= pkg.name %>.less"
                }
            },
            minified: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/<%= pkg.name %>.min.css": "less/<%= pkg.name %>.less"
                }
            },
            grid: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/grid.min.css": "less/grid.less"
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'css/<%= pkg.name %>.min.css': 'css/<%= pkg.name %>.min.css',
                    'css/grid.min.css': 'css/grid.min.css'
                }
            }
        },
        banner: '/*!\n' +
            ' * <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: {
                    src: ['css/<%= pkg.name %>.css', 'css/<%= pkg.name %>.min.css', 'js/<%= pkg.name %>.min.js']
                }
            }
        },
        watch: {
            scripts: {
                files: ['js/<%= pkg.name %>.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false,
                },
            },
            less: {
                files: ['less/*.less'],
                tasks: ['less', 'cssmin'],
                options: {
                    spawn: false,
                }
            },
        },
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less', 'cssmin', 'usebanner']);

};
