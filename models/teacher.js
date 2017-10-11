var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt-nodejs');
var userschema=new Schema({
	email:{type:String, required:true},
    password:{type:String, required:true},
    name:{type:String, required:false},
    school:{type:String, required:false},
    classes:{type:Array, default:[]}
});
userschema.methods.encryptPassword = function(password)
{
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
userschema.methods.validPassword=function(password)
{
	return bcrypt.compareSync(password, this.password);
}
module.exports=mongoose.model('User', userschema);