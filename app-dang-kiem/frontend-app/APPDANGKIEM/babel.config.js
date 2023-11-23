module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "moduleName": "@env",
        "path": ".env",
        "safe": false,
        "allowUndefined": true
      }],
      // [
      //   "@rnmapbox/maps",
      //   {
      //     "RNMapboxMapsImpl": "mapbox",
      //     "RNMapboxMapsDownloadToken": "sk.eyJ1IjoiaWJpbmgiLCJhIjoiY2t2YWZpdXdmMzd4cDMxbHBsNmU4NmNsMyJ9.WT8r42HijaCYAeUPq3xCxA"
      //   }
      // ],
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@src': './src',
            '@res': './res',
          },
        },
      ],
    ]
  };
};
