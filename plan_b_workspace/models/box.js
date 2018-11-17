var mongoose        =  require("mongoose");
var User            = require("./user.js");
var Text        = require("./planModels/text.js"),
    Time        = require("./planModels/time.js");
    // planCountDown   = require("../models/planModels/countdown.js")
    // planCountUp     = require("../models/planModels/countup.js")
    
var boxSchema = new mongoose.Schema({
    author: {
                type : mongoose.Schema.Types.ObjectId,
                ref: "User"
    },
    boxName: {type: String, default: " "},
    text : [{
             type: mongoose.Schema.Types.ObjectId,
             ref: "Text"
           }],
    time: [{
             type: mongoose.Schema.Types.ObjectId,
             ref: "Time" 
          }]
    
    
});

module.exports = mongoose.model('Box', boxSchema);

