// Initialize Firebase
var config = {
    apiKey: "AIzaSyBw6KqpY7YgYpxt7A9S_KxsUbYRFwWgieI",
    authDomain: "myawesomeprojeect.firebaseapp.com",
    databaseURL: "https://myawesomeprojeect.firebaseio.com",
    projectId: "myawesomeprojeect",
    storageBucket: "myawesomeprojeect.appspot.com",
    messagingSenderId: "264985659895"
  };
  firebase.initializeApp(config);


var database = firebase.database();
var liveTime = moment().format("ddd mmm Do, HH:mm:ss");

function displayTime(){
    liveTime = moment().format("ddd MMM Do, HH:mm:ss");
    $(".lead").text(liveTime);
}

function getTimes(firstTime, firstFrequency){
    var currentTime = moment(); 
    var convertedTrainStart = moment(firstTime, "HH;MM").subtract(1, "years");
    var differenceInTime = currentTime.diff(moment(convertedTrainStart), "minutes");
    var trainTimeRemainder = differenceInTime % firstFrequency;
    var MinutesUnitlArrival = firstFrequency - trainTimeRemainder;

    // var tMinutesTillTrain = tFrequency - tRemainder;
    var nextArrivalConverted = moment(nextTrainTiime).format("hh:mm a");
    var nextTrainTiime = moment().add(MinutesUnitlArrival, "minutes");
    
    var trainArrivalData = [MinutesUnitlArrival, nextArrivalConverted];

    return trainArrivalData;
}

function updateTrainTimes(){
    var trainId;
    $("#trainData").ref().empty();
    
    database.ref().on("child_added", function(snapshot){

        var newTrain = snapshot.val().Name;
        var newDestination = snapshot.val().Destination;
        var newStart = snapshot.val().Start;
        var newFrequency = snapshot.val().Frequency;
        var trainComes = getTimes(newStart, newFrequency);
        var minutesAway = trainComes[0];
        var nextArrival = trainComes[1];
        var newTrainRow = "";
        
        trainId = snapshot.key;

        newTrainRow += "<tr>";
        newTrainRow += "<th scope= 'row'>" + newTrain + "</th>";
        newTrainRow += "<td>" + newDestination + "</td>";
        newTrainRow += "<td>" + newFrequency + "</td>";
        newTrainRow += "<td>" + nextArrival + "</td>";
        newTrainRow += "<td>" + minutesAway + "</td>";
        $("#train-data").append(newTrainRow);
    });

}

function submitTrain(event){
    event.preventDefault();
    console.log("Train Submitted");
    
    
    var trainName =  $("#train-name").val().trim();
    var trainDestination = $("#train-destination").val().trim();
    var trainStart = $("#train-start").val().trim();
    var trainFrequency = $("#train-frequency").val().trim();

    database.ref().push({
        Name: trainName,
        Destination: trainDestination,
        Start: trainStart,
        Frequency: trainFrequency,
        Date: firebase.database.ServerValue.TIMESTAMP
    });
    
    updateTrainTimes();
}

$(document).ready(function() {
    updateTrainTimes();
    setInterval(updateTrainTimes, 1000 * 60);
    setInterval(displayTime, 1000);  

    $("#submit").click(submitTrain);
    
});

function removeTrain() {
    var trainKey = $(this).attr("id");
    database.ref().child(trainKey).remove();
    updateTrainTimes();
}

