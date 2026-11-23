import { useEffect } from "react";


const LIMIT=10
const API = "https://dummyjson.com/posts"
export default function InfiniteScroll()
{
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error,setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const skipRef = useRef(0);
    const requestInProgessRef = useRef(false);
    const observerRef = useRef(null);

    const fetchPosts = useCallback(async ()=> {
        // prevent duplicate requests
        if(requestInProgessRef.current || !hasMore){
            return;
        }
        requestInProgessRef.current = true;
        setLoading(true)
        setError(null);

        try {
            const response = await fetch(
                 `${API_URL}?limit=${LIMIT}&skip=${skipRef.current}`
            )

            if(!response.ok){
                throw new Error("Failed to fetch posts");
            }

            const data = await response.json();
            // append new posts
            setPosts((prevPosts)=> [...prevPosts, ...data.posts]);
            // update pagination
            skipRef.current += data.posts.length;

            setHasMore(skipRef.current < data.total);

        } catch (error) {
            setError(error.message || "something went wrond");
        }finally{
            requestInProgessRef.current = false;
            setLoading(false);
        }
    },[hasMore]);

    // Initial API call
    useEffect(()=> {
        fetchPosts();
    },[]);

    // intersection observer.
    const lastPostRef = useCallback((node)=> {

        // disconnect previous observer
        if(observerRef.current){
            observerRef.current.disconnect();
        }

        // dont observe if there is no more data
        if(!node || !hasMore || loading){
            return;
        }

        observerRef.current = new IntersectionObserver(
            (entries)=> {
                const entry = entries[0];

                if(entry.isIntersecting){
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
    },[fetchPosts, hasMore, loading])


// cleanUp observer

    useEffect(()=> {
    return ()=> {
        observer.current?.disconnect();
    }
    },[])

    const handleRetry = () => {
    fetchPosts();
    }

    return (
    <div className="container">
      <h1>Infinite Scroll Posts</h1>

      <div className="posts-container">
        {posts.map((post, index) => {
          const isLastPost = index === posts.length - 1;

          return (
            <article
              key={post.id}
              ref={isLastPost ? lastPostRef : null}
              className="post-card"
            >
              <h2>{post.id}. {post.title}</h2>
              <p>{post.body}</p>
            </article>
          );
        })}
      </div>

      {loading && (
        <div className="loader">
          Loading more posts...
        </div>
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


// How to explain this in an interview
// I implemented infinite scrolling using the IntersectionObserver API. Initially, I fetch a batch of posts and maintain the pagination offset using a ref. I observe the last rendered post, and whenever it enters the viewport, I trigger the next API request. I append the newly fetched data to the existing state using a functional state update. To prevent duplicate requests, I maintain a request lock using a ref. I also handle loading, errors, retry, and stop fetching when all data is loaded. Finally, I disconnect the observer during cleanup to avoid memory leaks.