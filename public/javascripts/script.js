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
  var blankTemplate = handlebarsTemplate;
  var compiledTemplate = Handlebars.compile(blankTemplate);
  var loadedTemplate = compiledTemplate(workoutData);
  console.log("D: ", workoutData);
  console.log("BT: ", blankTemplate);
  console.log("CT: ", compiledTemplate);
  console.log("LT: ", loadedTemplate);
  document.getElementById("handlebars-insert").innerHTML = loadedTemplate;
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
      callback(data.target.responseText);
    };
  };
  req.open('GET', '/workouts', true);
  req.send();
}

var post = function(data, callback) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(data) {
    if (req.readyState == 4 && req.status == 200) {
      callback(data.target.responseText);
    };
  };
  var payload = data;
  req.open('POST', '/workouts', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(payload));
}

var deleteRow = function(data, callback) {
  var formData = {
    'id': data
  }
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(data) {
    if (req.readyState == 4 && req.status == 200) {
      callback(data.target.responseText);
    };
  };
  var payload = data;
  req.open('DELETE', '/workouts', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(payload));
}

var handlebarsTemplate = '<table>'+
    '<tr>'+
      '<th id="table_name" colspan="6">Workout Tracker</th>'+
    '</tr>'+
    '<tr>'+
      '<th>Name</th>'+
      '<th>Reps</th>'+
      '<th>Weight</th>'+
      '<th>Date</th>'+
      '<th>LBS/KG</th>'+
      '<th>Edit</th>'+
    '</tr>'+
      '{{#each rows}}'+
        '<tr>'+
          '<form>'+
            '<td>{{name}}</td>'+
            '<td>{{reps}}</td>'+
            '<td>{{weight}}</td>'+
            '<td>{{date}}</td>'+
            '<td>{{lbs}}</td>'+
            '<td>'+
            '<button type="submit" formmethod="put" formaction="/">Edit</button>'+
          '</form>'+
          '<form>'+
            '<input type="button" value="delete" onclick="deleteRow({{id}}, loadHandlebars)">'+
          '</form>'+
          '</td>'+
        '</tr>'+
    '{{/each}}'+
  '</table>'