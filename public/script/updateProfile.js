(function(){
  var username = document.getElementById('username');


  username.onchange = () => {
    username.setCustomValidity('');
  }

  var form = document.getElementById('updateProfile_form');

  form.addEventListener('submit', e => {
      e.preventDefault();
      var formData = new FormData(form);
      // to json

      var rawObj = {};
      formData.forEach((value, key) => rawObj[key] = value);
      var jsonData = JSON.stringify(rawObj);

      fetch('/account/updateProfile', {
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
              window.location.href = '/';
          } else if (data.duplicateUser) {
              document.getElementById('username').setCustomValidity('Username unavailable. Please try another');
          }
      });
  });
})();