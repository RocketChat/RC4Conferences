'use strict';

/**
 * event-session service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::event-session.event-session');
