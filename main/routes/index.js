var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/user');
var userCodes=require('../models/user_codes');
var randomstring=require('randomstring');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/teacher/register', function(req,res,next){
  var messages=req.flash('error');
  console.log(messages);
  res.render('teacher/register', {messages:messages, hasErrors: messages.length>0});
});
router.post('/teacher/generate_codes', function(req,res,next){
  var students=req.body.students;
  console.log(students);
  var returnArray=[];
  students.forEach(function(element) {
    var keyCode=randomstring.generate(15);
    var keyPass=randomstring.generate(10);
    var key=new userCodes();
    key.name=element;
    key.key_code=keyCode;
    key.key_pass=keyPass;
    key.save();
    returnArray.push({'name': element, 'login_code':keyCode, 'login_pass':keyPass});
  }, this);
  res.json(returnArray);
});
router.post('/teacher/register', passport.authenticate('local.signup'),function(req,res,next){
    School.findOne({'school_code':req.body.school_id, 'school_pass': req.body.school_pass}, function(err,result){
      console.log(result);  
      if(!result){
          console.log(req.user.id);
          User.remove({'_id':req.user.id}, function(err,remove){
            if(!err){
              req.logout();
              req.flash('error', 'Bad school key/school pass');
              res.redirect('/teacher/register'); 
            }
          }); 
        } else {
          result.teachers.push({'email':req.user.email, 'id':req.user.id});
          result.save(function(err,result){
            res.redirect('/');
          })
        }
    });
});
router.get('/school/generate/:szkola', function(req,res,next){
  var school=req.params.szkola;
  var school_code=randomstring.generate(10);
  var school_pass=randomstring.generate(5);
  console.log(school);
  console.log(school_code);
  console.log(school_pass);
  var new_School=new School();
  new_School.school_name=school;
  new_School.school_code=school_code;
  new_School.school_pass=school_pass;
  School.find({school_name:school}, function(err,result){
    console.log(result);
    if(!result.length){
        new_School.save(function(err,result){
          if(err){
            console.log('error');
          } else {
            res.render('index');
          }
        });
    } else {
      res.render('index');
    }
  })
  
});
module.exports = router;
