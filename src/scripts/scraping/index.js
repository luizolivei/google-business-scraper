const puppeteer = require('puppeteer-core');
const log = require('electron-log');
const delay = require('./delay');
const randomUserAgent = require('./userAgent');
const getMaxPage = require('./getMaxPage');
const getBusinessIDs = require('./getBusinessIDs');
const getBusinessInfo = require('./getBusinessInfo');

const numberOfItensPerPage = 22;

const getDataFromSearch = async () => {
    const searchTerm = "floriculturas+em+blumenau";

    try {
        const results = [];
        const browser = await puppeteer.launch({executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe"});
        const page = await browser.newPage();
        await page.setUserAgent(randomUserAgent());

        const baseFetchUrl = `https://www.google.com/search?client=opera-gx&tbm=lcl&q=${searchTerm}&rflfq=1&num=10`;

        // const totalPages = await getMaxPage(page, baseFetchUrl);
        const totalPages = 1;

        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            console.log("Página ", pageIndex);
            const start = pageIndex * numberOfItensPerPage;
            const pageFetchUrl = `${baseFetchUrl}&start=${start}`;
            console.log("pageFetchUrl", pageFetchUrl);
            const businessIDs = await getBusinessIDs(page, pageFetchUrl);
            const businesses = [];

            for (const businessID of businessIDs) {
                const businessInfoFetchUrl = `${baseFetchUrl}&start=${start}#rlfi=hd:;si:${businessID}`;
                const businessInfo = await getBusinessInfo(page, businessInfoFetchUrl);
                console.log("coletou ", businessInfo);
                await delay(Math.random() * (2000 - 1000) + 1000); // Atraso aleatório para evitar banimentos
                businesses.push(businessInfo);
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

module.exports = getDataFromSearch;
