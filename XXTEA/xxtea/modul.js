var xxtea        = require("./xxtea.js");

window.encrypt = function(message, key){
	//function encrypt(message, key){
	var ciphertext = xxtea.encryptToString(message, key);
	return ciphertext;
}

window.decrypt = function(ciphertext, key){
	//function decrypt(ciphertext, key){
	var ciphertext = xxtea.decryptToString(ciphertext, key);
	return ciphertext;
}