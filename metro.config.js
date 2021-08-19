const { getDefaultConfig } = require('@expo/metro-config')

const defaultConfig = getDefaultConfig(__dirname)

defaultConfig.resolver.assetExts.push('db', 'mp3', 'ttf', 'otf', 'obj', 'png', 'jpg', 'mtl')

module.exports = defaultConfig
