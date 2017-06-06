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

  const database = firebase.database();
  const trains = database.ref('trains');

  function writeTrainData(data) {
    const { trainName, destination, initialTrainTime, frequency } = data
    const newPostRef = trains.push();
    const initialStartTime = moment()
    newPostRef.set({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      initialTrainTime: initialTrainTime,
    });
}
function createNewTableRow(data) {
const { trainName, destination, initialTrainTime, frequency } = data
const trainData = `
  <tr class="trainInfo">
    <td id="${data.trainName}">${data.trainName}</td>
    <td id="${data.destination}">${data.destination}</td>
    <td id="${data.nextArrival}">${data.initialTrainTime}</td>
    <td></td>
  </tr>`
 $('#trainTable tbody').append(trainData)
}
trains.on('value', function(snapshot) {
  var data = snapshot.val();
  snapshot.forEach(function(childSnapshot) {
    var data = childSnapshot.val();
    console.log(' WHAT IS OUR DATA', childSnapshot.val());
    createNewTableRow(data);

  })
});
// writeTrainData('1245', 'Austin', 'Denver, CO', '30min', '5:30pm')

// NOTE: This is how we will push down new train timesssss
 const data = {
   trainName: 'Nello',
   destination: 'CO',
   nextArrival: '5:50pm',
 }

/////////////////////////////////////////////////////

$('form').submit(function(e) {
  e.preventDefault();
  var $inputs = $('#trainFormEntry :input:not(:button)');
  var values = {};
  $inputs.each(function() {
    var id = $(this)[0].id;
    values[id] = $(this).val();
  });
  console.log(' WHAT ARE THE VALUES', values);
  writeTrainData(values);
});































});
