import { useState, useEffect } from "react";
import { fetchBlogPost } from "../lib/api";

const useFetchBlog = (fetchUrl) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);

    const fetchPosts = async () => {
      const blogPosts = await fetchBlogPost(fetchUrl);
      setLoading(false);
      setPosts(blogPosts.data);
    };

    fetchPosts();
  }, [fetchUrl]);

  return { posts, loading };
};

export default useFetchBlog;
