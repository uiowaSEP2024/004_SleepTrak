module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Plugin to only import modules that are used
    env: {
      production: {
        plugins: ['react-native-paper/babel']
      }
    }
  };
};
