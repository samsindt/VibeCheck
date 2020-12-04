(function() {
    var button = document.getElementById('addAnswer');

    button.addEventListener('click', function() {
        var form = document.getElementById('createPoll_form');
        var newDiv = document.createElement('div');
        newDiv.classList.add('justify');
        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newDiv.appendChild(newInput);
        form.appendChild(newDiv);
    });
})();