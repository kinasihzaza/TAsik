var express    = require('express');
var mysql      = require('mysql');
var router     = express.Router();
var connection = require('../database.js');
var formidable = require('formidable');
var path       = require('path');  
var fs         = require('fs-extra');  
var multer     = require('multer');
//var rc4        = require('arc4');
var md5        = require('md5');
var xxtea      = require('../xxtea/xxtea.js');


router.get('/compose', require('../middleware/auth.js'), function(req, res){
    //console.log(req.session);
    console.log("MASUK FUNGSI GET /COMPOSE");
    //req.session.banana = "login";
     res.render('compose', {
            'login': req.session.pisang.user_email
    });

}).post("/compose", multer({ dest: './img/'}).single('fileUploaded'),function(req, res){
    console.log("MASUK FUNGSI POST /COMPOSE");

    str1 = req.session.pisang.user_email;
    str2 = req.body.msg_target;
    str3 = "TA2017";

    console.log("string 1 = " + str1);
    console.log("string 2 = " + str2);
    console.log("string 3 = " + str3);

    var stringConcat = str1.concat(str2, str3);

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

    //console.log("HEXXX ->>>>>>>>> : "+String(e));

    var query = "INSERT INTO ??(??,??,??) VALUES (?,?,?)";
    var table = ["message","msg_source","msg_target","msg_plain",req.session.pisang.user_email,req.body.msg_target,d];
    query = mysql.format(query,table);
    console.log("DI BAWAH QUERY");
    console.log(query);

    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            console.log("MASUK FUNGSI POST /UPLOAD");
            console.log(rows.insertId);

            if (req.file) {
                console.log(req.file);
                fs.rename(req.file.path, './img/'+req.file.filename+ '-' + req.file.originalname, function(err) {
                    var nameFile = req.file.filename+ '-' + req.file.originalname;
                    var pathFile = '/img/'+req.file.filename+ '-' + req.file.originalname;
                    var sizeFile = req.file.size;

                    var query2 = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
                    var table2 = ["file_upload","name_file","path_file","size_file", "msg_id",nameFile, pathFile, sizeFile, rows.insertId];
                    query2     = mysql.format(query2,table2);
                    connection.query(query2,function(err,rows){
                        if(err) {
                            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
                        } else {
                            // res.json({"Error" : false, "Message" : "Success", "Users" : rows});
                            // req.session.pisang = rows;
                            // console.log(req.session);
                            // res.redirect("/inbox");
                            console.log(rows);
                            // console.log("BISA MASUK GA")
                        }
                    });
                });
            }

            res.redirect("/inbox");
        }
    });

























    // str=req.body.msg_plain;
    // key=req.body.key_sender;

    // const db_message_plain = req.body.msg_plain;
    // var d = xxtea.encryptToString(str,key);

    // console.log("KEY COMPOSE : "+req.body.key_sender);
    // console.log("Plain TEXT  : " +req.body.msg_plain);
    // console.log("HEXXX ->>>>>>>>> : "+String(d));
    // //console.log("HEXXX ->>>>>>>>> : "+String(e));

    // var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
    // var table = ["message","msg_source","msg_target","key_sender","msg_plain",req.session.pisang.user_email,req.body.msg_target,req.body.key_sender,d];
    // query = mysql.format(query,table);
    // console.log("MASUK FUNGSI POST /COMPOSE");
    // console.log(query);

    // connection.query(query,function(err,rows){
    //     if(err) {
    //         res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    //     } else {
    //         console.log("MASUK FUNGSI POST /UPLOAD");
    //         console.log(rows.insertId);

    //         if (req.file) {
    //             console.log(req.file);
    //             fs.rename(req.file.path, './img/'+req.file.filename+ '-' + req.file.originalname, function(err) {
    //                 var nameFile = req.file.filename+ '-' + req.file.originalname;
    //                 var pathFile = '/img/'+req.file.filename+ '-' + req.file.originalname;
    //                 var sizeFile = req.file.size;

    //                 var query2 = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
    //                 var table2 = ["file_upload","name_file","path_file","size_file", "msg_id",nameFile, pathFile, sizeFile, rows.insertId];
    //                 query2     = mysql.format(query2,table2);
    //                 connection.query(query2,function(err,rows){
    //                     if(err) {
    //                         res.json({"Error" : true, "Message" : "Error executing MySQL query"});
    //                     } else {
    //                         // res.json({"Error" : false, "Message" : "Success", "Users" : rows});
    //                         // req.session.pisang = rows;
    //                         // console.log(req.session);
    //                         // res.redirect("/inbox");
    //                         console.log(rows);
    //                         // console.log("BISA MASUK GA")
    //                     }
    //                 });
    //             });
    //         }

    //         res.redirect("/inbox");
    //     }
    // });
}); 

router.get('/new', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
