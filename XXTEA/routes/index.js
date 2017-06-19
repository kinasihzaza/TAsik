var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = require('../database.js');

    router.get("/",function(req,res){
        //console.log("MASUK FUNGSI GET /");
        res.render('index');
    });


    router.get("/login", function(req, res){
        console.log(req.session);
        //console.log("MASUK FUNGSI GET /LOGIN");
        res.render('login');
        req.session.pisang = "login";

    }).post("/login", function(req, res){
        var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
        var table = ["user","user_email",req.body.email,"user_password",req.body.password];
        query = mysql.format(query,table);

        connection.query(query,function(err,rows){

            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else if(rows.length){
                req.session.pisang = rows[0];
                res.redirect("/inbox");
            }
            else {
                res.redirect("/login");
            }
        });
    }); 

    router.get('/logout', function(req, res) {
        if (!req.session.pisang) {
            res.redirect('/login');
        } else {
            req.session.pisang = null;
            var response = {
                code: 200,
                msg: 'Logout Successfully!'
            };
            req.session.response = response;
            res.redirect('/login');
        }
    });

module.exports = router;