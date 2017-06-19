var express     = require('express');
var mysql       = require('mysql');
var router      = express.Router();
var connection  = require('../database.js');
var CryptoJS    = require("crypto-js");
var rc4         = require('../encrypt/RC4Cipher.js');
var utf8        = require('utf8');
var sha1         = require('sha1');
var moment      = require('moment');

router.get("/", require('../middleware/auth.js'), function(req,res){
    console.log("MASUK FUNGSI GET /INBOX");
    var loginList = [];
    global.inboxList = [];
    var query = "SELECT * FROM ?? WHERE ?? = ? ORDER BY ?? DESC";
    var table = ["message", "msg_target", req.session.pisang.user_email, "msg_time"];
    query = mysql.format(query,table);
    console.log(query);

    connection.query(query,function(err,rows,fields){
        if(err) {
            return res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            for (var i = 0; i < rows.length; i++) {
                // Create an object to save current row's data
                var login = req.session.pisang.user_email;
                var getTime = '' + rows[i].msg_time;
                var time = getTime.substr(0,24);
                console.log(login);
                global.inbox = {
                    'msg_id'        : rows[i].msg_id,
                    'msg_source'    : rows[i].msg_source,
                    'msg_plain'     : rows[i].msg_plain,
                    'msg_time'      : time,
                    'msg_target'    : rows[i].msg_target,
                    'key_recepient' : rows[i].key_recepient,
                    'key_sender'    : rows[i].key_sender,
                    'login'         : login
                }
            // Add object into array
            inboxList.push(inbox);
            }
        }
        res.render('inbox', {
            'inboxList': inboxList,
            'login'    : req.session.pisang.user_email,
            'loginList': loginList
        });
    });
});

router.get('/viewInbox/:msg_id/', require('../middleware/auth.js'), function(req, res, next) {
    console.log("MASUK FUNGSI GET /VIEWINBOX");
    var viewInbox = [];

    var query = "SELECT * FROM ?? WHERE ?? = ?";
    var table = ["message", "msg_id", req.params.msg_id];
    query     = mysql.format(query,table);
    
    console.log(query);
    console.log(req.params.msg_id);
    console.log("batas atas");
    console.log(req.params);
    console.log("batas bawah");

    connection.query(query,function(err, rows, fields){
        if(err) {
            return res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {    
            const db_message_plain       = rows[0].msg_plain;

            /*Modul For Decrypt By Key*/
            const key_from_sender_db     = rows[0].key_sender;
            var cipher_config = key_from_sender_db

            str1 = rows[0].msg_source;
            str2 = rows[0].msg_target;
            str3 = moment(rows[0].msg_time).format("YYYY-MM-DD HH:mm:ss");
            str4 = "TA2017";

            var stringConcat = str1.concat(str2, str3, str4);

            console.log("string concat = " + stringConcat);

            var sortAlphabets = function(stringConcat) {
                return stringConcat.split('').sort().join('');
            };

            var keySort = sortAlphabets(stringConcat);

            console.log("string concat sorted = " + keySort);

            var shakeySort = sha1(keySort);

            console.log("string concat sorted and hashed = " + shakeySort);

            var plaintext     = CryptoJS.RC4.decrypt(db_message_plain.toString(),keySort).toString(CryptoJS.enc.Utf8);

            console.log("MASUK SINI bawah dekrip");

            var date = moment().format("YYYY-MM-DD HH:mm:ss");
            
            /*End Of Modul*/
            var getTime = '' + rows[0].msg_time;
            var time = getTime.substr(0,24);
            global.viewInbox2 = {
                    'msg_id'     : rows[0].msg_id,
                    'msg_source' : rows[0].msg_source,
                    'msg_plain'  : plaintext,
                    'msg_time'   : time,
                    'msg_target' : rows[0].msg_target
            }       
            viewInbox.push(viewInbox2);
            console.log(viewInbox);

            var viewAttachment = [];
            var query2 = "SELECT * FROM ?? WHERE ?? = ?";
            var table2 = ["file_upload", "msg_id", req.params.msg_id];
            query2     = mysql.format(query2,table2);
            console.log(query2);

            connection.query(query2,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else {
                    console.log("MASUK GAAAAAAA");

                    if(rows[0]){
                        console.log("trueeeeee");
                        global.viewAttachment2 = {
                        'id_file'    : rows[0].id_file,
                        'path_file'  : rows[0].path_file,
                        'size_file'  : rows[0].size_file
                        }
                        viewAttachment.push(viewAttachment2);

                        console.log(viewAttachment2);

                        res.render('viewInbox', {
                            'viewInbox': viewInbox,
                            'viewAttachment' : viewAttachment,
                            'login': req.session.pisang.user_email,
                            'date': date
                        }); 
                    } 

                    res.render('viewInbox', {
                        'viewInbox': viewInbox,
                        'viewAttachment' : viewAttachment,
                        'login': req.session.pisang.user_email,
                        'date': date
                    });    
                }
            });
        } 
    });

}).post("/viewInbox", require('../middleware/auth.js'), function(req, res, next){

    // myDate =  moment().format("YYYY-MM-DD HH:mm:ss");

    str1vi = req.session.pisang.user_email;
    str2vi = viewInbox2.msg_source;
    str3vi = req.body.msg_time;
    str4vi = "TA2017";

    console.log("INI WAKTUNYAAAAA >>> " + str3vi);

    var query  = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
    var table  = ["message","msg_source","msg_target","msg_plain","msg_time",str1vi,str2vi,req.body.msg_plain, str3vi];
    
    query  = mysql.format(query,table);
    console.log(query);

    connection.query(query,function(err,rows,fields){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            console.log(rows);
        } else {
            res.redirect("/inbox");
        }
    });

});

router.get("/download/:id_file", require('../middleware/auth.js'), function(req,res){
    console.log("MASUK FUNGSI GET /DOWNLOAD");
    console.log(viewAttachment2);

    var path = require('path');
    var mime = require('mime');

    var file = __dirname + '/..' + viewAttachment2.path_file;

    res.download(file);
});


module.exports = router;