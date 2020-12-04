(function(){
    var password = document.getElementById('password');
    var confirmPassword = document.getElementById('confirm_password');
    var charAndNumberRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])/;

    function validateConfirmPassword() {
        if (password.value != confirmPassword.value) {
            confirmPassword.setCustomValidity('Passwords do not match');
        } else {
            confirmPassword.setCustomValidity("");
        }
    }

    function validatePasswordContents() {
        if (password.value.length < 8 || !charAndNumberRegex.test(password.value)) {
            password.setCustomValidity('Password must be at least 8 characters long and contain numbers and letters');
         } else {
            password.setCustomValidity('');
         }
    }

    password.addEventListener('change',validatePasswordContents);
    confirmPassword.addEventListener('change', validateConfirmPassword);

    var username = document.getElementById('username');

    username.onchange = () => {
        username.setCustomValidity('');
    }

    var form = document.getElementById('registration_form');

    form.addEventListener('submit', e => {
        e.preventDefault();
        var formData = new FormData(form);
        // to json

        var rawObj = {};
        formData.forEach((value, key) => rawObj[key] = value);
        var jsonData = JSON.stringify(rawObj);

        fetch('/account/register', {
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