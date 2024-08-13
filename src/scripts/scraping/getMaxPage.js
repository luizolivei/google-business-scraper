const log = require('electron-log');
const numberOfItensPerPage = 22;

const getMaxPage = async (page, fetchUrl) => {
    try {
        let maxPage = 0;
        let hasMorePages = true;

        while (hasMorePages) {
            const fetchUrlWithPage = `${fetchUrl}&start=${maxPage * numberOfItensPerPage}`;
            await page.goto(fetchUrlWithPage, { waitUntil: 'networkidle2' });

            const pageSearch = await page.evaluate(() => {
                let highestPage = 0;
                const pageNumbers = Array.from(document.querySelectorAll('a.fl'));

                if (pageNumbers.length === 0) {
                    return {
                        "NewMaxPage": highestPage,
                        "HasResults": false
                    };
                }

                pageNumbers.forEach(element => {
                    const pageString = element.getAttribute('aria-label');
                    if (pageString) {
                        const pageNumber = parseInt(pageString.match(/\d+/)[0]);
                        if (pageNumber > highestPage) {
                            highestPage = pageNumber;
                        }
                    }
                });

                return {
                    "NewMaxPage": highestPage,
                    "HasResults": true
                };
            });

            if (!pageSearch.HasResults) {
                hasMorePages = false;
            } else if (pageSearch.NewMaxPage > maxPage) {
                maxPage = pageSearch.NewMaxPage;
            } else if (pageSearch.NewMaxPage === maxPage) {
                hasMorePages = false;
            }
        }

        return maxPage;
    } catch (e) {
        log.error('Error during scraping in getMaxPage:', e);
        return 0;
    }
};

module.exports = getMaxPage;
