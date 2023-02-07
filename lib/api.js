export async function fetchBlogPost(url) {
  const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();
  return data;
}
