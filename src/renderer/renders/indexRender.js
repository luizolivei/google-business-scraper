document.addEventListener('DOMContentLoaded', () => {
    window.electron.send('load-cities');
    window.electron.send('load-titles');
    window.electron.send('load-users');
});

const searchButton = document.getElementById('searchButton');
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const termInput = document.getElementById('term');
        const locationSelect = document.getElementById('location');
        const titlesSelect = document.getElementById('titles');
        const usersSelect = document.getElementById('users');

        searchButton.disabled = true;
        searchButton.textContent = 'Pesquisando...';

        const term = termInput.value;
        const selectedLocations = Array.from(locationSelect.selectedOptions).map(option => option.value);
        const selectedTitle = titlesSelect.value;
        const selectedUser = usersSelect.value;

        termInput.value = '';
        $('#location').val(null).trigger('change');
        $('#titles').val(null).trigger('change');
        $('#users').val(null).trigger('change');

        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        window.electron.send('search', {
            term,
            location: selectedLocations,
            title: selectedTitle,
            user: selectedUser
        });
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

window.electron.receive('load-titles', (titles) => {
    if (titles.error) {
        console.error(titles.error);
        return;
    }

    const titlesSelect = document.getElementById('titles');
    if (!titlesSelect) return;

    titlesSelect.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = '';
    placeholderOption.textContent = 'Selecione um título';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    titlesSelect.appendChild(placeholderOption);

    titles.forEach(title => {
        const option = document.createElement('option');
        option.value = title.Id;
        option.textContent = title.Descricao;
        titlesSelect.appendChild(option);
    });

    $('#titles').select2({
        placeholder: "Selecione um título",
        allowClear: true
    });
});

window.electron.receive('load-users', (dataUsers) => {
    if (dataUsers.error) {
        console.error(dataUsers.error);
        return;
    }

    const userSelect = document.getElementById('users');
    if (!userSelect) return;

    userSelect.innerHTML = '';

    const createOption = (value, text, isSelected = false, isDisabled = false) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        if (isSelected) option.selected = true;
        if (isDisabled) option.disabled = true;
        return option;
    };

    if (!dataUsers.isBlocked) {
        userSelect.appendChild(createOption('', 'Selecione um usuário', true, true));

        dataUsers.users.forEach(user => {
            userSelect.appendChild(createOption(user.Id, user.NomeCompleto));
        });
    } else {
        // Adiciona apenas o usuário do config
        const user = dataUsers.users[0];
        userSelect.appendChild(createOption(user.Id, user.NomeCompleto, true, true));
    }

    $('#users').select2({
        placeholder: "Selecione um usuario",
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
