const {
  withModuleFederationPlugin,
  shareAll
} = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'host',

remotes: {
  products: 'products@http://localhost:4201/remoteEntry.js',
  cart: 'cart@http://localhost:4202/remoteEntry.js',
  checkout: 'checkout@http://localhost:4203/remoteEntry.js',
orders: 'orders@http://localhost:4204/remoteEntry.js',
users:'users@http://localhost:4205/remoteEntry.js'
},
  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: false,
      requiredVersion: 'auto'
    })
  }

});