var mongoose=require('mongoose');
var schema=mongoose.Schema;
var school=new schema({
    school_name:{type:String, require:true},
    teachers:{type:Array, require:false, default:[]}
});
module.exports=mongoose.model('School', school);