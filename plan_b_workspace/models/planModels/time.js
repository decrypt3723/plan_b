var mongoose           = require("mongoose");

var timeSchema   = new mongoose.Schema({
    priority: Number,
    time: {type: Date},
    description: {type: String},
    timeType: String // it would be countup, countdown or just timestamp
});

module.exports  =  mongoose.model("Time", timeSchema);