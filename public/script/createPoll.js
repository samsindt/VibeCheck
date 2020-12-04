
(function(){

  var form = document.getElementById('createPoll_form');
  
      form.addEventListener('submit', e => {
          e.preventDefault();
          var formData = new FormData(form);
          var jsonObj = {
            question: formData.get('question'),
            answers: []
          };
          
          formData.delete('question');
          formData.forEach((value, key) => jsonObj.answers.push(value));
          var jsonData = JSON.stringify(jsonObj);
          fetch('/poll/create', {
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
                window.location.href = '/poll/id/'+data.id;
              }
              else {
                alert('Error: ' + response.msg);
            }
          })
          .catch(function(error) {                        // catch
            console.log('Request failed', error);
          });
      });
  })();