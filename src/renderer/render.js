document.getElementById('loginButton').addEventListener('click', () => {
    console.log("caiu aqui antes");
    const term = document.getElementById('term').value;
    const location = document.getElementById('location').value;
    window.electron.send('search', { term, location });
});

window.electron.receive('search-results', (results) => {
    console.log("caiu aqui depois", results);
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Limpar resultados anteriores

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.textContent = JSON.stringify(result);
        resultsContainer.appendChild(resultDiv);
    });
});
