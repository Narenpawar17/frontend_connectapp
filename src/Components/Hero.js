import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "axios";
import Loader from "./Loader";

const MiddleColumn = lazy(() => import("./MiddleColumn.js"));

const Hero = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const limit = 2;
  const maxPosts = 4;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://connectbackend17-0ohzrims.b4a.run/posts?limit=${limit}&offset=${(page - 1) * limit}`
        );

        const newPosts = response?.data?.filter(
          (newPost) => !posts.some((post) => post.id === newPost.id)
        );

        setPosts((prevPosts) => {
          const updatedPosts = [...prevPosts, ...newPosts];
          if (updatedPosts.length > maxPosts) {
            return updatedPosts.slice(-maxPosts);
          }
          return updatedPosts;
        });

        if (newPosts.length < limit) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 50 &&
        hasMore &&
        !loading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  return (
    <div className="-mt-10 -ml-10 -mr-10 bg-zinc-900 hero-container"> {/* Updated background color */}
      <Suspense fallback={<Loader />}>
        <div className="left-column"></div>
        <div className="middle-column">
          <h1 className="mb-8 -mt-10 text-2xl font-bold text-white ml-7">
            All Posts
          </h1>
          <div className="data-container">
            {posts.map((post) => (
              <MiddleColumn key={post.id} post={post} />
            ))}
          </div>
          {loading && <Loader />}
          {!hasMore && !loading && (
            <p className="mt-4 text-xl font-semibold text-center text-white">
              YOU HAVE REACHED THE END
            </p>
          )}
        </div>
        <div className="right-column"></div>
      </Suspense>
    </div>
  );
};

export default Hero;



