/*jshint node:true, eqeqeq:true */
'use strict';

var RC4        = require("./RC4Cipher.js");
var CryptoJS   = require("crypto-js");

var key 			= 'key';
var message			= 'coba'

// Encrypt 
// var ciphertext 	= CryptoJS.RC4.encrypt('my message', 'q');
var ciphertext 	= CryptoJS.RC4.encrypt(message, key).toString();

 
// Decrypt 
// var bytes  		= CryptoJS.RC4.decrypt(ciphertext.toString(), 'q');
// var plaintext 	= bytes.toString(CryptoJS.enc.Utf8);
// var plaintext  		= CryptoJS.RC4.decrypt(ciphertext, key).toString(CryptoJS.enc.Utf8);

// var ciphertext = CryptoJS.RC4.encrypt(plain, key);
// var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key);

console.log("INI CIPHERNYA >>>>>> " + ciphertext);
// console.log("INI PLAINNYA  >>>>>> " + plaintext);
// console.log("INI KEYNYAAA  >>>>>> " + key);