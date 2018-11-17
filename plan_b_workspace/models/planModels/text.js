var mongoose           = require("mongoose");

var textSchema   = new mongoose.Schema({
    author: String,
    priority: Number,
    text: String,
    textType: String,
    boxid: String
});

module.exports  =  mongoose.model("Text", textSchema);