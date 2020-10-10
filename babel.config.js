module.exports = {
    presets: ["@babel/preset-env", "@babel/preset-react"],
    plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
         "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
      ]
};
