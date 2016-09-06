/**
 * Simple module for reading SWF properties
 *
 * (c) 2014 Rafael Leal Dias <rafaeldias.c at gmail dot com>
 * MIT LICENCE
 *
 */

const fs        = require('fs');
const zlib      = require('zlib');
const SWFBuffer = require('./lib/swf-buffer');
const SWFTags   = require('./lib/swf-tags');


/**
 * Reads tags and their contents, passing a SWF object to callback 
 *
 * @param {SWFBuffer} buff
 * @param {Buffer} compressed_buff
 * @param {function} callback 
 * @api private
 *
 */ 
function readSWFBuff(buff, compressed_buff, next) { 
  buff.seek(3);// start

  var swf = {
        version     : buff.readUInt8(),
        fileLength  : {
          compressed    : compressed_buff.length,
          uncompressed  : buff.readUIntLE(32) 
        },
        frameSize   : buff.readRect(), // Returns a RECT object. i.e : { x : 0, y : 0, width : 200, height: 300 }
        frameRate   : buff.readUIntLE(16)/256,
        frameCount  : buff.readUIntLE(16)
      };


  return next( null, swf );
} 



/**
 * Uncompress SWF and start reading it
 *
 * @param {Buffer|ArrayBuffer} swf
 * @param {function} callback
 *
 */
function uncompress(swf, next) {
  var compressed_buff = swf.slice(8) , uncompressed_buff;

    // uncompress buffer
    switch( swf[0] ) {
      case 0x43 : // zlib compressed

        zlib.unzip( compressed_buff, function(err, result) {
          if ( err )
            return next(err);

          uncompressed_buff = Buffer.concat([swf.slice(0, 8), result]);
          readSWFBuff(new SWFBuffer(uncompressed_buff), swf, next);
        });
        break;

      case 0x46 : // uncompressed
        return readSWFBuff(new SWFBuffer( swf ), swf, next);
        break;

      default :
        next(new Error('Unknown SWF compressions'));
    };
};



var SWFReader = function(file, next) {
  if (Buffer.isBuffer(file))
    return uncompress(file, next);

  fs.readFile(file, function(err, swf) {
    if( err )
      return next(err);
    uncompress(swf, next);
  });
};


module.exports = SWFReader;