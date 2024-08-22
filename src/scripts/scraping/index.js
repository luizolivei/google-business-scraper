const puppeteer = require('puppeteer-core');
const log = require('electron-log');
const delay = require('./delay');
const randomUserAgent = require('./userAgent');
const getMaxPage = require('./getMaxPage');
const getBusinessIDs = require('./getBusinessIDs');
const getBusinessInfo = require('./getBusinessInfo');
const moveMouseRandomly = require("./moveMouseRandomly");

const numberOfItensPerPage = 20;

const getDataFromSearch = async (searchTerm) => {
    try {
        const results = [];
        const browser = await puppeteer.launch({executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe"});
        const page = await browser.newPage();
        await page.setRequestInterception(true);
        await page.setUserAgent(randomUserAgent());
        page.on('request', (request) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(request.resourceType())) {
                request.abort();
            } else {
                request.continue();
            }
        });

        const baseFetchUrl = `https://www.google.com/search?client=opera-gx&tbm=lcl&q=${searchTerm}&rflfq=1&num=10`;

        let totalPages = await getMaxPage(page, baseFetchUrl);
        if (totalPages === 0) totalPages = 1;

        log.info("Paginas ", totalPages)

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            //caso a pagina seja um multiplo de 5 o sistema espera 5 minutos para continuar
            if ((pageIndex + 1) % 5 === 0) {
                log.info(`Esperando 5 minutos antes de prosseguir para a próxima página...`);
                await delay(300000);
            }

            const start = pageIndex * numberOfItensPerPage + (pageIndex > 2 ? 20 : 0);

            const pageFetchUrl = `${baseFetchUrl}&start=${start}`;
            log.info("Busca ", pageFetchUrl)
            const businessIDs = await getBusinessIDs(page, pageFetchUrl);

            if (Math.random() < 0.3) {
                await moveMouseRandomly(page);
            }

            const businesses = [];

            for (const businessID of businessIDs) {
                const businessInfoFetchUrl = `${baseFetchUrl}&start=${start}#rlfi=hd:;si:${businessID}`;
                const businessInfo = await getBusinessInfo(page, businessInfoFetchUrl);
                if (businessInfo.name) {
                    log.info("Coletou a empresa ", businessInfo.name)
                    businesses.push(businessInfo);
                }

                await delay(Math.random() * (15000 - 5000) + 5000);

                if (Math.random() < 0.3) {
                    await moveMouseRandomly(page);
                }
            }

            results.push({
                page: pageIndex + 1,
                businesses
            });
        }

        await browser.close();
        log.info('Browser closed.');
        return results;
    } catch (e) {
        log.error('Error during scraping in scrapeGoogleBusiness:', e);
        return [];
    }
};

module.exports = getDataFromSearch;
