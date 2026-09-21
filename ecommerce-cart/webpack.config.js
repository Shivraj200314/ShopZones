const {
  withModuleFederationPlugin,
  shareAll
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'cart',

  exposes: {
    './CartModule':
      './src/app/cart/cart.module.ts'
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto'
    })
  }

});