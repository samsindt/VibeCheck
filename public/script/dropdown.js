(function(){
    let dropdown = document.querySelector("#dropdown");

    dropdown.addEventListener('click', function (event) {
        dropdown.classList.toggle("change");
        document.getElementById("myDropdown").classList.toggle("show");
    });
})();