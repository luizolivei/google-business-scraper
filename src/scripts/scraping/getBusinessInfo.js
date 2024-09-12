const moveMouseRandomly = require("./moveMouseRandomly");

const getBusinessInfo = async (page, fetchUrl) => {
    try {
        //ir para uma pagina em branco so para apagar o cache
        await page.goto('about:blank');
        await page.goto(fetchUrl, {waitUntil: 'networkidle2'});

        if (Math.random() < 0.3) {
            await moveMouseRandomly(page);
        }

        await page.waitForSelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v', {timeout: 10000});

        if (Math.random() < 0.7) {
            await moveMouseRandomly(page);
        }

        return await page.evaluate(async () => {
            const normalizeText = (text) => {
                return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim();
            };

            let businessName = "";
            let phoneNumber = "";
            let address = "";
            let rating = "";
            let reviewCount = 0;
            let website = "";
            let facebook = "";
            let instagram = "";
            let category = "";
            let compromissos = "";
            let description = "";
            let schedule = "";
            let gallery = [];

            try {
                const businessElement = document.querySelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v');
                if (businessElement) {
                    const nameSpan = businessElement.querySelector('span');
                    if (nameSpan) {
                        businessName = normalizeText(nameSpan.textContent);
                    }
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting business name:', e,
                    data: {}
                };
            }

            try {
                const phoneElement = document.querySelector('a[data-dtype="d3ph"] span[aria-label]');
                if (phoneElement) {
                    const phoneText = phoneElement.textContent;
                    phoneNumber = phoneText.replace(/\D/g, '');
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting phone number:', e,
                    data: {}
                };
            }

            try {
                const addressElement = document.querySelector('span.LrzXr');
                if (addressElement) {
                    address = normalizeText(addressElement.textContent);
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting address:', e,
                    data: {}
                };
            }

            try {
                const ratingContainer = document.querySelector('div.TLYLSe.MaBy9');
                if (ratingContainer) {
                    const ratingElement = ratingContainer.querySelector('span.yi40Hd.YrbPuc[aria-hidden="true"]');
                    if (ratingElement) {
                        rating = ratingElement.textContent.trim();
                    }

                    const reviewCountElement = ratingContainer.querySelector('span.RDApEe.YrbPuc');
                    if (reviewCountElement) {
                        reviewCount = parseInt(reviewCountElement.textContent.replace(/\D/g, ''), 10);
                    }
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting rating or review count:', e,
                    data: {}
                };
            }

            try {
                const websiteElement = document.querySelector('a.n1obkb');
                if (websiteElement) {
                    website = websiteElement.href;
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting website link:', e,
                    data: {}
                };
            }

            try {
                const facebookElement = document.querySelector('a[href*="facebook.com"]');
                if (facebookElement) {
                    facebook = facebookElement.href;
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting Facebook link:', e,
                    data: {}
                };
            }

            try {
                const instagramElement = document.querySelector('a[href*="instagram.com"]');
                if (instagramElement) {
                    instagram = instagramElement.href;
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting Instagram link:', e,
                    data: {}
                };
            }

            try {
                const compromissosElement = document.querySelector('a.xFAlBc');
                if (compromissosElement) {
                    compromissos = compromissosElement.href;
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting compromissos:', e,
                    data: {}
                };
            }

            try {
                const categoryElement = document.querySelector('span.YhemCb');
                if (categoryElement) {
                    const categoryText = normalizeText(categoryElement.textContent);
                    const categoryParts = categoryText.split(' em ');
                    if (categoryParts.length > 1) {
                        category = categoryParts[0];
                    }
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting category:', e,
                    data: {}
                };
            }

            try {
                // Por algum motivo o google decidiu colocar esse texto de duas formas diferentes nos cards dos anuncios
                // Primeira tentativa: Buscar o texto entre aspas duplas na div com jsname="EvNWZc"
                const descriptionElement = document.querySelector('div[jsname="EvNWZc"]');
                if (descriptionElement) {
                    const descriptionText = descriptionElement.textContent;
                    const match = descriptionText.match(/"(.*?)"/); // Regex para capturar o texto entre aspas duplas
                    if (match && match[1]) {
                        description = normalizeText(match[1]);
                    }
                }

                // Segunda tentativa: Se a primeira não encontrar nada, buscar na nova estrutura
                if (!description) {
                    const altDescriptionElement = document.querySelector('div[data-hveid][style="margin:0 16px 12px"]');
                    if (altDescriptionElement) {
                        const altDescriptionText = altDescriptionElement.textContent;
                        const altMatch = altDescriptionText.match(/"(.*?)"/); // Regex para capturar o texto entre aspas duplas
                        if (altMatch && altMatch[1]) {
                            description = normalizeText(altMatch[1]);
                        }
                    }
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting description:', e,
                    data: {}
                };
            }

            try {
                const scheduleElement = document.querySelector('table.WgFkxc');
                if (scheduleElement) {
                    const rows = scheduleElement.querySelectorAll('tr');
                    const scheduleArray = [];
                    rows.forEach(row => {
                        const day = normalizeText(row.querySelector('td.SKNSIb').textContent);
                        const hours = normalizeText(row.querySelectorAll('td')[1].textContent);
                        scheduleArray.push(`${day}: ${hours}`);
                    });
                    schedule = scheduleArray.join(', ');
                }
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting schedule:', e,
                    data: {}
                };
            }

            try {
                const galleryButtonSelector = 'button.llfsGb.KJY1Gc';
                const galleryDivSelector = '.DLfiPc';
                const galleryLinkSelector = 'a[jscontroller="pU86Hd"][jsaction="ebq3Kd; clickonly:ebq3Kd;"]';

                // Clica no botão de galeria
                const galleryButton = document.querySelector(galleryButtonSelector);
                if (galleryButton) {
                    galleryButton.click();
                }

                // Espera a div com a classe 'DLfiPc' carregar
                await new Promise((resolve) => {
                    const observer = new MutationObserver((mutations, obs) => {
                        if (document.querySelector(galleryDivSelector)) {
                            obs.disconnect();
                            resolve();
                        }
                    });
                    observer.observe(document, {
                        childList: true,
                        subtree: true,
                    });
                });

                // Captura apenas os links <a> com os atributos específicos
                const galleryLinks = document.querySelectorAll(galleryLinkSelector);
                galleryLinks.forEach(link => {
                    if (link.href) {
                        gallery.push(link.href);
                    }
                });
            } catch (e) {
                return {
                    error: true,
                    message: 'Error extracting gallery:', e,
                    data: {}
                };
            }

            return {
                error: false,
                message: "Scrapping do anuncio realizado com sucesso",
                data: {
                    name: businessName,
                    phone: phoneNumber,
                    address: address,
                    rating: rating,
                    reviewCount: isNaN(reviewCount) ? 0 : reviewCount,
                    website: website,
                    facebook: facebook,
                    instagram: instagram,
                    compromissos: compromissos,
                    description: description,
                    category: category,
                    schedule: schedule,
                    gallery: gallery
                }
            };
        });
    } catch (e) {
        return {
            error: true,
            message: 'Error during scraping in getBusinessInfo:', e,
            data: {}
        };
    }
};

module.exports = getBusinessInfo;
