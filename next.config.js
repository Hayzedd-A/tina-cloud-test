const withPWA = require('next-pwa')

// module.exports = withPWA({
//   pwa: {
//     dest: 'public'
//   }
// })

module.exports = {
  images: {
    domains: ['s3.eu-west-2.amazonaws.com'],
  },
}