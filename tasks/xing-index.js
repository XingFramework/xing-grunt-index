/*
 * xing-index
 * https://github.com/XingFramework/xing-grunt-index
 *
 * Copyright (c) 2015 Logical Reality Design, Inc
 * Licensed under the MIT license.
 */

var fs = require('fs');

module.exports = function(grunt) {
  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask( 'xing-index', 'Process index.html template', function () {
    var options = this.options();
    var spriteSheet = "";
    var jsFiles = options.js || [];
    var cssFiles = options.css || [];

    if(options.svgSprites){
      try {
        spriteSheet = grunt.file.read(options.svgSprites);
      } catch(ex) {
        grunt.log.writeln("When trying to open ", options.svgSprites, "\n  got: ", ex);
        // noop
      }
    }

    if(options.sourceRE) {
      var dirRE = new RegExp(options.sourceRE , 'g' );
      jsFiles = jsFiles.map( function ( file ) {
        return file.replace( dirRE, '' );
      });
      cssFiles = cssFiles.map( function ( file ) {
        return file.replace( dirRE, '' );
      });
    }

    if(!options.production){
      jsFiles.push("http://localhost:"+grunt.config('liveReloadPort')+"/livereload.js?snipver=1&maxdelay=15000");
    }

    this.files.forEach(function(file) {
      grunt.log.write(file.src[0], " -> ", file.dest, "... ");
      grunt.file.copy(file.src[0], file.dest, {
        process: function ( contents, path ) {
          return grunt.template.process( contents, {
            data: {
              scripts: jsFiles,
              styles: cssFiles,
              svgSpritesheet: spriteSheet,
              appName: grunt.config( 'pkg.name' ),
              version: grunt.config( 'pkg.version' )
            }
          });
        }
      });
      grunt.log.ok();
    });
  });
};
