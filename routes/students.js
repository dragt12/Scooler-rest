var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var userCodes=require('../models/user_codes');
var Students=require('../models/student');
var randomstring=require('randomstring');
router.get('/addPoints/:name/:class/:schoolId', function(req,res,next){
    Students.findOne({name:req.params.name,class:req.params.class,school:req.params.schoolId}, function(err,result){
        result.points=result.points + 1;
        result.save(function(err,result){
            res.status(200).send();
        })
    });
});
router.get('/minusPoints/:name/:class/:schoolId', function(req,res,next){
    Students.findOne({name:req.params.name,class:req.params.class,school:req.params.schoolId}, function(err,result){
        result.points=result.points - 1;
        result.save(function(err,result){
            res.status(200).send();
        })
    });
});
router.get('/points/:class/:schoolId', function(req,res,next){
    Students.find({'class':req.params.class, 'school':req.params.schoolId}, "name points trophy", function(err,result){
        res.status(200).send(result);
    });
})
router.get('/best/points/:schoolId', function(req,res,next){
    Students.find({school:req.params.schoolId}).select('name points class -_id').sort('points').limit(10).exec(function(err, docs) { res.status(200).json(docs) });
});
router.get('/best/trophy/:schoolId', function(req,res,next){
    Students.find({school:req.params.schoolId}).select('name trophy class -_id').sort('trophy').limit(10).exec(function(err, docs) { res.status(200).json(docs) });
});
router.get('/best/trophy/:class/:schoolId', function(req,res,next){
    Students.find({school:req.params.schoolId, class:req.params.class}).select('name trophy -_id').sort('trophy').limit(10).exec(function(err, docs) { res.status(200).json(docs) });
})
module.exports=router;