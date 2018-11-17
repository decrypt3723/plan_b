var boxes = myAjax("GET", "/main/box", null, boxDisplay); //Get Boxes and Show them AND keep them in Boxes variable.
var texts = myAjax("POST", "/main/box/text", null, boxTextDisplay);


$("addBox").on("click", function(){
    var boxName = $(".boxName").val();
    if(boxName === "") {
        alert("최소 한 글자 이상 박스의 이름을 기입해주세요!");
        return;
    }
    $(".boxName").val("");
    var data = {'boxName': boxName};
    data = JSON.stringify(data);
    myAjax("POST", "/main/box", data, boxDisplay); //Create new box, get boxes list and show them
});
    

$(".boxRemovingBtn").click(function(){
    var button = $(this);
    var currentBoxId = $(button).data("boxId");
    var data = {'boxid': currentBoxId};
    data = JSON.stringify(data);
    myAjax("POST", "/main/box?_method=DELETE", data, boxDisplay); 
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
function boxDisplay(response){
    var boxes = JSON.parse(response).boxes;
    console.log(texts);
    $(".boxContainer").empty();
    
    //insert boxes in container in the page
    boxes.forEach(function(box){
        var boxName = box.boxName;
        
        if(boxName.length > 8){
            boxName = boxName.slice(0, 10) + "...";
        }
        var boxHtmlElement = ""+
            "<div class=\"col-xl-3 col-lg-4 col-12 float-left plan-container\">"+
                "<h6>"+ boxName +"</h6>" +
                "<div class=\"boxContentInput\">"+
                    "<input type=\"text\" class=\"boxTextInput\" data-boxid=\""+box._id+"\">"+
                    "<button class=\"boxTextInputBtn\" data-boxid=\""+box._id+"\">text input</button>"+
                "</div>"+
                "<div class=\"boxContentContainer\" data-boxid=\""+ box._id +"\">"+
                "</div>"+
                "<div class=\"btn-group boxBtnGroup\" role=\"group\">"+
                    "<button type=\"button\" class=\"btn btn-secondary removeBoxBtn\" data-toggle=\"modal\" data-target=\"#removeBoxModal\" data-boxname=\""+box.boxName+"\" data-boxid=\""+ box._id+ "\">박스삭제</button>"+
                    "<button type=\"button\" class=\"btn btn-secondary\" data-boxid=\""+ box._id +"\">수정</button>"+
                    "<button type=\"button\" class=\"btn btn-secondary addBoxContentBtn\" data-toggle=\"modal\" data-target=\"#addBoxContentModal\" data-boxid=\""+ box._id +"\">추가</button>"+
                "</div>"+
            "</div>";
        //create html box element
        
        $(".boxContainer").append(boxHtmlElement);
    });
    
    
    //box 안의 textinput 버튼에 ajax 통신 기능 추가 
    $(".boxTextInputBtn").on("click", function(event){
        var button = $(this);
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
        
        console.log(data);
        data = JSON.stringify(data);
        myAjax("POST","/main/box/text",data, boxTextDisplay)
        // 현재 문제 : boxDisplay는 box를 나타내는 목적으로 사용한 것이라 TEXT는 다른 함수를 정의해서 이용해야 함!
    });
}

function boxTextDisplay(response){
    //data는 {'texts': [array]} 형태이어야 한다.
    //data.forEach()
    texts = JSON.parse(response).texts;
    texts.forEach(function(box){
       var boxid = box.boxid;
       var text = box.text;
       var targetBox = $(".boxContentContainer[data-boxid*="+boxid+"]");
       
       $(targetBox).append("<p>"+text+"</p>");
    });
}





function myAjax(method, url, data, handling){
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
       handling(response);
       //End manipulating ejs here
       returnResponse = response;
   };
   
   return returnResponse;
}