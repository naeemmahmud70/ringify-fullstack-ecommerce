// config/config.ts
const config = {
  BASEURL: process.env.NEXT_PUBLIC_BASEURL,
  BLOGBASEURL: process.env.NEXT_PUBLIC_BLOG_BASE_URL,
  EMAILBASEURL: process.env.NEXT_PUBLIC_BASE_URL,
  CASHFREE_URL: process.env.NEXT_PUBLIC_CASHFREE_API,
  CASHFREE_ENV: process.env.NEXT_PUBLIC_CASHFREE_ENV,
  PROMO_1: process.env.NEXT_PUBLIC_PROMO_OFFER_1,
  PROMO_2: process.env.NEXT_PUBLIC_PROMO_OFFER_2,
  BASE_PRICE: process.env.NEXT_PUBLIC_BASE_PRICE,
};

export default config;
