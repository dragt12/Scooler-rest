var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var userCodes=require('../models/user_codes');
var randomstring=require('randomstring');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
    key.key_type='student';
    key.teacher=req.body.id;
    key.save();
    returnArray.push({'name': element, 'login_code':keyCode, 'login_pass':keyPass});
  }, this);
  res.json(returnArray);
});
//router.get()

module.exports = router;
