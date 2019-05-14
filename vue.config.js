//
//
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? 'Tijmen/testke/Scripts/reporting/'
        : 'Tijmen/testke/Scripts/reporting/',
    configureWebpack: {
       //runtimeCompiler: true,
        resolve: {
            alias: {
               'vue$': 'vue/dist/vue.esm.js'
            }
        }
    }

};
