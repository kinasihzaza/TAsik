var express    = require('express');
var mysql      = require('mysql');
var router     = express.Router();
var connection = require('../database.js');
var formidable = require('formidable');
var path       = require('path');  
var fs         = require('fs-extra');  
var multer     = require('multer');
var sha1        = require('sha1');
var xxtea      = require('../xxtea/xxtea.js');
var moment     = require('moment');


router.get('/compose', require('../middleware/auth.js'), function(req, res){
    //console.log("MASUK FUNGSI GET /COMPOSE");

    var date = moment().format("YYYY-MM-DD HH:mm:ss");

    res.render('compose', {
            'login': req.session.pisang.user_email,
            'date': date
    });

}).post("/compose", multer({ dest: './img/'}).single('fileUploaded'),function(req, res){
    
    var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
    var table = ["message","msg_source","msg_target","msg_plain","msg_time",req.session.pisang.user_email,req.body.msg_target, req.body.msg_plain, req.body.msg_time];
    query = mysql.format(query,table);
    //console.log("DI BAWAH QUERY");
    //console.log(query);

    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : "Error executing MySQL query"});
        } else {
            //console.log("MASUK FUNGSI POST /UPLOAD");
            //console.log(rows.insertId);

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
                            //console.log(rows);
                        }
                    });
                });
            }

            res.redirect("/inbox");
        }
    });
}); 

router.get('/new', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
