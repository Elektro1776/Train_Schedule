$(document).ready(function() {

  var config = {
    apiKey: "AIzaSyBOGAOOQKw2O5IBq62iqMTBieWKamgjAfo",
    authDomain: "trainschedule-af851.firebaseapp.com",
    databaseURL: "https://trainschedule-af851.firebaseio.com",
    projectId: "trainschedule-af851",
    storageBucket: "trainschedule-af851.appspot.com",
    messagingSenderId: "974739846874"
  };
  firebase.initializeApp(config);
  var currentTime;
  var timeToArrival;
  const database = firebase.database();
  const trains = database.ref('trains');
  function calculateNextArrival(firstArrival, frequency){
    let initialArrival = moment(firstArrival, ['HH:mm'])
    let nextArrival = moment(initialArrival).add(frequency, 'm').format('hh:mm a')
    console.log(' WHAT IS THE CURRENTTIME', frequency, initialArrival.format('hh:mm'), nextArrival);
  }
  function formatTime(time) {
    var parsedTime = moment(time, ['hh:mm a']).format("hh:mm a");
    return parsedTime;
  }
  timeToArrival = setInterval(function() {
    console.log(' RUNNING INTERVAL@');
    // calculateNextArrival(currentTime)
    trains.once('value', function(snapshot) {
      snapshot.forEach(function(childSnap) {
        var train = childSnap.val();
        let test = $('tbody').children().each(function(index,childEl) {
          // console.log(' WHAT IS THE TEST', $(childEl).find('.trainName').attr('data-trainname'));
          // var currentTrain = $(childEl).children();
          let trainNames = $(childEl).find('.trainName').attr('data-trainname');
          let initialArrival = moment(train.initialTrainTime, ['HH:mm']).format("HH:mm A")
          if (train.trainName === trainNames) {
            calculateNextArrival(initialArrival, train.frequency)
            // console.log(' WAHT IS OUR CHIILD SNAP', train.frequency, );


          }
        })
      })
    })
  }, 1000);
  function writeTrainData(data) {
    const { trainName, destination, initialTrainTime, frequency } = data
    const newPostRef = trains.push();
    const initialStartTime = moment(initialTrainTime, ['hh:mm']).format("h:mm ");
    console.log(' WHAT IS THE INITIAL START TIME', initialStartTime);
    newPostRef.set({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      initialTrainTime: initialStartTime,
    });
}

function createNewTableRow(data) {
const { trainName, destination, initialTrainTime, frequency } = data
console.log(' WHAT IS HAPPENING WITH THE DESTINATION', destination);
let parsedTime = formatTime(initialTrainTime)
const trainData = `
  <tr class="trainInfo">
    <td class="trainName" data-trainname="${data.trainName}">${data.trainName}</td>
    <td class="destination">${data.destination}</td>
    <td class="frequency">${data.frequency} min</td>
    <td class="nextArrival">${parsedTime}</td>
    <td class="minutesAway">${frequency}</td>
  </tr>`
 $('#trainTable tbody').append(trainData)
}
trains.on('value', function(snapshot) {
  var data = snapshot.val();
  snapshot.forEach(function(childSnapshot) {
    var data = childSnapshot.val();
    createNewTableRow(data);

  })
});

$('form').submit(function(e) {
  e.preventDefault();
  var $inputs = $('#trainFormEntry :input:not(:button)');
  var values = {};
  $inputs.each(function() {
    var id = $(this)[0].id;
    values[id] = $(this).val();
    $(this).val('');
  });
  writeTrainData(values);
});































});
