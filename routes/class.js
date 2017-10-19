var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var Student=require('../models/student');
var userCodes=require('../models/user_codes');
var randomstring=require('randomstring');
router.get('/show/:name/:schoolId', function(req,res,next){
  User.findOne({name:req.params.name, school:req.params.schoolId}, function(err,result){
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
router.get('/setTeacher/:name/:schoolId/:className', function(req,res,next){
  User.findOne({name:req.params.name, school:req.params.schoolId}, function(err,result){
    result.classes.push(req.params.className);
    result.save(function(err){
        res.status(200).send();
    });
  })
})
router.get('/removeTeacher/:name/:schoolId/:className', function(req,res,next){
  User.findOne({name:req.params.name, school:req.params.schoolId}, function(err,result){
    if(result){
        var index = result.classes.indexOf(req.params.className);
        result.classes.splice(index,1);
        result.save(function(err){
          res.status(200).send();
        });
    } else {
        res.status(600).send();
    }
  });
})
router.get('/remove/:name/:className/:schoolId', function(req,res,next){
    var teachersId = JSON.parse(req.params.name);
    Class.remove({'class_name':req.params.className, 'school':req.params.schoolId}, function(err,removed){});
    teachersId.forEach(function(element) {
        User.find({name:element, school:req.params.schoolId}, function(err,result){  
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
      var beforeResult = result.students;
      var returnArray=calculateDeltaCode(beforeResult, req.body.students, req.body.class_name, req.body.key_code);
      result.students=returnArray;
      result.save(function(err){
          res.status(200).send(returnArray);
    });
    } else {
        res.status(600).send();
    }
  })
})
router.get('/get/:className/:schoolId', function(req,res,next){
  Class.findOne({'class_name':req.params.className, 'school':req.params.schoolId}, function(err,result){
    //Students.find({'class':req.params.className, 'school':})
    console.log(result);
    res.json(result);
  });
})
router.get('/getAppended/:teacherName/:schoolId', function(req,res,next){
    User.findOne({'name':req.params.teacherName, 'school':req.params.schoolId}, function(err,result){
        res.send(result.classes);
    })
})
function calculateDeltaCode(oldStudents, students, className, schoolId){
  console.log(students);
  console.log(oldStudents);
  var returnArray=oldStudents;
  var oldNames=oldStudents.map(function(a) {return a.name;});
  students.forEach(function(element) {
    if(!oldNames.includes(element)){
        var keyCode=randomstring.generate(15);
        var keyPass=randomstring.generate(10);
        var key=new userCodes();
        key.name=element;
        key.key_code=keyCode;
        key.key_pass=keyPass;
        key.key_type='student';
        key.school=schoolId;
        key.class=className;
        key.save();
        returnArray.push({"name": element, "login_code":keyCode, "login_pass":keyPass});
    }
  }, this);
  returnArray.forEach(function(element){
      if(!students.includes(element.name)){
        
        Student.remove({name: element.name, class:className, school:schoolId}, function(err,result){})
        userCodes.remove({name: element.name, class:className, school:schoolId}, function(err,result){});
        
        var json={"name": element.name, "login_code":element.login_code, "login_pass":element.login_pass};
        returnArray.forEach(function(element, index){
            if(JSON.stringify(element)==JSON.stringify(json)){
                returnArray.splice(index,1);
            }
        })
    }
  })
  return returnArray;
}
module.exports=router;