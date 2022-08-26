'use strict';

/**
 *  session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::session.session');
