import Head from "next/head";

const defaultDescription = "";
const defaultOGURL = "";
const defaultOGImage = "";

export default ({ title, url, description, ogImage }) => (
  <Head>
    <meta charSet="utf-8" />
    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
    <title>{title || "Gourmet Twist"} </title>
    <meta name="description" content={description || defaultDescription} />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta property="og:url" content={url || defaultOGURL} />
    <meta property="og:title" content={title || "Gourmet Twist"} />
    <meta
      property="og:description"
      content={description || defaultDescription}
    />
    <meta name="twitter:site" content={url || defaultOGURL} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={ogImage || defaultOGImage} />
    <meta property="og:image" content={ogImage || defaultOGImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
  </Head>
);
