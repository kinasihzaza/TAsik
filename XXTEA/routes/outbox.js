var express     = require('express');
var mysql       = require('mysql');
var router      = express.Router();
var connection  = require('../database.js');
var xxtea       = require('../xxtea/xxtea.js');
var sha1         = require('sha1');
var moment     = require('moment');

router.get("/", require('../middleware/auth.js'), function(req,res){
    // console.log("MASUK FUNGSI GET /OUTBOX");
    var outboxList = [];
    var query = "SELECT * FROM ?? WHERE ?? = ? ORDER BY ?? DESC";
    var table = ["message", "msg_source", req.session.pisang.user_email, "msg_time"];
    query = mysql.format(query,table);

    connection.query(query,function(err,rows,fields){
        if(err) {
            return res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            for (var i = 0; i < rows.length; i++) {
                // console.log("row length: ", rows.length);
                // console.log("i: ", i);
                // Create an object to save current row's data
                var login = req.session.pisang.user_email;
                var getTime = '' + rows[0].msg_time;
                var time = getTime.substr(0,24);
                // console.log(login);
                var outbox = {
                    'msg_id'     : rows[i].msg_id,
                    'msg_source' : rows[i].msg_source,
                    'msg_plain'  : rows[i].msg_plain,
                    'msg_time'   : time,
                    'msg_target' : rows[i].msg_target,
                    'key_sender' : rows[i].key_sender,
                    'login'      :login
            }
            // Add object into array
            outboxList.push(outbox);
            }
        }
        res.render('outbox', {
            'outboxList': outboxList,
            'login': req.session.pisang.user_email
        });
    });
});

router.get('/viewOutbox/:msg_id/', require('../middleware/auth.js'), function(req, res, next) {
    // console.log("MASUK FUNGSI GET /VIEWOUTBOX 1");

    var viewOutbox = [];

    var query = "SELECT * FROM ?? WHERE ?? = ?";
    var table = ["message", "msg_id", req.params.msg_id];
    query     = mysql.format(query,table);
    // console.log(query);
    // console.log(req.params);

    connection.query(query,function(err,rows,fields){
        if(err) {
            return res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {  
            // console.log("MASUK FUNGSI GET /VIEWOUTBOX 2");
            const db_message_plain = rows[0].msg_plain;
            /*Modul For Decrypt By Key*/
            const key_from_sender_db = rows[0].key_sender;
            // console.log("KEY :: >>>> "+key_from_sender_db);
            key = key_from_sender_db;
            /*End Of Modul*/
            console.log("CIPHERTEXT >>>> " + db_message_plain);
            str1 = rows[0].msg_source;
            str2 = rows[0].msg_target;
            str3 = moment(rows[0].msg_time).format("YYYY-MM-DD HH:mm:ss");
            str4 = "TA2017";

            // console.log("string 1 = " + str1);
            // console.log("string 2 = " + str2);
            // console.log("string 3 = " + str3);
            // console.log("string 4 = " + str4);

            var stringConcat = str1.concat(str2, str3, str4);

            // console.log("string concat = " + stringConcat);

            var sortAlphabets = function(stringConcat) {
            return stringConcat.split('').sort().join('');
            };

            var keySort = sortAlphabets(stringConcat);

            // console.log("string concat sorted = " + keySort);

            //var shakeySort = sha1(keySort);

            console.log("KEY >>>> " + keySort);

            var e = xxtea.decryptToString(db_message_plain,keySort);
            console.log("PLAINTEXT >>>> " + e);
            
            var getTime = '' + rows[0].msg_time;
            var time = getTime.substr(0,24);
            global.viewOutbox2 = {
                'msg_id'     : rows[0].msg_id,
                'msg_source' : rows[0].msg_source,
                'msg_plain'  : e,
                'msg_time'   : time,
                'msg_target' : rows[0].msg_target
            }
            viewOutbox.push(viewOutbox2);

            var viewAttachment = [];
            var query2 = "SELECT * FROM ?? WHERE ?? = ?";
            var table2 = ["file_upload", "msg_id", req.params.msg_id];
            query2     = mysql.format(query2,table2);
            // console.log(query2);

            connection.query(query2,function(err,rows){
                if(err) {
                    res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                } else {
                    // console.log("MASUK GAAAAAAA");

                    if(rows[0]) {
                        global.viewAttachment2 = {
                            'id_file'  : rows[0].id_file,
                            'path_file'  : rows[0].path_file,
                            'size_file'  : rows[0].size_file
                        }
                        viewAttachment.push(viewAttachment2);

                        console.log('file = ' + viewAttachment2);

                        res.render('viewOutbox', {
                            'viewOutbox': viewOutbox,
                            'viewAttachment' : viewAttachment,
                            'login': req.session.pisang.user_email
                        });  
                    }

                    res.render('viewOutbox', {
                    'viewOutbox': viewOutbox,
                    'viewAttachment' : viewAttachment,
                    'login': req.session.pisang.user_email
                    }); 
                }
            });  
        }  
    });
});

router.get("/download/:id_file", require('../middleware/auth.js'), function(req,res){
    // console.log("MASUK FUNGSI GET /DOWNLOAD");
    console.log('download file = ' + viewAttachment2);

    var path = require('path');
    var mime = require('mime');

    var file = __dirname + '/..' + viewAttachment2.path_file;

    res.download(file);
});

module.exports = router;
