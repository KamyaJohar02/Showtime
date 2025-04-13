/** @type {import('next').NextConfig} */
const nextConfig = {
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
      'cdn-icons-png.flaticon.com', // ✅ Added this line
    ],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
