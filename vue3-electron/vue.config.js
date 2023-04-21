const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  pluginOptions: {
      electronBuilder: {
          builderOptions: {
              productName: "Control inventario DecoAromas",
              //appId: 'test.com',
              win: {
                  "target": [
                      "nsis"
                  ],
                icon: 'public/decoaromas.png'
              },
              "nsis": {
                  "installerIcon": "public/decoaromas.ico",
                  "uninstallerIcon": "public/decoaromas.ico",
                  "uninstallDisplayName": "Control inventario DecoAromas",
                  //"license": "license.txt",
                  "oneClick": false,
                  "allowToChangeInstallationDirectory": true
              }
          },
      },
  },
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false
})
