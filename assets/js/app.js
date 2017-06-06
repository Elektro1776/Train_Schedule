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

  var database = firebase.database();

  function writeUserData(userId, name, email, imageUrl) {
  database.ref('users/' + userId).set({
    username: name,
    email: email,
  });
}
writeUserData('1234', 'Austin', 'elektricwebdesign@gmail.com')




































});
