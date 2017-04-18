var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
  title: {type:String, required:true},
  content: {type:String, required:true},
  //author: {type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  author: {type:String},
  views: {type:Number, default: 0},
  numId: {type:Number, required:true},
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});

questionSchema.methods.getCreatedDate = function () {
  var date = this.createdAt;
  return date.getFullYear() + "-" + get2digits(date.getMonth()+1)+ "-" + get2digits(date.getDate());
};

questionSchema.methods.getCreatedTime = function () {
  var date = this.createdAt;
  return get2digits(date.getHours()) + ":" + get2digits(date.getMinutes())+ ":" + get2digits(date.getSeconds());
};
function get2digits(num){
  return ("0" + num).slice(-2);
}
var Question = mongoose.model('question',questionSchema);
module.exports = Question;
