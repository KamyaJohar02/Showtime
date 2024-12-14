/** @type {import('next').NextConfig} */
const nextConfig = {
  target: "serverless", // Use serverless target for Netlify
  experimental: {
    appDir: true, // Only if you're using the experimental `app` directory
  },
  images: {
    domains: [
      'upload.wikimedia.org',
      'www.residentialsystems.com',
      'i.ebayimg.com',
      'images.squarespace-cdn.com',
      'cf.bstatic.com',
      'fruitilicious.in',
    ],
  },
  reactStrictMode: true, // Properly aligned here
};

module.exports = nextConfig;
