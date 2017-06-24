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
  var database = firebase.database();
  var trains = database.ref('trains');

  function calculateNextArrival(firstArrival, frequency, trainId){
    const trainRef = trains + '/' + trainId;
    let initialArrival = moment(firstArrival, ['HH:mm '])
    let nextArrival = initialArrival.add(frequency, 'minutes')
    let updateTrainArrival = function() {
      let initialTrainTime = moment(nextArrival).add(frequency, 'm').format("HH:mm");
      console.log(' WHAT IS THE NEW INITIAL TIME ', trainId, );
      trains.child(trainId).update({initialTrainTime});
    }
    // console.log(` OOUR NextArrival : ${nextArrival}` );
    let minAway = calculateMinAway(nextArrival, updateTrainArrival);
    // console.log(' WHAT IS OUR TRAIN REFFFF', trainRef);

    return minAway
  }
  function calculateMinAway(nextArrival, cb) {
    let currentTime = moment();
    let arrival = moment(nextArrival);
    let timeToTrainArrival = currentTime.to(arrival);
    let diff = arrival.diff(currentTime);
    // console.log(' WHAT IS OUR ARRIVAL', arrival, "WHAT IS OUR DIFF????", diff);
    // console.log(' WHAT IS THE CURRENT TIME', timeToTrainArrival, currentTime, arrival );
    if (diff <= 0) {
      // console.log("What is the arrival", arrival, );
      // console.log(' WHAT IS THE NEXT ARRIVAL ', nextArrival);
      cb();
      // alert(' Train Has arrived');
    }
    return timeToTrainArrival;

  }
  function formatTime(time) {
    var parsedTime = moment(time, ['hh:mm a']).format("hh:mm a");
    return parsedTime;
  }
  timeToArrival = setInterval(function() {
    // console.log(' RUNNING INTERVAL@');
    // calculateNextArrival(currentTime)
    console.log('What is the current Time ', moment().format());
    trains.once('value', function(snapshot) {
      snapshot.forEach(function(childSnap) {
        var train = childSnap.val();
        let trainId = childSnap.key;
        let test = $('tbody').children().each(function(index,childEl) {
          // var currentTrain = $(childEl).children();
          let trainNames = $(childEl).find('.trainName').attr('data-trainname');
          let nextArrivalTime = $(childEl).find('.minutesAway');
          let initialArrival = moment(train.initialTrainTime, ['HH:mm']).format("HH:mm ")
          if (train.trainName === trainNames) {
            let nextTrainStops = calculateNextArrival(initialArrival, train.frequency, trainId)
            // console.log(' WAHT IS OUR CHIILD SNAP', nextTrainStops, );
            $(nextArrivalTime).text(nextTrainStops)

          }
        })
      })
    })
  }, 1000);
  function writeTrainData(data) {
    const { trainName, destination, initialTrainTime, frequency } = data
    const newPostRef = trains.push();
    const initialStartTime = moment(initialTrainTime, ['HH:mm']).format("HH:mm ");
    // console.log(' WHAT IS THE INITIAL START TIME', initialStartTime);
    newPostRef.set({
      trainName: trainName,
      destination: destination,
      frequency: frequency,
      initialTrainTime: initialStartTime,
    });
}

function createNewTableRow(data) {
const { trainName, destination, initialTrainTime, frequency } = data
let parsedTime = formatTime(initialTrainTime);
const trainData = `
  <tr class="trainInfo">
    <td class="trainName" data-trainname="${data.trainName}">${data.trainName}</td>
    <td class="destination">${data.destination}</td>
    <td class="frequency">${data.frequency} min</td>
    <td class="nextArrival" data-train-nextArrival="${parsedTime}">${parsedTime}</td>
    <td class="minutesAway">${frequency}</td>
  </tr>`
 return trainData;
}

(function listenForTrainAdded() {
  trains.on('child_added', function(snapshot) {
    let initialTable = createNewTableRow(snapshot.val());
    $('#trainTable tbody').append(initialTable);

  })
})();

(function listenForTrainUpdated() {
  trains.on('child_changed', function(snapshot) {
    console.log(' CHILD Updated FIRE!!!!', snapshot.val(), snapshot.key);
    let trainToUpdate = snapshot.val().trainName;
    let unparsedNewArrival = snapshot.val().initialTrainTime;
    let parsedNewArrival = unparsedNewArrival;
    let formatedArrivalTime = formatTime(parsedNewArrival); //moment(newArrival).format('hh:mm A');
    let trainInfoChildren = $('.trainInfo').children();
    $.each(trainInfoChildren, function(index, value) {
      let trainEl = $(value).attr('data-trainname');
      let newArrivalTimeEl = $(value).attr('data-train-nextArrival');
      if (trainEl === trainToUpdate) {
        $(value).siblings().map((index,sibling) => {
          if ($(sibling).hasClass('nextArrival')) {
            $(sibling).text(formatedArrivalTime);
            // console.log(' WHAT IS OUR THISSSSSSS', $(sibling));
          }
        })
        console.log(' CAN WE GET OUR CHILDREN CHAINED ON EACH', $(value).siblings().hasClass('nextArrival'), formatedArrivalTime, parsedNewArrival, typeof snapshot.val().initialTrainTime);
      }
    })
  });
})();

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
