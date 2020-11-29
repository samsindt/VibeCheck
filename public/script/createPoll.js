(function(){

var form = document.getElementById('createPoll_form');

    form.addEventListener('submit', e => {
        e.preventDefault();
        var formData = new FormData(form);
        // to json

        var rawObj = {};
        formData.forEach((value, key) => rawObj[key] = value);
        var jsonData = JSON.stringify(rawObj);

        fetch('/poll/create-poll', {
            method: 'POST',
            credentials: 'include',
            body: jsonData,
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = '../';
            }
            else {
              alert('Error: ' + response.msg);
          }
        });
    });

document.getElementById('addChoice').addEventListener('onclick', addChoice);

function addChoice() {
  var NumberOfOptions = 3
  NumberOfOptions++;

  var newChoice = document.createElement('input');
  var newBreak = document.createElement('br');
  newChoice.setAttribute('type', 'option' + NumberOfOptions);
  newChoice.setAttribute('id', 'option' + NumberOfOptions); 
  newChoice.setAttribute('name', 'option' + NumberOfOptions);
  console.log(newChoice);
  
  document.getElementById('createPoll_form').appendChild(newChoice);
  document.getElementById('createPoll_form').appendChild(newBreak);

 }
})();