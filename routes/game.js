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
            
            element.trophy+=Math.round(trophys);
            element.save(function(err){});
        })
        console.log(result);
        
    })
})
router.get('/upgrade/:buildingName/:id', function(req,res,next){
    Student.findById(req.params.id, function(err,result){
        if(req.params.buildingName=='director'){
            var neededPoints=result.buildings['director']*2+2;
            result.buildings['director']++;
            result.points-=neededPoints;
            result.xp+=neededPoints;
            while(result.xp>=result.lvl*10){
                result.lvl++;
                result.xp-=result.lvl*10;
            }
            result.save(function(err){
                res.status(200).send();
            })
        } else {
            Object.keys(result.buildings).forEach(function(element){
                if(element==req.params.buildingName){
                    var neededPoints=result.buildings[element]*2+2;
                    console.log(neededPoints);
                    if(result.points>=neededPoints && result.buildings[element]+1<=result.buildings['director']){
                        result.buildings[element]++;
                        result.points-=neededPoints;
                        result.xp+=neededPoints;
                        while(result.xp>=result.lvl*10){
                            result.lvl++;
                            result.xp-=result.lvl*10;
                        }
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
/*router.get('/buildable/:id', function(req,res,next){
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
});*/
router.get('/ranking/:field/:schoolId', function(req,res,next){
    Student.find({school:req.params.schoolId}).sort(req.params.field).exec(function(err,result){
        res.status(200).send(result);
    });
});
router.get('/ranking/:field/:className/:schoolId', function(req,res,next){
    Student.find({school:req.params.schoolId, class:req.params.className}).sort(req.params.field).exec(function(err,result){
        res.status(200).send(result);
    })
});
function isBuildable(director_level, building_level, building_cost, points){
    if(points>=building_cost && building_level+1>=director_level){
        return true;
    } return false;
}
router.get('/data/:id', function(req,res,next){
    Student.findById(req.params.id, function(err,result){
        if(result){
            var buildable=[];
            var trophy=result.trophy;
            var points=result.points;
            var exp=result.xp;
            var lvl=result.lvl;
            var building_levels=result.buildings;
            Object.keys(building_levels).forEach(function(element){
                var cost=building_levels[element]*2+2;
                if(element!='$init'){
                    if(element!='director'){
                        var isBuild=isBuildable(building_levels['director'], building_levels[element], cost, points)
                        if(isBuild){
                            buildable.push({[element]:cost, 'buildable':true});
                        } else {
                            buildable.push({[element]:cost, 'buildable':false});
                        }
                    } else {
                        if(points>=cost){
                            buildable.push({'director':cost, "buildable":true});
                        } else {
                            buildable.push({'director':cost, "buildable":false});
                        }
                    }
                }
                
            },this)
            var returnJSON={'trophy':trophy, 'points':points, 'buildings':buildable, 'exp':exp, 'lvl':lvl};
            res.status(200).send(returnJSON);
        } else {
            res.status(600).send();
        }
    })
})
module.exports=router;