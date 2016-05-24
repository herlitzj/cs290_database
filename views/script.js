document.addEventListener('DOMContentLoaded', function() {
  console.log("SCRIPT LOADED")
  document.getElementById("addRow").onclick = addRow();
  
});


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


function addRow() {
  console.log("adding row");
  var req = new XMLHttpRequest();
  var formData = {
    'name': document.getElementById('postName').value,
    'reps': document.getElementById('postReps').value,
    'weight': document.getElementById('postWeight').value,
    'date': document.getElementById('postDate').value,
    'lbs': document.getElementById('postLbs').value,
  }
  var payload = {text: formData};
  req.open('POST', '/', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.send(JSON.stringify(payload));
}