function readyPage() {
  get(loadHandlebars);
  document.getElementById('addRow').onclick = addRow;
  console.log("LOADED");
};
window.onload = readyPage;


// function bindButtons(){  
//   console.log("script loaded");
//   document.getElementById('postSubmit').addEventListener('click', function(event) {
//     console.log("POST BUTTON CLICKED");
//     var req = new XMLHttpRequest();
//     var formData = {
//       'name': document.getElementById('postName').value,
//       'reps': document.getElementById('postReps').value,
//       'weight': document.getElementById('postWeight').value,
//       'date': document.getElementById('postDate').value,
//       'lbs': document.getElementById('postLbs').value,
//     }
//     var payload = {text: formData};
//     req.open('POST', '/', true);
//     req.setRequestHeader('Content-Type', 'application/json');
//     req.send(JSON.stringify(payload));
//     event.preventDefault();
//   });
// }


var loadHandlebars = function(data) {
  console.log(data);
  var workoutData = JSON.parse(data);
  var blankTemplate = document.getElementById("handlebars-template").textContent;
  var compiledTemplate = Handlebars.compile(Source);
  var loadedTemplate = Template(workoutData);
  document.getElementById("handlebars-insert").append(loadedTemplate);
}

var addRow = function() {
  var formData = {
    'name': document.getElementById('postName').value,
    'reps': document.getElementById('postReps').value,
    'weight': document.getElementById('postWeight').value,
    'date': document.getElementById('postDate').value,
    'lbs': document.getElementById('postLbs').value,
  }
  post(formData, loadHandlebars);
}

var get = function(callback) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(data) {
    if (req.readyState == 4 && req.status == 200) {
      var response = data.responseText;
      callback(response);
    } else {
      console.log("Error: ", req.status)
    }
  };
  req.open('GET', '/workouts', true);
  req.send();
}

var post = function(data, callback) {
  var req = new XMLHttpRequest();
  var payload = data;
  req.open('POST', '/workouts', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(payload));
}