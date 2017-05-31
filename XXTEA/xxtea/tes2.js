var now = require("performance-now");
/*jshint node:true, eqeqeq:true */
'use strict';

var xxtea        = require("./xxtea.js");

var str = "ASJDKJSDKJASKJDKSAJDKJASKJDKSAJDWHEQWPEOIREWYUMDNFB";
var key = "KUNCIGILA";

var t0 = now();
var encrypt_data = xxtea.encryptToString(str, key);
var t1 = now();
console.log(encrypt_data);
console.log("Call to encrypt took " + (t1 - t0) + " milliseconds.");

var t2 = now();
var decrypt_data = xxtea.decryptToString(encrypt_data, key);
var t3 = now();
console.assert(str === decrypt_data);
console.log(decrypt_data);
console.log("Call to decrypt took " + (t3 - t2) + " milliseconds.");


