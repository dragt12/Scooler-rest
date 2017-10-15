var mongoose=require('mongoose');
var schema=mongoose.Schema;
var school=new schema({
    school_name:{type:String, require:true},
    school_key:{type:String, require:true},
    school_pass:{type:String, require:true},
    teachers:{type:Array, require:false, default:[]},
    classes:{type:Array, require:false, default:[]},
    students:{type:Array, require:false, default:[]}
});
module.exports=mongoose.model('School', school);