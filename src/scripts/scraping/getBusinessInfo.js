const log = require('electron-log');

const getBusinessInfo = async (page, fetchUrl) => {
    try {
        await page.goto('about:blank');

        await page.goto(fetchUrl, { waitUntil: 'networkidle2' });

        const currentUrl = page.url();
        if (currentUrl !== fetchUrl) {
            log.error('URL mismatch: expected', fetchUrl, 'but got', currentUrl);
            return {
                name: "",
                phone: "",
                address: "",
                rating: "",
                reviewCount: 0,
                website: "",
                facebook: "",
                instagram: "",
                category: "",
                compromissos: "",
                description: "",
                schedule: ""
            };
        }

        await page.waitForSelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v', { timeout: 10000 });

        return await page.evaluate(() => {
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

            try {
                const businessElement = document.querySelector('h2.qrShPb.pXs6bb.PZPZlf.q8U8x.aTI8gc.PPT5v');
                if (businessElement) {
                    const nameSpan = businessElement.querySelector('span');
                    if (nameSpan) {
                        businessName = normalizeText(nameSpan.textContent);
                    }
                }
            } catch (e) {
                log.error('Error extracting business name:', e);
            }

            try {
                const phoneElement = document.querySelector('a[data-dtype="d3ph"] span[aria-label]');
                if (phoneElement) {
                    const phoneText = phoneElement.textContent;
                    phoneNumber = phoneText.replace(/\D/g, '');
                }
            } catch (e) {
                log.error('Error extracting phone number:', e);
            }

            try {
                const addressElement = document.querySelector('span.LrzXr');
                if (addressElement) {
                    address = normalizeText(addressElement.textContent);
                }
            } catch (e) {
                log.error('Error extracting address:', e);
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
                log.error('Error extracting rating or review count:', e);
            }

            try {
                const websiteElement = document.querySelector('a.n1obkb');
                if (websiteElement) {
                    website = websiteElement.href;
                }
            } catch (e) {
                log.error('Error extracting website link:', e);
            }

            try {
                const facebookElement = document.querySelector('a[href*="facebook.com"]');
                if (facebookElement) {
                    facebook = facebookElement.href;
                }
            } catch (e) {
                log.error('Error extracting Facebook link:', e);
            }

            try {
                const instagramElement = document.querySelector('a[href*="instagram.com"]');
                if (instagramElement) {
                    instagram = instagramElement.href;
                }
            } catch (e) {
                log.error('Error extracting Instagram link:', e);
            }

            try {
                const compromissosElement = document.querySelector('a.xFAlBc');
                if (compromissosElement) {
                    compromissos = compromissosElement.href;
                }
            } catch (e) {
                log.error('Error extracting compromissos:', e);
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
                log.error('Error extracting category:', e);
            }

            try {
                const descriptionElement = document.querySelector('div[style="margin:0 16px 12px"] > div:last-child');
                if (descriptionElement) {
                    description = normalizeText(descriptionElement.textContent);
                }
            } catch (e) {
                log.error('Error extracting description:', e);
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
                log.error('Error extracting schedule:', e);
            }

            return {
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
                schedule: schedule
            };
        });
    } catch (e) {
        log.error('Error during scraping in getBusinessInfo:', e);
        return {
            name: "",
            phone: "",
            address: "",
            rating: "",
            reviewCount: 0,
            website: "",
            facebook: "",
            instagram: "",
            compromissos: "",
            description: "",
            category: "",
            schedule: ""
        };
    }
};

module.exports = getBusinessInfo;
