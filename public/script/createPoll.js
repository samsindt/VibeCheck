
(function(){

  var form = document.getElementById('createPoll_form');
  
      form.addEventListener('submit', e => {
          e.preventDefault();
          var formData = new FormData(form);
          // to json
  
          var rawObj = {};
          formData.forEach((value, key) => rawObj[key] = value);
          var jsonData = JSON.stringify(rawObj);
  
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