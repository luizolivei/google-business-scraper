// historyRender.js
document.addEventListener('DOMContentLoaded', () => {
    window.electron.send('load-search-history');
});

window.electron.receive('search-history', (searches) => {
    const searchList = document.getElementById('searchList');
    if (!searchList) return;

    searchList.innerHTML = '';

    if (searches.error) {
        const errorItem = document.createElement('li');
        errorItem.textContent = 'Erro ao carregar o histórico de pesquisas.';
        searchList.appendChild(errorItem);
        return;
    }

    searches.forEach(search => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<span>Termo:</span> ${search.term}
                              <span>Data:</span> ${new Date(search.createdAt).toLocaleString()}
                              <span>Cidades:</span> ${search.cities.join(', ')}`;
        searchList.appendChild(listItem);
    });
});
