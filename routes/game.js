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
scheduler.scheduleJob('* * 0 * * *', function(){
    console.log('Abcd');
})
router.get('/upgrade/:buildingName/:id', function(req,res,next){
    
})
module.exports=router;