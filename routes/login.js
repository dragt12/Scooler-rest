var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var userCodes=require('../models/user_codes');
var randomstring=require('randomstring');
router.post('/teacher', passport.authenticate('local.signin'), function(req,res,next){
  res.json({'id': req.user.id, 'email':req.user.email});
});
router.post('/admin', function(req,res,next){
    School.findOne({school_key:req.body.key_code, school_pass: req.body.key_pass}, function(err,result){
      console.log(result);
      if(result){
        res.status(200).json({'school_id':req.body.key_code});
      } else {
        res.status(600).send();
      }
    });
});
module.exports=router;