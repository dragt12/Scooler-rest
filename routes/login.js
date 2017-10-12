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
        Class.find({'school':req.body.key_code}, function(err, result){
          User.find({school : req.body.key_code}, function(err,teachers){
            res.status(200).json({'classes':result, 'school_id':req.body.key_code, 'teacher':teachers});
          })
        })

      }
    });
});
module.exports=router;