const { v4: uuidv4 } = require('uuid');

/**
 *  Pagination
 *  @method getPagination
 *  @param
 */
exports.getPagination = (total, skip = 0, limit = 15) => {
    return new Promise((resolve, reject) => {
        resolve({
            total_items: total,
            skip: skip,
            limit: limit,
            total_pages: Math.ceil(total / limit),
            current_page: total === 0 ? 0 : Math.ceil(skip / limit) + 1,
        });
    });
}

/**
 * 
 *  @method getPageData
 *  @param
 */
exports.getPageData = (skip = 0, limit = 15) => {
    return {
        skip: parseInt(skip),
        limit: parseInt(limit)
    }
}

/**
 * 
 *  @method getPageData
 *  @param
 */
exports.generateReferalCode = () => {
    return new Promise((resolve, reject) => {
        const referalId = Math.random().toString(36).substring(7).toUpperCase();
        resolve(referalId);
    });
}