const log = require('electron-log');

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

module.exports = getBusinessIDs;
