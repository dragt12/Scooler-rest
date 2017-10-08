var mongoose = require('mongoose');
var schema=mongoose.Schema;
var user_key=new schema({
    name:{type:String, require:true},
    key_code:{type:String, require:true},
    key_pass:{type:String, require:true}
});
module.exports=mongoose.model('userCode', user_key);