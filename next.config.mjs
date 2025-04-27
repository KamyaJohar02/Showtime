// next.config.mjs
export default {
  images: {
    domains: [
      'upload.wikimedia.org',
      'www.residentialsystems.com',
      'i.ebayimg.com',
      'images.squarespace-cdn.com',
      'cf.bstatic.com',
      'fruitilicious.in',
      'cdn-icons-png.flaticon.com',
    ],
    unoptimized: true, // ✅ Add this line
  },
  reactStrictMode: true,
};
