'use strict';

const { sanitizeEntity } = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        // ensure request was not sent as formdata
        if (ctx.is('multipart'))
          return ctx.badRequest('Multipart requests are not accepted!', {
            id: 'Classroom.create.format.invalid',
            error: 'ValidationError',
          });
    
        // ensure the request has the right number of params
        const params = Object.keys(ctx.request.body).length;
        if (params !== 3)
          return ctx.badRequest('Invalid number of params!', {
            id: 'Classroom.create.body.invalid',
            error: 'ValidationError',
          });
    
        // validate the request
        const { name, strapi_id, google_classroom_id } = ctx.request.body;
        if (
          !name ||
          !strapi.services.validator.isInt(strapi_id) ||
          !strapi.services.validator.isInt(google_classroom_id)
        )
          return ctx.badRequest('A name, strapi_id, and google_classroom_id must be provided!', {
            id: 'Classroom.create.body.invalid',
            error: 'ValidationError',
          });
    
       
        // remove private fields and return the new classroom
        const googleclassroom = await strapi.services['google-classroom'].create(ctx.request.body);
        return sanitizeEntity(googleclassroom, { model: strapi.models.classroom });
      },
};
