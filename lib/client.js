import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_DEV_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_DEV_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_DEV_SANITY_API_VERSION,
  token: process.env.NEXT_PUBLIC_DEV_SANITY_TOKEN,
  useCdn: true,
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
