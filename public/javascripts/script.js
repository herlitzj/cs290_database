function readyPage() {
  get(loadHandlebars);
  document.getElementById('addRow').onclick = addRow;
  console.log("LOADED");
};
window.onload = readyPage;

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

var editRow = function() {
  var formData = {
    'name': document.getElementById('editName').value,
    'reps': document.getElementById('editReps').value,
    'weight': document.getElementById('editWeight').value,
    'date': document.getElementById('editDate').value,
    'lbs': document.getElementById('editLbs').value,
  }
  put(formData, loadHandlebars);
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
  var row = document.getElementById('row' + rowId);
  var editData = {
    name: row.cells[0].textContent,
    reps: row.cells[1].textContent,
    weight: row.cells[2].textContent,
    date: row.cells[3].textContent,
    lbs: row.cells[4].textContent
  }
  var blankTemplate = editForm;
  var compiledTemplate = Handlebars.compile(blankTemplate);
  var loadedTemplate = compiledTemplate({editData: editData});
  console.log("DATA: ", editData);
  console.log("TEMPLATE: ", loadedTemplate);
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

var formatDate = function(date) {
  var dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2}).*/);
  return dateMatch[2] + '-' + dateMatch[3] + '-' +dateMatch[1]
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
            '<td>formatDate({{date}})</td>'+
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

  var editForm = '<h3>Edit entry {{editData.id}}</h3>'+
    '<form method="post" action="/" id="editForm">'+
      '<label for="postName">Name</label>'+
      '<input type="text" name="name" value="{{editData.name}}" id="editName"/><br>'+
      '<label for="postReps">Reps</label>'+
      '<input type="number" name="reps" value="{{editData.reps}}" id="editReps"/><br>'+
      '<label for="postWeight">Weight</label>'+
      '<input type="text" name="weight" value="{{editData.weight}}" id="editWeight"/><br>'+
      '<label for="postDate">Date</label>'+
      '<input type="date" name="date" value="{{editData.date}}" id="editDate"/><br>'+
      '<label for="PostLbs">lbs?</label>'+
      '<select name="lbs" value="{{editData.lbs}}" id="editLbs"/>'+
        '<option value="true">lbs</option>'+
        '<option value="false">kg</option>'+
      '</select><br>'+
      '<input type="button" value="Add Row" id="editRow"/>'+
    '</form>'