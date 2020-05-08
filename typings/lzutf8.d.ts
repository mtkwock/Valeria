/**
 * Minimal interface of the used portions of LZUTF8 library found:
 * https://github.com/rotemdan/lzutf8.js/
 */
interface lzutf8Interface {
  compress: (uncompressed: string, options: {outputEncoding: string}) => string;
  decompress: (compressed: string, options: {inputEncoding: string, outputEncoding?: string}) => string;
}

export {lzutf8Interface};
