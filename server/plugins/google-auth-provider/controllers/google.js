'use strict';

/**
 * google-auth-provider.js controller
 *
 * @description: A set of functions called "actions" of the `google-auth-provider` plugin.
 */

module.exports = {

  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.
    console.log("Plugin")
    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },

  initGoogleLogin: async (ctx) => {
    const url = await strapi
      .plugins['google-auth-provider']
      .services.google
      .createAuthUrl();
    console.log(url)
    ctx.body = url;
  },

  initGoogleLoginCallback: async (ctx) => {
    const code = ctx.request.query.code

    // Create new user and store code in db
    const user = await strapi
      .plugins['google-auth-provider']
      .services.google
      .getUserProfile(code);
    
    ctx.body = user;
    ctx.send(user);
    // ctx.redirect(`http://localhost:3000/google-auth-login`);
  },

  getUserDetails: async (ctx) => {
    const token = ctx.request.header.authorization ? ctx.request.header.authorization.replace("Bearer ", "") : null;
    console.log(token);
    const userData = await strapi
      .plugins['google-auth-provider']
      .services.google
      .getUserDetailsFromToken(token)

    console.log(userData);
  },

  googleClassroomAssignmentUpload: async (ctx) => {
    console.log("I made it");
  }

};
