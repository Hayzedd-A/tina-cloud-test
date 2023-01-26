import { useState, useEffect } from "react";
import { client } from "../lib/client";

const useFetchContent = (fetchQuery) => {
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);

    const fetchPostFromSanity = async () => {
      const data = await client.fetch(fetchQuery);
      setLoading(false);
      setPosts(data);
    };

    fetchPostFromSanity();
  }, [fetchQuery]);

  return { posts, loading };
};

export default useFetchContent;
