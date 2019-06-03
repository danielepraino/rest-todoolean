//setto l'url per richiamare l'API
var apiURL = "http://157.230.17.132:3014/todos/";

//setto le variabili per handlebarsjs
var todoliTemplate = $("#todoli-template").html();
var listTemplate = Handlebars.compile(todoliTemplate);
var optionTemplate = $("#option-template").html();
var selectTemplate = Handlebars.compile(optionTemplate);

//creo i due oggetti da passare ad handlebardsjs
var todoli = {
  id: 0,
  text: "",
  time: ""
}

var timeSelect = {
  value: 0
}

//creo un'unica funzione di chiamata API, passandogli:
//medoto, testo, orario, id
//ogni volta che chiamo la funzione svuoto il div todo
//al success assegno i valori estratti dall'API all'oggetto todoli
//e vado a generare un li con il reminder
function call_TodoAPI(methodType, todoText, todoTime, id){
  $(".todo").empty();
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
          $(".todo").append(listTemplate(todoli));
        }
    },
    error: function() {
      alert("errore");
    }
  });
}

//creo una funzione che popola e modifica, al click, l'API
//recupero l'id dell'ultimo oggetto creato, se è undefined l'id è 1
//imposto testo, orario, e avendo l'id riesco a fare una chiamata PUT
//per aggiungere l'ora
function addTodoList(){
  var lastId = $(".todo").find("li:last-child").attr("data-li");
  var putId = parseInt(lastId) + 1;
  if (typeof lastId == "undefined") {
    putId = 1;
  }
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

//al click del bottone "aggiungi" richiamo la funzione per popolare e modificare l'API
$(".todo-add").click(function(){
  addTodoList();
});

//alla pressione del tasto ENTER richiamo la funzione per popolare e modificare l'API
$(".todo-input").keypress(function(event){
  if (event.which == 13) {
    addTodoList();
  }
});

//creo una funzione che, al click, cancella il reminder relativo, sia dal server 
//che da video
$(document).on("click", ".todo-canc", function(){
  var deleteId = $(this).parent().attr("data-li");
  call_TodoAPI("DELETE", "", "", deleteId);
  setTimeout(function(){
    call_TodoAPI("GET");
  }, 100);
});

//creo una funzione per il check undefined sull'id
function undefinedCheck(check){
  if (typeof check == "undefined") {
    return check = "";
  } else {
    return check;
  }
}

//creo una funzione che imposta la select in base ad un range
//in questo caso 24 ore
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

//creo una funzione che imposta la select in un range
//di 15 minuti
function setMinutes(range){
  var timeSplit = 60 / range;
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

//richiamo l'API per popolare la pagina all'avvio
call_TodoAPI("GET");
//imposto le select hours e minutes nel range che voglio
setHours(24);
setMinutes(15);
