/** @type {import('next').NextConfig} */
const nextConfig = {}
const withSecureHeaders = require('next-secure-headers');
const { createSecureHeaders } = require("next-secure-headers");

// module.exports = nextConfig //latest update 3/20/2024

// module.exports = {
//   async headers() {
//     return [
//       {
//         source: '/(.*)', // Matches all routes
//         headers: [
//           {
//             key: 'X-Frame-Options',
//             value: 'SAMEORIGIN',
//           },
//         ],
//       },
//     ];
//   },
// }

// module.exports = withSecureHeaders({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'", "'unsafe-inline'", 'https://fe-usermanagement.jasamarga.co.id/'],
//       styleSrc: ["'self'", "'unsafe-inline'", 'https://fe-usermanagement.jasamarga.co.id/'],
//       // Add more directives as needed
//     },
//   },
// })({
//   // Your Next.js configuration options
//   // async headers() {
//   //   return [
//   //     {
//   //       source: '/(.*)', // Matches all routes
//   //       headers: [
//   //         {
//   //           key: 'X-Frame-Options',
//   //           value: 'SAMEORIGIN',
//   //         },
//   //       ],
//   //     },
//   //   ];
//   // },
// });


module.exports = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: createSecureHeaders({
        contentSecurityPolicy: {
          directives: {
            frameAncestors: ["'self'", "http://jmclick-fe-jmclick-dev.apps.ocdev.jasamarga.co.id", "https://jm-click.jasamarga.co.id/"],
            // frameAncestors: ["'self'", "https://fe"]
          },
          // directives: { 
          //   defaultSrc: ["'self'"],
          //   scriptSrc: ["'self'", "'unsafe-inline'", 'http://aggregator-postgres-v3-aggregator-postgres-v3.apps.ocprd.jasamarga.co.id/'],
          //   styleSrc: ["'self'", "'unsafe-inline'", 'http://aggregator-postgres-v3-aggregator-postgres-v3.apps.ocprd.jasamarga.co.id/'],
          //   // Add more directives as needed
          // },
        },
        forceHTTPSRedirect: [true, { maxAge: 60 * 60 * 24 * 4, includeSubDomains: true }],
        referrerPolicy: "same-origin",
      })
    }];
  },
};