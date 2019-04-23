//
//
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/Scripts/reporting/'
        : '/Scripts/reporting/',
    configureWebpack: {
       //runtimeCompiler: true,
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        }
    }

};
