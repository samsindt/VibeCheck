(function() {

    var pageId = document.getElementById('pollId').textContent;

    var ctx = document.getElementById('chart').getContext('2d');

    var randomColor = function() {
        var r = Math.floor(Math.random() * 255);
        var g = Math.floor(Math.random() * 255);
        var b = Math.floor(Math.random() * 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    };

    fetch('/poll/populate/' + pageId, {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {

        var colors = data.labels.map(() => randomColor());

        var chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: colors,
                    borderColor: colors,
                    data: data.counts
                }]
            },
            options: {}
        });

        var form = document.getElementById('vote_form');
        form.addEventListener('submit', e => {
            e.preventDefault();

            var formData = new FormData(form);
            var jsonData = JSON.stringify({vote: formData.get('vote')});

            fetch('/poll/vote', {
                method: 'POST',
                credentials: 'include',
                body: jsonData,
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then(() => {
                fetch('/poll/populate/' + pageId, {
                    method: 'GET',
                    credentials: 'include',
                })
                .then(response => response.json())
                .then(data => { 
                    chart.data.datasets[0].data = data.counts;
                    chart.update();
                });
            });
        });
    });


})();