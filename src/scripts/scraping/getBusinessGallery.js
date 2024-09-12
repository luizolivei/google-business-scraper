const log = require('electron-log');

const getBusinessGallery = async (page) => {
    try {

    } catch (e) {
        log.error('Error extracting gallery:', e);
        return [];
    }
};

module.exports = getBusinessGallery;
