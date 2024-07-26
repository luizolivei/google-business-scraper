const puppeteer = require('puppeteer-core');

const scrapeGoogleBusiness = async () => {
    const returnUrls = [];
    const searchTerm = "empresas+de+limpeza+em+gaspar+sc";
    const fetchUrl = `https://www.google.com/search?client=opera-gx&hs=I0p&sca_esv=2a9720fd994fa302&tbs=lf:1,lf_ui:2&tbm=lcl&sxsrf=ADLYWIJNhaEa0XJVawQXPp02XirmK6b9LQ:1721863953685&q=${searchTerm}&rflfq=1&num=10`;

    try {
        const browser = await puppeteer.launch({
            executablePath: 'browser/Application/chrome.exe'
        });
        const page = await browser.newPage();
        await page.goto(fetchUrl, { waitUntil: 'networkidle2' });

        const details = await page.evaluate(() => {
            const result = [];
            const elements = document.querySelectorAll('div.rllt__details');

            elements.forEach(div => {
                const links = document.querySelectorAll('a.fl');
                const linkTexts = [];
                links.forEach(link => {
                    linkTexts.push(link.textContent?.trim() ?? 'Não encontrado');
                });

                const nomeElement = div.querySelector('span.OSrXXb');
                const nome = nomeElement ? nomeElement.textContent?.trim() ?? 'Não encontrado' : 'Não encontrado';

                const avaliacaoElement = div.querySelector('span.RDApEe.YrbPuc');
                const avaliacao = avaliacaoElement ? avaliacaoElement.textContent?.trim() ?? 'Não encontrado' : 'Não encontrado';

                const divs = div.querySelectorAll('div');
                const data = [];
                if (divs.length > 1) {
                    data.push(divs[1].textContent?.trim() ?? 'Não encontrado');
                }
                if (divs.length > 2) {
                    data.push(divs[2].textContent?.trim() ?? 'Não encontrado');
                }

                result.push({ nome, avaliacao, data });
            });

            return result;
        });

        console.log(details);
    } catch (e) {
        console.log(e);
    }

    return returnUrls;
};

module.exports = scrapeGoogleBusiness;