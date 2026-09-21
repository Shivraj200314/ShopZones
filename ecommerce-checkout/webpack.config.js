const {
  shareAll,
  withModuleFederationPlugin
} = require(
  '@angular-architects/module-federation/webpack'
);

module.exports =
  withModuleFederationPlugin({

    // Must match the name used by host
    name: 'checkout',

    // Generates:
    // http://localhost:4203/remoteEntry.js
    filename: 'remoteEntry.js',

    exposes: {

      // Module that host will load
      './CheckoutModule':
        './src/app/checkout/checkout.module.ts'

    },

    shared: {

      ...shareAll({
        singleton: true,
        strictVersion: true,
        requiredVersion: 'auto'
      })

    }

  });