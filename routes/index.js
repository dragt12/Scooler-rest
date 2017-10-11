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
router.get('/teacher/register', function(req,res,next){
  var messages=req.flash('error');
  console.log(messages);
  res.render('teacher/register', {messages:messages, hasErrors: messages.length>0});
});
router.post('/teacher/login', passport.authenticate('local.signin'), function(req,res,next){
  res.json({'id': req.user.id, 'email':req.user.email});
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
router.post('/teacher/register', passport.authenticate('local.signup'),function(req,res,next){
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
              new_result.school=req.body.school_id;
              new_result.save(function(err,result){
                 res.status(200).send({'id': req.user.id, 'email': req.user.email, 'name':req.body.name});
              })
            })
          })
        }
    });
});
router.get('/school/generate/:szkola/:teachers', function(req,res,next){
  var school=req.params.szkola;
  var teachers = JSON.parse(req.params.teachers);
  console.log(teachers)
  var returnArray=[];
  School.find({school_name:school}, function(err,result){
    console.log(result);
    
    if(!result.length){
      var new_school= new School();
      new_school.school_name = school;
      teachers.forEach(function(element) {
        var keyCode=randomstring.generate(10);
        var keyPass=randomstring.generate(5)
        var teacher_code=new userCodes();
        teacher_code.name=element;
        teacher_code.key_code=keyCode;
        teacher_code.key_pass=keyPass;
        teacher_code.key_type='teacher';
        teacher_code.save();
        returnArray.push({'teacher_name': element.name, 'key_code':keyCode, 'key_pass': keyPass});
        new_school.teachers.push({'name':element});
      }, this);
      new_school.save(function(err,result){
        res.send(returnArray);
      });
      
    } else {
      res.status(500);
    }
  })
});
//router.get()
router.get('/showClasses/:teacherId', function(req,res,next){
  User.findById(req.params.teacherId, function(err,result){
    if(result){
      res.json({'classes':result.classes});
    }
  })
})
router.get('/createClass/:className/:schoolId', function(req,res,next){
  var new_class=new Class();
  new_class.class_name=req.params.className;
  new_class.school=req.params.schoolId;
  new_class.save(function(err,saved){res.status(200).send()})
})
router.get('/setClass/:id/:className', function(req,res,next){
  User.findById(req.params.id, function(err,result){
    result.classes.push(req.params.className);
    result.save(function(err,result){res.status(200).send();})
  })
})
router.get('/removeTeacher/:id/:className', function(req,res,next){
  User.findById(req.params.id, function(err,result){
    var index = result.classes.indexOf(req.params.class_name);
    result.classes.splice(index,1);
    result.save(function(err,result){res.status(200).send();});
  });
})
router.get('/removeClass/:id/:className/:schoolId', function(req,res,next){
  User.findById(req.params.id, function(err,result){  
    Class.remove({'class_name':req.params.className, 'school':req.params.schoolId}, function(err,removed){
      var index = result.classes.indexOf(req.params.class_name);
      if(index!=-1){
        result.classes.splice(index,1);
        result.save(function(err,result){res.status(200).send();});
      }
    })
  });
});
router.post('/admin/login', function(req,res,next){
    userCodes.findOne({'key_code':req.body.key_code, 'key_pass': req.body.key_pass, 'key_type':'teacher'}, function(err,result){
      if(result){
        Class.find({'school':req.body.key_code}, function(err, result){
          User.find({"school":req.body.key_code}, function(err,teachers){
            res.status(200).json({'classes':result, 'school_id':req.body.school_id, 'teacher':teachers});
          })
        })

      }
    });
});
router.post('/class/changeStudents',function(req,res,next){
  Class.findOne({'class_name':req.body.class_name, 'school':req.body.key_code}, function(err,result){
    if(result){
      console.log(result[0].class_name);
      result[0].students=req.body.students;
      console.log(result);
      //result.save().then(function(err,result){res.status(200).send();});
    }
  })
})
router.get('/getClass/:className/:schoolId', function(req,res,next){
  Class.find({'class_name':req.params.class_name, 'school':req.params.school_id}, function(err,result){
    res.json(result);
  });
})
module.exports = router;
