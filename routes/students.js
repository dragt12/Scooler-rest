var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var userCodes=require('../models/user_codes');
var Students=require('../models/student');
var randomstring=require('randomstring');
router.get('/addPoints/:name/:schoolId', function(req,res,next){
    Students.find({name:req.params.name,school:req.params.schoolId}, function(err,result){
        result.points=result.points + 1;
        result.save(function(err,result){
            res.status(200).send();
        })
    });
});
router.get('/minusPoints/:name/:schoolId', function(req,res,next){
    Students.find({name:req.params.name,school:req.params.schoolId}, function(err,result){
        result.points=result.points - 1;
        result.save(function(err,result){
            res.status(200).send();
        })
    });
});
router.get('/points/:class/:schoolId', function(req,res,next){
    Students.find({'class':req.params.class, 'school':req.params.schoolId}, "points", function(err,result){
        res.status(200).send(result);
    })
})
module.exports=router;