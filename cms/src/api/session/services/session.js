'use strict';

/**
 * session service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::session.session');
