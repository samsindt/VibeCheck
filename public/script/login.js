(function(){
    let form = document.getElementById('login_form');
    let username = document.getElementById('username');

    username.onchange = () => {
        username.setCustomValidity('');
    }

    form.addEventListener('onclick', e => {
        e.preventDefault();
        var formData = new FormData(form);
        // to json

        var rawObj = {};
        formData.forEach((value, key) => rawObj[key] = value);
        var jsonData = JSON.stringify(rawObj);

        fetch('/account/login', {
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
            } else if (data.invalidCredentials) {
                username.setCustomValidity('Invalid username or password');
            }
        });
    });
})();