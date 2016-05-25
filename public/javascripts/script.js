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

var injectEditForm = function(rowId) {
  var row = window.getElementById('row' + rowId);
  var editData = {
    name: row[0].textContent,
    reps: row[1].textContent,
    weight: row[2].textContent,
    date: row[3].textContent,
    lbs: row[4].textContent
  }
  var blankTemplate = editForm;
  var compiledTemplate = Handlebars.compile(blankTemplate);
  var loadedTemplate = compiledTemplate(editData);
  document.getElementById("edit-template").innerHTML = loadedTemplate;
}

var deleteRow = function(data, callback) {
  console.log("DLETE ROW: ", data);
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(data) {
    if (req.readyState == 4 && req.status == 200) {
      callback(data.target.responseText);
    };
  };
  req.open('POST', '/workouts/' + data, true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send();
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
        '<tr id="row{{id}}">'+
          '<form>'+
            '<td>{{name}}</td>'+
            '<td>{{reps}}</td>'+
            '<td>{{weight}}</td>'+
            '<td>{{date}}</td>'+
            '<td>{{lbs}}</td>'+
            '<td>'+
            '<input type="button" value="edit" onclick="injectEditForm({{id}})">'+
          '</form>'+
          '<form>'+
            '<input type="button" value="delete" onclick="deleteRow({{id}}, loadHandlebars)">'+
          '</form>'+
          '</td>'+
        '</tr>'+
    '{{/each}}'+
  '</table>'

  var editForm = '<h3>Add a row</h3>'+
    '<form method="post" action="/" id="postForm">'+
      '<label for="postName">Name</label>'+
      '<input type="text" name="name" value="{{editData.name}}" id="postName"/><br>'+
      '<label for="postReps">Reps</label>'+
      '<input type="number" name="reps" value="{{editData.reps}}" id="postReps"/><br>'+
      '<label for="postWeight">Weight</label>'+
      '<input type="text" name="weight" value="{{editData.weight}}" id="postWeight"/><br>'+
      '<label for="postDate">Date</label>'+
      '<input type="date" name="date" value="{{editData.date}}" id="postDate"/><br>'+
      '<label for="PostLbs">lbs?</label>'+
      '<select name="lbs" value="{{editData.lbs}}" id="postLbs"/>'+
        '<option value="true">lbs</option>'+
        '<option value="false">kg</option>'+
      '</select><br>'+
      '<input type="button" value="Add Row" id="editRow"/>'+
    '</form>'