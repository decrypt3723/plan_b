var boxes; //Get Boxes and Show them AND keep them in Boxes variable.
var texts;
var currentAvailableTextAmount = 18;
var focusState = 0; //default mode = normal mode = 0



function initPage(){
    return new Promise(function(resolve, reject){
    myAjax("GET", "/main/box", null)
    .then(function(result){
        boxes = JSON.parse(result).boxes;
        return Promise.resolve();
    })
    .then(()=>myAjax("POST", "/main/box/text", null)
    .then(function(result){
        texts = JSON.parse(result).texts;
        return Promise.resolve();
    }))
    .then(()=>resolve());
    });
}


initPage()
.then(()=>boxDisplay())
.then(()=>boxTextDisplay(currentAvailableTextAmount))
.then(()=>{
    boxes.forEach(function(box){
       boxFocusAdd(box._id);
    });
    inputEnterkey(".boxNameInput", addBoxandDisplay); // Box Input에 Enterkey 기능 추가
    
    //Mobile Touch 지원
    $(".boxText").on("touchstart", function(event){
       $(event.currentTarget).find(".boxTextRemove").addClass("boxTextRemoveTouch");
       $(event.currentTarget).find(".boxText p").addClass("boxTextTouch");
    });
    
    $(".boxText").on("touchend", function(event){
       $(event.currentTarget).find(".boxTextRemove").removeClass("boxTextRemoveTouch");
       $(event.currentTarget).find(".boxText p").removeClass("boxTextTouch");
    });
    
    
});

$(".addBox").on("click", addBoxandDisplay);
    

$(".boxRemovingBtn").click(function(){
    var button = $(this);
    var currentBoxId = $(button).data("boxId");
    var data = {'boxid': currentBoxId};
    data = JSON.stringify(data);
    myAjax("POST", "/main/box?_method=DELETE", data)
    .then(result => new Promise(function(resolve, reject){
        boxes = JSON.parse(result).boxes;
        resolve();
    }))
    .then(function(){
        boxDisplay();
        return Promise.resolve();
    })
    .then(()=>boxTextDisplay(currentAvailableTextAmount))
    .then(()=>{
        boxes.forEach(function(box){
            boxFocusAdd(box._id);
        });
    });
});

$("#removeBoxModal").on("show.bs.modal", function(event){
    var button = $(event.relatedTarget);
    var boxid = button.data("boxid");
    var boxName = button.data("boxname");
    var modal = $(this);
    
    modal.find(".modal-title").text(boxName+" 라는 이름의 박스인 거십니다.");
    modal.find(".boxRemovingBtn").data("boxId", boxid);
    //add boxId information 
});


// 박스 컨텐츠 추가 모달

$("#addBoxContentModal").on("hidden.bs.modal", function(event){
    var button = $(event.relatedTarget);
    var boxid = button.data("boxid");
    var modal = $(this);
    var textInput = $("#textBoxContentInput");
    var dateInput = $("#dateBoxContentInput");
    
    textInput.val("");
    dateInput.val("");
});

$("#switchBoxContentInputBtn").on("click", function(event){
    var textInput = $("#textBoxContentInput");
    var dateInput = $("#dateBoxContentInput");
    
    if(dateInput.css("display") == "none"){
        dateInput.css("display", "inline-block");
        textInput.css("display", "none");
        $("#switchBoxContentInputBtn").text("텍스트로 변경");
        textInput.val("");
        dateInput.val("");
    } else {
        dateInput.css("display", "none");
        textInput.css("display", "inline-block");
        $("#switchBoxContentInputBtn").text("날짜로 변경");
        textInput.val("");
        dateInput.val("");
    }
});

//박스 컨텐츠 추가 모달 끝

// page에 box load하는 function
// ajax response 받은 후 실행
function boxDisplay(){
    return new Promise(function(resolve, reject){
        $(".boxContainer").empty();
    
        //insert boxes in container in the page
        boxes.forEach(function(box){
            var boxName = box.boxName;
            
            if(boxName.length > 24){
                boxName = boxName.slice(0, 24) + "...";
            }
            var boxHtmlElement = ""+
                "<div class=\"col-xl-3 col-lg-4 col-md-6 col-12 float-left\">"+
                "<div class=\"plan-container\">"+
                    "<div class=\"boxHeader\">"+
                        "<p class=\"boxName\">"+ boxName +"</p>" +
                    "</div>"+
                    "<div class=\"boxBody\">"+
                        "<div class=\"boxContentInput input-group m-0\">"+
                            "<input type=\"text\" class=\"boxTextInput form-control\" data-boxid=\""+box._id+"\">"+
                            "<div class=\"input-group-prepend\">"+
                                "<button class=\"boxTextInputBtn btn btn-dark\" data-boxid=\""+box._id+"\">Add</button>"+
                            "</div>"+
                        "</div>"+
                        "<div class=\"boxContentContainer\" data-boxid=\""+ box._id +"\">"+
                        "</div>"+
                        "<div class=\"btn-group btn-group-sm boxBtnGroup\" role=\"group\">"+
                            "<button type=\"button\" class=\"btn btn-secondary removeBoxBtn\" data-toggle=\"modal\" data-target=\"#removeBoxModal\" data-boxname=\""+box.boxName+"\" data-boxid=\""+ box._id+ "\">박스삭제</button>"+
                            "<button type=\"button\" class=\"btn btn-secondary focusBtn\" disabled data-boxid=\""+ box._id +"\">Focus</button>"+
                            // "<button type=\"button\" class=\"btn btn-secondary addBoxContentBtn\" data-toggle=\"modal\" data-target=\"#addBoxContentModal\" data-boxid=\""+ box._id +"\">추가</button>"+
                        "</div>"+
                    "</div>"+
                "</div>"+
                "</div>";
            //create html box element
            
            $(".boxContainer").append(boxHtmlElement);
        });
    
    
    //box 안의 textinput 버튼에 ajax 통신 기능 추가 
    $(".boxTextInputBtn").on("click", function(event){
        addTextandDisplay(event.currentTarget);
    });
    
    $(".boxTextInput").keypress(function(event){
       if(event.keyCode === 13){
           addTextandDisplay(event.currentTarget);
       } 
    });
    
    
    
    resolve();
    });
}

//box의 타이틀 or text를 누르면 수정할 수 있도록 input으로 바뀌게 하는 기능을 박스에 추가하는 function
function boxEasyInput(){
    boxes.forEach(function(box){
        var boxid = box.boxid;
       $("") 
    });
}

function boxTextDisplay(number){ //number of texts to display
    return new Promise(function(resolve, reject){
        $(".boxContentContainer").html("");
        texts.forEach(function(text){
            var boxid = text.boxid;
            var contentText = text.text;
            var textid = text._id;
            var targetBox = $(".boxContentContainer[data-boxid*="+boxid+"]");
       
       if(targetBox.children().length < number ){
           $(targetBox).append(""+
           "<div class=\"boxText\" data-textid=\""+ textid +"\" draggable=\"true\">"+
           "<p>"+ contentText +
           "</p>" +
           "<div class=\"boxTextRemove\">X</div>" +
           "</div>");
       } else if(targetBox.children().length === number){
           $(targetBox).append("<p>...for more text, click FOCUS</p>");
       }
       
        });
    
    //TEXT 제거 기능 추가
    $(".boxTextRemove").on("click", function(){
        var textid = $(this).closest(".boxText").data("textid");
        var sendingData = {textid: textid};
        sendingData = JSON.stringify(sendingData);
        
        myAjax("POST", "/main/box/text?_method=DELETE", sendingData)
        .then(function(result){
            texts = JSON.parse(result).texts;
            boxTextDisplay(currentAvailableTextAmount);
        });
     });
     
     
     resolve();
    });
    //data는 {'texts': [array]} 형태이어야 한다.
    //data.forEach()
}

//BOX FOCUS MODE 

function boxFocus(boxid){
    var focusBox = $(".plan-container:has(.focusBtn[data-boxid="+ boxid +"])");
        // global variable인 focusState가 0이면 현재 normal mode 1이면 현재 focus mode
        //focused Box의 백그라운드 element 추가
        new Promise(function(resolve, reject){
            if(focusState === 0){
                focusBox.wrap("<div class='modalBackground-plan-container'></div>");
                focusState = 1;
            } else {
                focusBox.unwrap();
                focusState = 0;
            }
            resolve();
        }).then(()=>{
                new Promise(function(resolve, reject){
                    boxes.forEach(function(box){
                        var currentBox = $(".plan-container:has(.focusBtn[data-boxid="+ box._id +"])");
                        if(!(currentBox.is(focusBox))){
                            currentBox.toggleClass("notFocused");
                        } else {
                            // focusBox.toggleClass("float-left"); // 일반 모드 class
                            focusBox.toggleClass("focusBox");
                            $(".pageToolContainer").toggleClass("notFocused");
                        }
                            currentAvailableTextAmount = focusState ? 16 : 7;  
                        });
                    resolve();
            });
        })
        .then(()=>{
            boxDisplay();
        })
        .then(()=>{
            boxTextDisplay(currentAvailableTextAmount);
        });
        

}

//Input에서 Enterkey를 누르면 특정 함수를 실행하는 기능을 추가하는 함수
function inputEnterkey(input, func){
    var _input = $(input);
    $(_input).keypress(function(e) { 

    if (e.keyCode == 13){
        func();
        }
    });
} 
//box의 Focus 버튼에 기능 추가
function boxFocusAdd(boxid){
    var boxid_ = boxid;
    var targetBtn = $(".focusBtn[data-boxid="+boxid_+"]");
    targetBtn.on("click", function(event){
        var boxid = $(this).data("boxid");
        boxFocus(boxid);
    });
}

function myAjax(method, url, data){
    return new Promise(function(resolve, reject){
        var xhr = new XMLHttpRequest();
        var returnResponse;
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.send(data);
       
        xhr.onreadystatechange = function(){
           if(xhr.readyState !== XMLHttpRequest.DONE){
               return;
           }
           if(xhr.status !== 200){
               return;
           }
           var response = xhr.responseText;
           //Manipulate ejs here
           //End manipulating ejs here
           returnResponse = response;
           resolve(returnResponse);
        };
    });
}

function addBoxandDisplay(){
    var boxName = $(".boxNameInput").val();
    if(boxName === "") {
        alert("최소 한 글자 이상 박스의 이름을 기입해주세요!");
        return;
    }
    $(".boxNameInput").val("");
    var data = {'boxName': boxName};
    data = JSON.stringify(data);
    myAjax("POST", "/main/box", data)
    .then(function(result){
        return new Promise(function(resolve, reject){
            boxes = JSON.parse(result).boxes;
            resolve();
        });
    })
    .then(function(){
        boxDisplay();
        return Promise.resolve();
    })
    .then(()=>boxTextDisplay(currentAvailableTextAmount))
    .then(()=>{
        boxes.forEach(function(box){
            boxFocusAdd(box._id);
        });
    });//Create new box, get boxes list and show them
}

function addTextandDisplay(target){
        var button = $(target);
        var boxid = $(button).data("boxid");
        var targetTextInput = $(".boxTextInput[data-boxid*="+boxid+"]");
        
        //text box가 비어있으면 추가하지 않는다.
        if(targetTextInput.val() === ""){
            alert("죄송합니다. 보통 서버는 비어있는 TEXT 박스를 추가해줄만큼 한가하지 않습니다.");
            return;
        }
        var data = {
            'text':targetTextInput.val(),
            'boxid':boxid
            };
        targetTextInput.val("");
        
        data = JSON.stringify(data);
        myAjax("POST","/main/box/text",data)
        .then(function(result){
            return new Promise(function(resolve, reject){
                texts = JSON.parse(result).texts;
                resolve();
            });
        })
        .then(function(){
            boxTextDisplay(currentAvailableTextAmount);
            return Promise.resolve();
        })
    }