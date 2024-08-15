document.addEventListener('DOMContentLoaded', () => {
    window.electron.send('load-search-history');
});

window.electron.receive('search-history', (searches) => {
    const searchList = document.getElementById('searchList');
    searchList.innerHTML = '';

    if (searches.error) {
        const errorItem = document.createElement('li');
        errorItem.textContent = 'Erro ao carregar o histórico de pesquisas.';
        searchList.appendChild(errorItem);
        return;
    }

    searches.forEach(search => {
        const listItem = document.createElement('li');

        listItem.innerHTML = `
            <div>
                <span>Termo:</span> ${search.term}
                <span>Data:</span> ${new Date(search.createdAt).toLocaleString()}
                <span>Cidades:</span> ${search.cities.join(', ')}
            </div>
            <div class="search-actions">
                ${search.completed ?
            '<button class="download-button">Baixar</button>' :
            '<span class="search-status">Incompleto</span>'}
            </div>
        `;

        if (search.completed) {
            listItem.querySelector('.download-button').addEventListener('click', () => {
                window.electron.send('download-search', search.id);
            });
        }

        searchList.appendChild(listItem);
    });
});
