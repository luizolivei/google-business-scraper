// Recebe as cidades e popula o multi-select
window.electron.receive('load-cities', (cities) => {
    const locationSelect = document.getElementById('location');

    // Apenas itere sobre os objetos simples que foram enviados
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id; // Definindo o ID como valor
        option.textContent = city.nome; // Definindo o nome como texto visível
        locationSelect.appendChild(option);
    });
});

document.getElementById('searchButton').addEventListener('click', () => {
    const term = document.getElementById('term').value;
    const locationSelect = document.getElementById('location');
    const selectedLocations = Array.from(locationSelect.selectedOptions).map(option => option.value);

    window.electron.send('search', { term, location: selectedLocations });
});

window.electron.receive('search-results', (results) => {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Limpar resultados anteriores

    results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.textContent = JSON.stringify(result);
        resultsContainer.appendChild(resultDiv);
    });
});
