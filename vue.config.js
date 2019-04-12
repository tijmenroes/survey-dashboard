//
//
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? 'reporter/dist/'
        : 'reporter/',
    configureWebpack: {
       //runtimeCompiler: true,
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        }
    }

};

// vue.config.js
/*module.exports = {
    transpileDependencies: [

    ]
}*/
// module.exports = {
//     publicPath: process.env.NODE_ENV === 'production'
//         ? 'vuetify/dist/'
//         : 'vuetifypoep/'
// }
