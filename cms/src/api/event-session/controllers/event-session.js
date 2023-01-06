'use strict';

/**
 *  event-session controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::event-session.event-session', ({ strapi }) =>  ({
    
    async find(ctx) {
      // some custom logic here
      
      // Calling the default core action
      const entity = await strapi.db.query('api::event-session.event-session').findMany({ populate: {
        session_items: {
            orderBy: ['start_time']
        } 
      }
    })
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
  
      // some more custom logic
  
      return this.transformResponse(sanitizedEntity);
    },
  }));
