(function() {
    var logout = document.getElementById('logout');
    logout.addEventListener('click', () => {
        fetch('/account/logout', {
            method: 'POST',
            credentials: 'include',
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/account/login';
            } else {
                throw new Error('Http status ' + response.status);
            }
        });
    })
})();