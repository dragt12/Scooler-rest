var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var userCodes=require('../models/user_codes');
var randomstring=require('randomstring');
router.get('/show/:teacherId', function(req,res,next){
  User.findById(req.params.teacherId, function(err,result){
    if(result){
      res.json({'classes':result.classes});
    }
  })
});
router.get('/create/:className/:schoolId', function(req,res,next){
  var new_class=new Class();
  new_class.class_name=req.params.className;
  new_class.school=req.params.schoolId;
  School.findOne({school_key:req.params.schoolId}, function(err,result){
    result.classes.push(req.params.className);
    result.save(function(err,result){
      if(!err){
        new_class.save(function(err,saved){res.status(200).send()});
      }
    })
  })
  
})
router.get('/setTeacher/:id/:className', function(req,res,next){
  User.findById(req.params.id, function(err,result){
    result.classes.push(req.params.className);
    result.save(function(err,result){res.status(200).send();})
  })
})
router.get('/removeTeacher/:id/:className', function(req,res,next){
  User.findById(req.params.id, function(err,result){
    if(result){
        var index = result.classes.indexOf(req.params.class_name);
        result.classes.splice(index,1);
        result.save(function(err,result){res.status(200).send();});
    } else {
        res.status(600).send();
    }
  });
})
router.get('/remove/:id/:className/:schoolId', function(req,res,next){
    var teachersId = JSON.parse(req.params.id);
    Class.remove({'class_name':req.params.className, 'school':req.params.schoolId}, function(err,removed){});
    teachersId.forEach(function(element) {
        User.findById(element, function(err,result){  
            var index = result.classes.indexOf(req.params.class_name);
            if(index!=-1){
                result.classes.splice(index,1);
                result.save(function(err,result){});
            } else {}
    })
    }, this);
    res.status(200).send();
  });


router.post('/changeStudents',function(req,res,next){
  Class.findOne({'class_name':req.body.class_name, 'school':req.body.key_code}, function(err,result){
    if(result){
      console.log(result.class_name);
      result.students=req.body.students;
      console.log(result);
      result.save().then(function(err,result){res.status(200).send();});
    } else {
        res.status(600).send();
    }
  })
})
router.get('/get/:className/:schoolId', function(req,res,next){
  Class.findOne({'class_name':req.params.className, 'school':req.params.schoolId}, function(err,result){
    console.log(result);
    res.json(result);
  });
})
module.exports=router;