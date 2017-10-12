var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var userCodes=require('../models/user_codes');
router.post('/teacher', passport.authenticate('local.signup'),function(req,res,next){
    userCodes.findOne({'key_code':req.body.school_id, 'key_pass': req.body.school_pass, 'key_type':'teacher'}, function(err,result){
      console.log(result);  
      if(!result){
          console.log(req.user.id);
          User.remove({'_id':req.user.id}, function(err,remove){
            if(!err){
              req.logout();
              res.status(401);
            }
          }); 
        } else {
          result.save(function(err,saved){
            User.findById({'_id':req.user.id}, function(err,new_result){
              new_result.name=result.name;
              new_result.school=result.school;
              
              School.findOne({school_key:result.school}, function(err,school){
                school.teachers.push({'name':result.name});
                new_result.save(function(err,saved){
                  result.remove(function(err,result){
                    school.save(function(err,result){
                        res.status(200).send({'id': req.user.id, 'email': req.user.email, 'name':req.body.name});
                    })
                  })
                })
              });
            })
          })
        }
    });
});
router.get('/teacher/register', function(req,res,next){
  var messages=req.flash('error');
  console.log(messages);
  res.render('teacher/register', {messages:messages, hasErrors: messages.length>0});
});
module.exports = router;