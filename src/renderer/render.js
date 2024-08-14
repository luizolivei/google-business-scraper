// Solicitar as cidades quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.electron.send('load-cities');
});

// Recebe as cidades e popula o multi-select
window.electron.receive('load-cities', (cities) => {
    if (cities.error) {
        console.error(cities.error);
        return;
    }

    const locationSelect = document.getElementById('location');

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

document.getElementById('searchButton').addEventListener('click', () => {
    const term = document.getElementById('term').value;
    const locationSelect = document.getElementById('location');
    const selectedLocations = Array.from(locationSelect.selectedOptions).map(option => option.value);

    window.electron.send('search', { term, location: selectedLocations });
});
