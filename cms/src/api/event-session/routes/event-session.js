'use strict';

/**
 * event-session router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::event-session.event-session');
