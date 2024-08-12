const puppeteer = require('puppeteer-core');
const log = require('electron-log');

//Numero de itens por pagina
const numberOfItensPerPage = 22

// Função de delay para evitar bans
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Função para gerar um User-Agent aleatório
const randomUserAgent = () => {
    const userAgents = [
        // Google Chrome em Windows
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",

        // Mozilla Firefox em Windows
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0",

        // Microsoft Edge em Windows
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.48",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/92.0.902.67",

        // Safari em macOS
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",

        // Mozilla Firefox em macOS
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:89.0) Gecko/20100101 Firefox/89.0",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11.4; rv:90.0) Gecko/20100101 Firefox/90.0",

        // Google Chrome em macOS
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",

        // Opera em Windows
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 OPR/77.0.4054.90",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36 OPR/78.0.4093.184"
    ];
    return userAgents[Math.floor(Math.random() * userAgents.length)];
};

// Função principal para realizar o scraping
const scrapeGoogleBusiness = async () => {
    const searchTerm = "floriculturas+em+blumenau";

    try {
        const results = [];
        const browser = await puppeteer.launch({executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe"});
        const page = await browser.newPage();
        await page.setUserAgent(randomUserAgent());

        const baseFetchUrl = `https://www.google.com/search?client=opera-gx&tbm=lcl&q=${searchTerm}&rflfq=1&num=10`;

        const totalPages = await getMaxPage(page, baseFetchUrl)

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            console.log("Página ", pageIndex);
            const start = pageIndex * numberOfItensPerPage
            const pageFetchUrl = `${baseFetchUrl}&start=${start}`;
            console.log("pageFetchUrl", pageFetchUrl)
            const businessIDs = await getBusinessIDs(page, pageFetchUrl);
            const businesses = [];

            for (const businessID of businessIDs) {
                const businessInfoFetchUrl = `${baseFetchUrl}&start=${start}#rlfi=hd:;si:${businessID}`;
                const businessName = await getBusinessInfo(page, businessInfoFetchUrl);
                console.log("coletou ", businessName);
                await delay(Math.random() * (2000 - 1000) + 1000); // Atraso aleatório para evitar banimentos
                businesses.push(businessName);
            }

            results.push({
                page: pageIndex + 1,
                businesses
            });
        }

        await browser.close();
        log.info('Browser closed.');

        console.log("Results: ", results);
        return results;
    } catch (e) {
        log.error('Error during scraping in scrapeGoogleBusiness:', e);
        return [];
    }
};

// Função para obter o número máximo de páginas de resultados.
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
        console.error('Error during scraping in getMaxPage:', e);
        return 0;
    }
};


// Função para obter IDs dos negócios em uma página
const getBusinessIDs = async (page, fetchUrl) => {
    try {
        await page.goto(fetchUrl, {waitUntil: 'networkidle2'});
        return await page.evaluate(() => {
            const businessIDs = [];
            const businessCards = document.querySelectorAll('a.vwVdIc.wzN8Ac.rllt__link.a-no-hover-decoration');
            businessCards.forEach(element => businessIDs.push(element.getAttribute('data-cid')));
            return businessIDs;
        });
    } catch (e) {
        log.error('Error during scraping in getBusinessIDs:', e);
        return [];
    }
};

// Função para obter informações do negócio
const getBusinessInfo = async (page, fetchUrl) => {
    try {
        await page.goto(fetchUrl, {waitUntil: 'networkidle2'});
        await page.waitForSelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v', {timeout: 10000});

        return await page.evaluate(() => {
            const businessElement = document.querySelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v');
            if (businessElement) {
                const nameSpan = businessElement.querySelector('span');
                return nameSpan ? nameSpan.textContent.trim() : "";
            }
            return "";
        });
    } catch (e) {
        log.error('Error during scraping in getBusinessInfo:', e);
        return "";
    }
};

module.exports = scrapeGoogleBusiness;
