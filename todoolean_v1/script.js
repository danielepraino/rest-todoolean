moment.locale("it");

var apiURL = "http://157.230.17.132:3014/todos/";

var todoliTemplate = $("#todoli-template").html();
var listTemplate = Handlebars.compile(todoliTemplate);
var optionTemplate = $("#option-template").html();
var selectTemplate = Handlebars.compile(optionTemplate);

var todoli = {
  id: 0,
  text: "",
  time: ""
}

var timeSelect = {
  value: 0
}

function call_TodoAPI(methodType, todoText, todoTime, id){
  $(".todo-list").empty();
  $.ajax({
    url: apiURL + undefinedCheck(id),
    method: methodType,
    data: {
      text: todoText,
      time: todoTime
    },
    success: function(obj){
        for (var i = 0; i < obj.length; i++) {
          todoli.id = obj[i].id;
          todoli.text = obj[i].text;
          todoli.time = obj[i].time;
          console.log(obj);
          $(".todo-list").append(listTemplate(todoli));
        }
    },
    error: function() {
      alert("errore");
    }
  });
}

function undefinedCheck(check){
  if (typeof check == "undefined") {
    return check = "";
  } else {
    return check;
  }
}

call_TodoAPI("GET");

function addTodoList(){
  var lastId = $(".todo-list").find("li:last-child").attr("data-li");
  console.log("lastId: " + lastId);
  var putId = parseInt(lastId) + 1;
  if (typeof lastId == "undefined") {
    putId = 1;
  }
  console.log("putId: " + putId);
  var todoText = $(".todo-input").val();
  var hours = $(".hours").val();
  var minutes = $(".minutes").val();
  var todoTime = hours + ":" + minutes;
  if (todoText != "") {
    call_TodoAPI("POST", todoText);
    call_TodoAPI("PUT", todoText, todoTime, putId);
    setTimeout(function(){
      call_TodoAPI("GET");
    }, 100);
    $(".todo-input").val("");
  }
}

$(".todo-add").click(function(){
  addTodoList();
});

$(".todo-input").keypress(function(event){
  if (event.which == 13) {
    addTodoList();
  }
});

$(document).on("click", ".todo-canc", function(){
  var deleteId = $(this).parent().attr("data-li");
  call_TodoAPI("DELETE", "", "", deleteId);
  setTimeout(function(){
    call_TodoAPI("GET");
  }, 100);
});

setHours(24);
setMinutes(15);

function setHours(range){
  for (var i = 0; i < range; i++) {
    if (i < 10) {
      timeSelect.value = "0" + i;
    } else {
      timeSelect.value = i;
    }
    $(".hours").append(selectTemplate(timeSelect));
  }
}

function setMinutes(range){
  var timeSplit = 60 / range;
  console.log("timeSplit: " + timeSplit);
  for (var i = 0; i < timeSplit; i++) {
      rangeTime = range * i;
      if (rangeTime < 10) {
        timeSelect.value = "0" + i;
      } else if (rangeTime % range == 0) {
        timeSelect.value = rangeTime;
      }
    $(".minutes").append(selectTemplate(timeSelect));
  }
}
