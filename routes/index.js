var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var userCodes=require('../models/user_codes');
var student=require('../models/student')
var randomstring=require('randomstring');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/number/school', function(req,res,next){
  School.count({},function(err,result){
    res.json({'number':result})
  })
})
router.get('/number/students', function(req,res,next){
  student.count({},function(err,result){
    res.json({'number':result})
  })
})
router.post('/test',function(req,res,next){res.status(200).send();})
module.exports = router;
