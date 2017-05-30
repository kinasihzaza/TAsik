'use strict';
module.exports = function(req,res,next){
	// res.send(req.session.pisang)
    // var x = true;

    if(req.session.pisang) next();
    else {
    	var response = {code:403,msg:"Forbidden Access!"};
		req.session.response = response;
    	res.redirect("/login");
    }
    /*next();*/
};
