const withPWA = require('next-pwa')

// module.exports = withPWA({
//   pwa: {
//     dest: 'public'
//   }
// })

module.exports = {
  images: {
    domains: ["s3.eu-west-2.amazonaws.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
      },
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

