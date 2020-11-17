(function(){
    var password = document.getElementById("password");
    var confirmPassword = document.getElementById("confirm_password");

    function validatePassword() {
        if (password.value != confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match");
        } else {
            confirmPassword.setCustomValidity("");
        }
    }

    password.onchange = validatePassword;
    confirmPassword.onchange = validatePassword;

    var username = document.getElementById('username');

    username.onchange = () => {
        username.setCustomValidity('');
    }

    var form = document.getElementById('registration_form');

    form.addEventListener('submit', e => {
        e.preventDefault();
        var formData = new FormData(document.getElementById('registration_form'));
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