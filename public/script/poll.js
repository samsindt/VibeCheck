(function() {

    var pageId = window.location.pathname.split('/')[3];

    fetch('/populate/' + pageId, {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {

        var ctx = document.getElementById('chart').getContext('2d');

        var chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(0, 10, 154)',
                    data: data.counts
                }]
            },
            options: {}
        });
    });
})();