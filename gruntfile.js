module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		minitemplate: {
			options: {
				template: 'templates/page.template'
			},
			staticPages: {
				files: [{
			            expand: true,     
			            cwd: 'srcContent/',  
			            src: ['**/*.hson'],
			            dest: 'WebContent/',
			            ext: '.html'
			          
				}]
			}
		},
		
		writedocs: {
		    web: {
		      options: {  
		        destDir: 'srcContent/api/'
		      },
		      files: {
		    	  src: ['src/minified-web-src.js']
		      }
		    }
		},
		
		mergesrc: {
		    main: {
		      options: {
		    	  prolog: "\n\n// WARNING! This file is autogenerated from minified-shell.js and others.\n\n\n"
		      },
		      files: {
		    	  'src/minified-src.js': ['src/minified-shell.js', 'src/minified-web-src.js', 'src/minified-util-src.js']
		      }
		    }
		},
		
		rebuildsrc: {
			noie: {
				options: {
					config: "// minified.js config start -- use this comment to re-create your build configuration\n"+
					 "// - All sections except debug, ie6compatibility, ie7compatibility, ie8compatibility.\n"
				},
				files: {
					'WebContent/minified-src.noie.js': 'src/minified-src.js',
					'WebContent/minified-web-src.noie.js': 'src/minified-web-src.js'
				}
			},
			headless: {
				options: {
					config: "// minified.js config start -- use this comment to re-create your build configuration\n"+
					"// - All sections except ie6compatibility, ie7compatibility, ie8compatibility, ie9compatibility, amdfallback.\n",
					extraOptions: ['commonjs']
				},
				files: {
					'WebContent/minified-headless.js': 'src/minified-util-src.js',
				}
			}
		},
		
		htmlmin: {
		    dist: {
		      options: {  
		        removeComments: true,
		        collapseWhitespace: true
		      },
		      files: [{
		            expand: true,     
		            cwd: 'WebContent/',  
		            src: ['*.html', 'about/*.html', 'api/**/*.html', 'builder/*.html', 'docs/**/*.html', 'download/*.html'],
		            dest: 'WebContent/'		          
		      }]
		    }
		},
		
		closurecompiler: {
			dist: {
				options: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS'
				},
				files: {
					'tmp/minified-web-closure.js':      'src/minified-web-src.js',
					'tmp/minified-web-closure.noie.js': 'WebContent/minified-web-src.noie.js',
					'tmp/minified-util-closure.js':     'src/minified-util-src.js',
					'tmp/minified-closure.noie.js':     'WebContent/minified-src.noie.js',
					'tmp/minified-closure.js':          'src/minified-src.js'
				}
			},
			
			site: {
				options: {
					compilation_level: 'ADVANCED_OPTIMIZATIONS'
				},
				files: {
					'WebContent/js/builder.js': ['src/minified-src.js', 'srcContent/js/parser-src.js', 'srcContent/js/builder-src.js'],
					'WebContent/js/homepage.js': ['srcContent/js/minified-homepage.js', 'srcContent/js/homepage-src.js']
				}
			}
		},
		
		uglify: {
			dist: {
				options: {
				},
				files: {
					'WebContent/minified-web.js': 'tmp/minified-web-closure.js',
					'WebContent/minified-web.noie.js': 'tmp/minified-web-closure.noie.js',
					'WebContent/minified-util.js': 'tmp/minified-util-closure.js',
					'WebContent/minified.noie.js': 'tmp/minified-closure.noie.js',
					'WebContent/minified.js': 'tmp/minified-closure.js'          
				}
			}
		},
		
		copy: {
			sources: {
				files: {
					'WebContent/minified-web-src.js': 'src/minified-web-src.js',
					'WebContent/minified-util-src.js': 'src/minified-util-src.js',
					'WebContent/minified-src.js': 'src/minified-src.js',
					'WebContent/test/minified-util.js': 'src/minified-util-src.js',
					'WebContent/test/sparkplug.js': 'srcContent/js/sparkplug-src.js'
				}
			},
			site: {
				files: {
					'WebContent/img/': 'srcContent/img/*.png',
					'WebContent/': 'srcContent/test/',
					'WebContent/': 'srcContent/example/'
				}
			}

		},
		
		cssmin: {
			site: {
				files: {
					'WebContent/css/minimum.css': 'srcContent/css/minimum.css',
					'WebContent/css/doc.css': ['srcContent/css/minimum.css', 'srcContent/css/doc.css'],
					'WebContent/css/links.css': ['srcContent/css/minimum.css', 'srcContent/css/links.css'],
					'WebContent/css/homepage.css': ['srcContent/css/minimum.css', 'srcContent/css/homepage.css'],
					'WebContent/css/reference.css': ['srcContent/css/minimum.css', 'srcContent/css/reference.css']
				}
			}
		},
		
		xmlmin: {
			site: {
			    files: [{
			            expand: true,     
			            cwd: 'srcContent/img',  
			            src: ['*.svg'],
			            dest: 'WebContent/img'		          
			    }]
			}
		}
	});
	
	grunt.loadTasks('build/tasks/');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-closurecompiler');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-xmlmin');
	
	grunt.registerTask('default', ['mergesrc', 'rebuildsrc', 'writedocs', 'minitemplate']);
	grunt.registerTask('code', ['default', 'copy:sources', 'closurecompiler', 'uglify']);
	grunt.registerTask('site', ['code', 'copy:site', 'cssmin', 'htmlmin', 'xmlmin']);
	
	
};
