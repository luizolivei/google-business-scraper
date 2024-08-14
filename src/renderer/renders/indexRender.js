// indexRender.js
document.addEventListener('DOMContentLoaded', () => {
    window.electron.send('load-cities');
});

const searchButton = document.getElementById('searchButton');
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const termInput = document.getElementById('term');
        const locationSelect = document.getElementById('location');

        searchButton.disabled = true;
        searchButton.textContent = 'Pesquisando...';

        const term = termInput.value;
        const selectedLocations = Array.from(locationSelect.selectedOptions).map(option => option.value);

        termInput.value = '';
        $('#location').val(null).trigger('change');

        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        window.electron.send('search', { term, location: selectedLocations });
    });
}

window.electron.receive('load-cities', (cities) => {
    if (cities.error) {
        console.error(cities.error);
        return;
    }

    const locationSelect = document.getElementById('location');
    if (!locationSelect) return;

    locationSelect.innerHTML = '';

    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.nome;
        locationSelect.appendChild(option);
    });

    $('#location').select2({
        placeholder: "Selecione uma ou mais cidades",
        allowClear: true
    });
});

window.electron.receive('search-results', (results) => {
    const searchButton = document.getElementById('searchButton');
    if (searchButton) {
        searchButton.disabled = false;
        searchButton.textContent = 'Pesquisar';
    }

    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';

    if (results.error) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('error');
        errorDiv.textContent = 'Erro ao processar a busca.';
        resultsContainer.appendChild(errorDiv);
        return;
    }

    const successDiv = document.createElement('div');
    successDiv.textContent = 'Pesquisa concluída com sucesso!';
    resultsContainer.appendChild(successDiv);
});

const openHistoryPageButton = document.getElementById('openHistoryPage');
if (openHistoryPageButton) {
    openHistoryPageButton.addEventListener('click', () => {
        window.electron.send('open-history-page');
    });
}