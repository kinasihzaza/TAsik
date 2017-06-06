var RC4        = require("./RC4Cipher.js");
var CryptoJS   = require("crypto-js");

window.encrypt = function(message, key){
	// function encrypt(message, key){
	var ciphertext 	= CryptoJS.RC4.encrypt(message, key).toString();
	// console.log(message);
	return ciphertext;
}

window.decrypt = function(ciphertext, key){
	// function decrypt(ciphertext, key){
	var ciphertext 	= CryptoJS.RC4.decrypt(ciphertext, key).toString();
	return ciphertext;
}