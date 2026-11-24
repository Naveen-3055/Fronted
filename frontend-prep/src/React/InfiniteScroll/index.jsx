
import {
  useState,
  useRef,
  useCallback,
  useEffect
} from "react";

const LIMIT = 10;
const API = "https://dummyjson.com/posts";

export default function InfiniteScroll() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const skipRef = useRef(0);
  const requestInProgressRef = useRef(false);
  const observerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(false);

  const loadedRef = useRef(new Set());
  const requestIdRef = useRef(0);
  const activeRequestIdRef = useRef(null);

  // Append only unique posts
  const appendUniquePosts = (newPosts) => {
    const uniquePosts = newPosts.filter((post) => {
      if (loadedRef.current.has(post.id)) {
        return false;
      }

      loadedRef.current.add(post.id);
      return true;
    });

    setPosts((prev) => [...prev, ...uniquePosts]);
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    if (
      requestInProgressRef.current ||
      !hasMore
    ) {
      return;
    }

    requestInProgressRef.current = true;

    const requestId = ++requestIdRef.current;
    activeRequestIdRef.current = requestId;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    const currentSkip = skipRef.current;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API}?limit=${LIMIT}&skip=${currentSkip}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();

      // Ignore stale responses
      if (
        !mountedRef.current ||
        requestId !== requestIdRef.current
      ) {
        return;
      }

      // Deduplicate
      appendUniquePosts(data.posts);

      // Update pagination only after success
      skipRef.current = currentSkip + data.posts.length;

      setHasMore(skipRef.current < data.total);

    } catch (err) {
      if (err.name === "AbortError") return;

      if (
        mountedRef.current &&
        requestId === requestIdRef.current
      ) {
        setError(err.message || "Something went wrong");
      }

    } finally {
      // Only the active request can release the lock
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null;
        requestInProgressRef.current = false;

        if (mountedRef.current) {
          setLoading(false);
        }
      }

      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [hasMore]);

  // Mount and unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;

      // Invalidate the previous request
      requestIdRef.current++;

      abortControllerRef.current?.abort();
      observerRef.current?.disconnect();

      requestInProgressRef.current = false;
      activeRequestIdRef.current = null;
    };
  }, []);

  // Initial API request
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Intersection Observer
  const lastPostRef = useCallback(
    (node) => {
      observerRef.current?.disconnect();

      if (!node || !hasMore || loading) {
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            fetchPosts();
          }
        },
        {
          root: null,
          rootMargin: "200px",
          threshold: 0
        }
      );

      observerRef.current.observe(node);
    },
    [fetchPosts, hasMore, loading]
  );

  const handleRetry = () => {
    fetchPosts();
  };

  return (
    <div className="container">
      <h1>Infinite Scroll Posts</h1>

      <div className="posts-container">
        {posts.map((post, index) => (
          <article
            key={post.id}
            ref={
              index === posts.length - 1
                ? lastPostRef
                : null
            }
            className="post-card"
          >
            <h2>{post.id}. {post.title}</h2>
            <p>{post.body}</p>
          </article>
        ))}
      </div>

      {loading && (
        <p className="loader">Loading more posts...</p>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button onClick={handleRetry}>
            Retry
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="end-message">
          You've reached the end!
        </p>
      )}

      {posts.length === 0 && !loading && !error && (
        <p>No posts found.</p>
      )}
    </div>
  );
}
