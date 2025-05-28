const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const sourceMapLoader = webpackConfig.module.rules.find(
        (rule) =>
          rule.enforce === "pre" &&
          rule.use &&
          rule.use.some((use) => {
            return (
              typeof use === "object" &&
              use.loader &&
              use.loader.includes("source-map-loader")
            );
          })
      );

      if (sourceMapLoader) {
        sourceMapLoader.exclude = [
          /[\\/]node_modules[\\/]@urql[\\/]core[\\/]/,
          /[\\/]node_modules[\\/]@0no-co[\\/]graphql\.web[\\/]/,
        ];
      }

      // Add .md and .mdx support
      webpackConfig.module.rules.push({
        test: /\.mdx?$/,
        use: [
          {
            loader: "@mdx-js/loader",
            options: {
              jsx: true,
            },
          },
        ],
        include: path.resolve(__dirname, "src"),
      });

      return webpackConfig;
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".md", ".mdx"],
  },
};
