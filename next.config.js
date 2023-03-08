// module.exports = withPWA({
//   pwa: {
//     dest: 'public'
//   }
// })

module.exports = {
  images: {
    domains: ["s3.eu-west-2.amazonaws.com"],
  },
	reactStrictMode: true
};

const withPWA = require("next-pwa");
module.exports = withPWA({
	pwa: {
		dest: "public",
		register: true,
		skipWaiting: true,
	},
});

// module.exports = {
//   images: {
//     domains: ["s3.eu-west-2.amazonaws.com"],
//   },
//   webpack(config) {
//     config.module.rules.push({
//       test: /\.svg$/,
//       issuer: {
//         test: /\\.(js|ts|jsx|tsx)x?$/,
//       },
//       use: [
//         {
//           loader: "@svgr/webpack",
//         },
//         {
//           loader: "file-loader",
//         },
//       ],
//       type: "javascript/auto",
//     });

//     return config;
//   },
// };
