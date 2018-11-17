var express     = require("express"),
    Box         = require("../models/box.js"),
    User        = require("../models/user.js"),
    Text        = require("../models/planModels/text.js"),
    Time        = require("../models/planModels/time.js");

var router = express.Router();

router.get("/", function(req, res){
    var username = req.user.username;
    User.find({username: username}, function(err, user){
        if(err) {
            console.log(err);
        } else {
            Box.find({author : user[0]._id}).populate("text").populate("time").exec(function(err, box){
              if(err) {
                  console.log(err);
              } else {
                  res.render("main", {user: user, box: box});
              }
            // Box.find({author:user[0]._id}, function(err, box){
            //     if(err) {
            //         console.log(err);
            //     } else {
            //         res.render("main", {user:user, box:box});
            //     }
            //     });
            });
        }
    });
});

// router.post("/box", function(req, res){
//     var username = req.user.username;
//     User.find({username: username}, function(err, user){
//       if(err) {
//           console.log(err);
//       } else {
//           Box.find( { author: user[0]._id } ).count(function(err, count){
//               if(err) {
//                   console.log(err);
//               } else if(count === 0){
//                   var newBox = new Box({author: user[0]._id, boxNumber: 0});
//                   newBox.save();
//               } else if(count !== 0){
//                   var newBox = new Box({author: user[0]._id, boxNumber: count});
//                   newBox.save();
//               }
//           });
//       }
//     });
//     res.redirect("/");
// });


router.post("/box", function(req, res){
    var username = req.user.username;
    User.find({username: username}, function(err, user){
       if(err) {
           console.log(err);
       } else {
           Box.find( { author: user[0]._id }, function(err, box){
               if(err) {
                   console.log(err);
               } else {
                   var newBox = new Box({author: user[0]._id, boxName: req.body.boxName});
                   newBox.save(function(err){
                       if(err) {
                           console.log(err);
                       } else {
                           Box.find({author: user[0]._id}, function(err, newBoxes){
                              if(err) {
                                  console.log(err);
                              } else {
                                  newBoxes = JSON.stringify(newBoxes);
                                  newBoxes = "{\"boxes\":" + newBoxes + "}";
                                  res.send(newBoxes);
                              }
                           });
                       }
                   });
               }
           });
       }
    });
});

// {
//               if(err) {
//                   console.log(err);
//               }
//               var newBox = new Box({author: user[0]._id, boxNumber: count});
//               newBox.save(function(err){
//                   if(err) {
//                       console.log(err);
//                   } else {
//                       Box.find({author: user[0]._id}, function(err, newBox){
//                           if(err) {
//                               console.log(err);
//                           } else {
//                               var newBoxes = JSON.stringify(newBox);
//                               newBoxes = "{\"boxes\":" + newBoxes + "}";
//                               res.send(newBoxes);
//                   }
//               });
//                   }
//               });
               
//           }

router.get("/box", function(req, res){
    var username = req.user.username;
    User.find({username: username}, function(err, user){
       if(err) {
           console.log(err);
       } else {
               Box.find({author: user[0]._id}, function(err, Box){
                   if(err) {
                       console.log(err);
                   } else {
                       var Boxes = JSON.stringify(Box);
                       Boxes = "{\"boxes\":" + Boxes + "}";
                       res.send(Boxes);
                   }
               });
       }
    });
});

router.delete("/box", function(req, res){
    var username = req.user.username;
    var boxId = req.body.boxid;
    
    User.find({username: username}, function(err, user){
       if(err) {
           console.log(err);
       } else {
                Text.deleteMany({boxid: boxId}, function(err){
                    if(err){
                        console.log(err);
                    } else {
                        Box.deleteOne({_id : boxId}, function(err){
                        if(err){
                            console.log(err);
                        }
                        else {
                            Box.find({author: user[0]._id}, function(err, Box){
                            if(err) {
                                console.log(err);
                            } else {
                                var Boxes = JSON.stringify(Box);
                                Boxes = "{\"boxes\":" + Boxes + "}";
                                res.send(Boxes);
                            }
                            });  
                            }
                        });
                        }
                });
            }
    });
    // var username = req.user.username;
    // User.find({username: username}, function(err, use){
    //   if(err) {
    //       console.log(err);
    //   } else {
           
    //   }
    // });
});


//box Content Router
router.post("/box/text", function(req, res){
    var username = req.user.username;
    var boxId = req.body.boxid;
    var text = req.body.text;
    User.find({username: username}, function(err, user){
        if(err) {
            console.log(err);
        } else if(text !== undefined){
            var newText = new Text({author:user[0]._id, text: text, boxid: boxId});
            newText.save(function(err){
                if(err){
                    console.log(err);
                } else {
                    Text.find({author:user[0]._id}, function(err, texts){
                       if(err) {
                           console.log(err);
                       } else {
                           var sendingText = JSON.stringify(texts);
                           sendingText = "{\"texts\":" + sendingText + "}";
                           res.send(sendingText);
                       }
                    });
                }
            });
        } else {
            Text.find({author:user[0]._id}, function(err, texts){
                if(err){
                    console.log(err);
                } else {
                    var sendingText = JSON.stringify(texts);
                    sendingText = "{\"texts\": "+ sendingText+"}";
                    res.send(sendingText);
                }
            });
        }
    });
});
router.delete("/box/text", function(req, res){
    var username = req.user.username;
    var textid = req.body.textid;
    
    User.find({username: username}, function(err, user){
        if(err) {
            console.log(err);
        } else {
            Text.deleteOne({_id: textid}, function(err){
                if(err) {
                    console.log(err);
                } else {
                    Text.find({author:user[0]._id}, function(err, texts){
                        if(err){
                            console.log(err);
                        } else {
                            var sendingText = JSON.stringify(texts);
                            sendingText = "{\"texts\": "+ sendingText+"}";
                            res.send(sendingText);
                        }
                    });
                }
            })
        }
    })
});


module.exports = router;