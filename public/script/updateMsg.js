(function(){
    var updateMsg = document.getElementById('updateMsg');

    updateMsg.onclick = function() {
        if (updateForm.username.value == '' && updateForm.password.value == '' && updateForm.firstname.value == '' &&
            updateForm.lastname.value == '' && updateForm.email.value == '' && updateForm.securityQuestionAnswer.value == '') {
            alert("Please fill out at least one form.");
        }
        else {
            alert("Profile Updated!");
        }
    }
})();