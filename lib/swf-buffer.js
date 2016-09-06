"use strict";


const EOS = 0x00;


/**
 *
 * Constructor of SWFBuffer object
 *
 * @param {Buffer} buffer
 * @return Instance of SWFBuffer
 */

class SWFBuffer {

  constructor( buffer ) {
    if ( !Buffer.isBuffer( buffer ) )
      throw new Error('Invalid buffer');

    this.buffer = buffer;
    this.pointer = 0;
    this.position = 1;
    this.current = 0;
    this.length = buffer.length;
  }

  /**
   * Reads unsigned 16 or 32 Little Endian Bits 
   * and advance pointer to next bits / 8 bytes
   *
   * @param {Number} bits
   * @return {Number} Value read from buffer
   */

  readUIntLE( bits ) {
    var value = 0;
    try {
      value = this.buffer['readUInt' + bits + 'LE'](this.pointer);
      this.pointer += bits / 8;
    } catch ( e ) {
      throw e;
    }
    return value;
  }

  /**
   * Reads unsigned 8 bit from the buffer
   *
   * @return {Number} Value read from buffer
   */

  readUInt8() {
    return this.buffer.readUInt8( this.pointer++ );
  }

  /**
   * Reads 32-bit unsigned integers value encoded (1-5 bytes)
   *
   * @return {Number} 32-bit unsigned integer
   */

  readEncodedU32() {
    var i = 5
      , result = 0
      , nb;

    do
      result += (nb = this.nextByte());
    while((nb & 128) && --i);

    return result;
  }

  /**
   * Reads an encoded data from buffer and returns a
   * string using the specified character set.
   *
   * @param {String} encoding - defaults to 'utf8'
   * @returns {String} Decoded string
   */

  readString(encoding) {
    var init = this.pointer;
    while(this.readUInt8() !== EOS);
    return this.buffer.toString(encoding || 'utf8', init, this.pointer - 1);
  }


  /**
   * Reads RECT format
   *
   * @return {Object} x, y, width and height of the RECT
   */

  readRect() {

    this.start();

    var NBits = this.readBits(5)
      , Xmin  = this.readBits(NBits)/20
      , Xmax  = this.readBits(NBits)/20
      , Ymin  = this.readBits(NBits)/20
      , Ymax  = this.readBits(NBits)/20;

    return { 
      x : Xmin,
      y : Ymin,
      width : Xmax - Xmin,
      height : Ymax - Ymin
    }

  }

  /**
   * Sets internal pointer to the specified position;
   *
   * @param {Number} pos
   */

  seek( pos ) {
    this.pointer = pos % this.buffer.length;
  }

  /**
   * Resets position and sets current to next Byte in buffer
   */
  start() {
    this.current = this.nextByte();
    this.position = 1;
  }

  /**
   * Gets next Byte in the buffer and Increment internal pointer
   *
   * @return {Number} Next byte in buffer
   */

  nextByte() {
    return this.pointer > this.buffer.length ? null : this.buffer[ this.pointer++ ];
  }

  /**
   * Reads b bits from current byte in buffer
   *
   * @param {Number} b
   * @return {Number} Bits read from buffer
   */

  readBits( b ){
    var n = 0
      , r = 0; 

    while( n++ < b ) {
      r = (r << 1 ) + ((this.current >> (8-this.position++)) & 1);

      if ( this.position > 8 ) this.start();
    } 
    return r;
  }
}


module.exports = SWFBuffer;
