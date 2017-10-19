var express = require('express');
var passport=require('passport');
var router = express.Router();
var School=require('../models/school');
var User=require('../models/teacher');
var Class=require('../models/class');
var userCodes=require('../models/user_codes');
var Student=require('../models/student');
var randomstring=require('randomstring');
var scheduler=require('node-schedule');
scheduler.scheduleJob('0 * * * * *', function(){
    Student.find({}, function(err, result){
        result.forEach(function(element){
            var students=element.buildings['class']*10+20;
            var happiness=0;
            if(element.buildings['class']<=element.buildings['cantine']){
                happiness=1;
            } else if(element.buildings['class']<=element.buildings['cantine']+2){
                happiness=0.5;
            }
            var teachers=0;
            if(element.buildings['class']<=element.buildings['teachers']){
                teachers=1;
            }
            var trophys=students*10/100;
            trophys+=trophys*happiness*20/100;
            trophys+=trophys*teachers*10/100;
            
            element.trophy+=trophys;
            element.save(function(err){});
        })
        console.log(result);
        
    })
})
router.get('/upgrade/:buildingName/:id', function(req,res,next){
    Student.findById(req.params.id, function(err,result){
        if(req.params.buildingName=='director'){
            result.buildings['director']++;
            result.save(function(err){
                res.status(200).send();
            })
        } else {
            Object.keys(result.buildings).forEach(function(element){
                if(element==req.params.buildingName){
                    var neededPoints=result.buildings[element]*10+20;
                    console.log(neededPoints);
                    if(result.points>=neededPoints && result.buildings[element]+1<=result.buildings['director']){
                        result.buildings[element]++;
                        result.points-=neededPoints;
                        result.save(function(err){
                            res.status(200).send();
                        })
                    } else {
                        res.status(600).send();
                    }
                }
            });
        }
        
    });
})
router.get('/buildable/:id', function(req,res,next){
    Student.findById(req.params.id, function(err,result){
        if(result){
            var returnArray=[];
            Object.keys(result.buildings).forEach(function(element){
                var neededPoints=result.buildings[element]*10+20;
                if(result.points>neededPoints && element!="$init"){
                    if(element!='director'){
                        if(result.buildings[element]+1<=result.buildings['director']){
                            returnArray.push(element);
                        }
                    } else {
                         returnArray.push(element);
                    }
                }
            });
            res.status(200).send(returnArray);
        } else {
            res.status(600).send();
        }
        
    })
});
router.get('/ranking/:field/:schoolId', function(req,res,next){
    Student.find({school:req.params.schoolId}).sort(req.params.field).exec(function(err,result){
        res.status(200).send(result);
    });
});
module.exports=router;