(function() {
    var button = document.getElementById('addAnswer');
    var inputCount = 2;

    button.addEventListener('click', function() {
        var form = document.getElementById('createPoll_form');
        var newDiv = document.createElement('div');
        newDiv.classList.add('justify');
        var newInput = document.createElement('input');
        newInput.setAttribute('type', 'text');
        newInput.setAttribute('placeholder', 'Add A Possible Answer...');
        newInput.required = true;
        inputCount++;
        newInput.setAttribute('name', inputCount);
        newDiv.appendChild(newInput);
        form.appendChild(newDiv);
    });
})();