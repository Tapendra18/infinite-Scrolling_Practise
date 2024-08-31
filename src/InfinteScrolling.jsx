import { useEffect, useState } from 'react';
import axios from 'axios';

function InfiniteScrolling() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://dummyjson.com/posts?limit=${postsPerPage}&skip=${
          (currentPage - 1) * postsPerPage
        }`
      );
      const { posts } = response.data;
      setData((prevData) => [...prevData, ...posts]);
      setHasMore(posts.length > 0);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 200 >=
        document.documentElement.scrollHeight
      ) {
        if (hasMore) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore]);

  return (
    <div className="infinite-scrolling">
      <h1>Trending Posts</h1>
      <div className="post-grid">
        {data.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-image">
              <img
                src={`https://dummyimage.com/300x450/000000/ffffff&text=${post.title.charAt(
                  0
                )}`}
                alt={post.title}
              />
            </div>
            <div className="post-info">
              <h3 className="post-title">{post.title}</h3>
              <p className="post-body-container">
                <span className="post-body">{post.body.substring(0, 100)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="loading">Loading...</div>}
      {!hasMore && <div className="end-of-posts">No more posts</div>}
    </div>
  );
}

export default InfiniteScrolling;
