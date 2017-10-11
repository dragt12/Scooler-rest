var mongoose=require('mongoose');
var schema=mongoose.Schema;
var cls=new schema({
    class_name:{type:String, require:true},
    students:{type:Array, require:false, default:[]},
    school:{type:String, require:true}
});
module.exports=mongoose.model('class', cls);