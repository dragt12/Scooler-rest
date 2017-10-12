var mongoose = require('mongoose');
var schema=mongoose.Schema;
var user_key=new schema({
    name:{type:String, required:false},
    key_code:{type:String, required:true},
    key_pass:{type:String, required:true},
    key_type:{type:String, required:true},
    teacher:{type:String, required:false},
    school:{type:String, required:false}
});
module.exports=mongoose.model('userCode', user_key);