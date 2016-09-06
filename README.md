## SWF properties reader
  
A node module for reading [SWF format][swf-format] properties. This is a ES6 fork of [swf-reader](https://github.com/rafaeldias/swf-reader), with a simplier intend (no internal tags/clip lookup, just main scene properties).


## Installation

```sh
$ npm install swf-properties
```

## Usage

```js
var SWFReader = require('swf-properties');

SWFReader( 'swf_path.swf', function(err, props) {
  if ( err ) {
    // handle error
    ...
  }
  console.log(props);
});
``` 

## SWFReader(file, callback)

Returns a [SWF Object](#swf-object) to `callback` function. If it's not possible to read the SWF, an error object is passed as the first argument of `callback`.


## <a name="swf-object"></a>SWF Object

The SWF Object method has the following properties :

* `version`: The SWF version.
* `fileLength`: An Object containing the following properties :
  * `compressed`: The SWF compressed size in bytes.
  * `uncompressed`: The SWF uncompressed size in bytes.
* `frameSize`: An Object containing the `width` and `height` of the SWF.
* `frameRate`: The SWF framerate.
* `frameCount`: Number of frames in the SWF.



## Credits
* [Rafael Leal Dias][rdleal-git]
* [131][131]

## License

MIT 

[![Build Status](https://travis-ci.org/131/swf-properties.svg?branch=master)](https://travis-ci.org/131/swf-properties)
[![Coverage Status](https://coveralls.io/repos/github/131/swf-properties/badge.svg?branch=master)](https://coveralls.io/github/131/swf-properties?branch=master)

[nodejs]: http://www.nodejs.org
[swf-format]: http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/swf/pdf/swf-file-format-spec.pdf
[rdleal-git]: https://github.com/rafaeldias
[131]: https://github.com/131
