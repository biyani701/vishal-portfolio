const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Completely disable source-map-loader for problematic packages
      webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
        if (rule.enforce === "pre" && rule.use) {
          return {
            ...rule,
            exclude: [
              ...(rule.exclude || []),
              /node_modules\/@0no-co/,
              /node_modules\/@urql/,
              /node_modules\/@copilotkit/,
            ]
          };
        }
        return rule;
      });

      // Add warning suppression
      webpackConfig.ignoreWarnings = [
        ...(webpackConfig.ignoreWarnings || []),
        /Failed to parse source map/,
        /source-map-loader/,
        /@0no-co\/graphql\.web/
      ];

      // Disable source maps entirely for node_modules in development
      if (webpackConfig.mode === 'development') {
        webpackConfig.module.rules.forEach((rule) => {
          if (rule.enforce === 'pre' && rule.use) {
            rule.use.forEach((use) => {
              if (use.loader && use.loader.includes('source-map-loader')) {
                use.exclude = [
                  ...(use.exclude || []),
                  /node_modules/
                ];
              }
            });
          }
        });
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