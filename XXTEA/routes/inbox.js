var express     = require('express');
var mysql       = require('mysql');
var router      = express.Router();
var connection  = require('../database.js');
var rc4         = require('arc4');
var xxtea       = require('../xxtea/xxtea.js');
var md5         = require('md5');
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
            const db_message_plain = rows[0].msg_plain;
            /*Modul For Decrypt By Key*/

            const key_from_sender_db = rows[0].key_sender;

            console.log("KEY :: >>>> "+key_from_sender_db);
            key = key_from_sender_db;
            
            str1 = rows[0].msg_source;
            str2 = rows[0].msg_target;
            str3 = moment(rows[0].msg_time).format("YYYY-MM-DD HH:mm:ss");
            str4 = "TA2017";

            console.log("string 1 = " + str1);
            console.log("string 2 = " + str2);
             console.log("string 4 = " + str4);

            var stringConcat = str1.concat(str2, str3, str4);

            console.log("string concat = " + stringConcat);

            var sortAlphabets = function(stringConcat) {
            return stringConcat.split('').sort().join('');
            };

            var keySort = sortAlphabets(stringConcat);

            console.log("string concat sorted = " + keySort);

            var md5keySort = md5(keySort);

            console.log("string concat sorted and hashed = " + md5keySort);

            var e = xxtea.decryptToString(db_message_plain,md5keySort);
            /*End Of Modul*/

            var getTime = '' + rows[0].msg_time;
            var time = getTime.substr(0,24);
            global.viewInbox2 = {
                    'msg_id'     : rows[0].msg_id,
                    'msg_source' : rows[0].msg_source,
                    'msg_plain'  : e,
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
                            'login': 'admin4@gmail.com'
                        }); 
                    }

                    res.render('viewInbox', {
                    'viewInbox': viewInbox,
                    'viewAttachment' : viewAttachment,
                    'login': 'admin4@gmail.com'
                    });

                    } 
                
            });
        }  
    });

}).post("/viewInbox", require('../middleware/auth.js'), function(req, res, next){
    console.log("MASUK POST VIEWINBOX 1");
    myDate =  moment().format("YYYY-MM-DD HH:mm:ss");

    str1vi = req.session.pisang.user_email;
    str2vi = viewInbox2.msg_source;
    str3vi = myDate;
    str4vi = "TA2017";

    console.log("string 1 = " + str1vi);
    console.log("string 2 = " + str2vi);
    console.log("string 3 = " + str3vi);
    console.log("string 4 = " + str4vi);

    var stringConcat = str1vi.concat(str2vi, str3vi, str4vi);

    console.log("string concat = " + stringConcat);

    var sortAlphabets = function(stringConcat) {
    return stringConcat.split('').sort().join('');
    };

    var keySort = sortAlphabets(stringConcat);

    console.log("string concat sorted = " + keySort);

    var md5keySort = md5(keySort);

    console.log("string concat sorted and hashed = " + md5keySort);

    str = req.body.msg_plain;
    key = md5keySort;
    const db_message_plain = req.body.msg_plain;
    var d = xxtea.encryptToString(str,key);

    console.log("KEY COMPOSE : "+key);
    console.log("Plain TEXT  : " +req.body.msg_plain);
    console.log("HEXXX ->>>>>>>>> : "+String(d));

    var d = xxtea.encryptToString(str,key);
    var query  = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
    var table  = ["message","msg_source","msg_target","msg_plain","msg_time",str1vi,str2vi,d,myDate];
    query2  = mysql.format(query,table);
    
    console.log(query2);
    console.log(table)
    console.log("MASUK POST VIEWINBOX 4");

    connection.query(query2,function(err,rows,fields){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            console.log("ERROR EXECUTING MYSQL QUERY");
        } else {
            console.log("MASUK POST VIEWINBOX 5");
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