//
//
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        // ? 'testke/Scripts/reporting/'
        // : 'testke/Scripts/reporting/',
    ? 'reporting/'
    : 'reporting/',
    configureWebpack: {
       //runtimeCompiler: true,
        resolve: {
            alias: {
               'vue$': 'vue/dist/vue.esm.js'
            }
        }
    }

};
