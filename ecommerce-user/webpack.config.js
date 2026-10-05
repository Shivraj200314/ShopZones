const {
  shareAll,
  withModuleFederationPlugin
} = require('@angular-architects/module-federation/webpack');

module.exports =
  withModuleFederationPlugin({

    name: 'ecommerceUser',

    exposes: {
      './UsersModule':
        './src/app/users.module.ts'
    },

    shared: {
      ...shareAll({
        singleton: true,
        strictVersion: false,
        requiredVersion: 'auto'
      })
    }

  });