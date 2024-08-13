const log = require('electron-log');

const getBusinessInfo = async (page, fetchUrl) => {
    try {
        await page.goto(fetchUrl, {waitUntil: 'networkidle2'});
        await page.waitForSelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v', {timeout: 10000});

        return await page.evaluate(() => {
            const businessElement = document.querySelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v');
            const phoneElement = document.querySelector('a[data-dtype="d3ph"] span[aria-label]');

            let businessName = "";
            let phoneNumber = "";

            if (businessElement) {
                const nameSpan = businessElement.querySelector('span');
                businessName = nameSpan ? nameSpan.textContent.trim() : "";
            }

            if (phoneElement) {
                const phoneText = phoneElement.textContent;
                // Extraindo apenas os números do texto
                phoneNumber = phoneText.replace(/\D/g, '');
            }

            return {
                name: businessName,
                phone: phoneNumber
            };
        });
    } catch (e) {
        log.error('Error during scraping in getBusinessInfo:', e);
        return {
            name: "",
            phone: ""
        };
    }
};

module.exports = getBusinessInfo;
