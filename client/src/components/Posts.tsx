import { useState } from "react";
import { useGetPostsQuery, useAddPostMutation, useDeletePostMutation } from "../apiSlice/postsApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

function isFetchBaseQueryError(error: any): error is FetchBaseQueryError {
  return error && typeof error.status === "number";
}
function isSerializedError(error: any): error is SerializedError {
  return error && typeof error.message === "string";
}

function getErrorMessage(error: FetchBaseQueryError | SerializedError | undefined) {
  if (error) {
    if (isFetchBaseQueryError(error)) {
      return "Fetch error: " + (error.data?.toString() || "unknown error");
    } else if (isSerializedError(error)) {
      return "Serialized error: " + error.message;
    } else {
      return "An unknown error occurred.";
    }
  }
}

const Posts = () => {
  const { data: posts, isLoading, error } = useGetPostsQuery();
  const [addPost, { error: addPostError }] = useAddPostMutation();
  const [deletePost] = useDeletePostMutation();
  const [title, setTitle] = useState("new post");
  const [content, setContent] = useState("add some content");

  let errorMessage = getErrorMessage(error);
  let addPostErrorMessage = getErrorMessage(addPostError);

  const handleAddPost = async () => {
    try {
      await addPost({
        id: Date.now().toString(),
        title,
        content,
      }).unwrap();
    } catch (err) {
      console.error("Failed to add post:", err);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePost(id);
    } catch (err) {
      console.error("Failed to delete post: ", err);
    }
  };

  // const dispatch = useDispatch();
  // // Setup listeners (just in case)
  // useEffect(() => {
  //   setupListeners(dispatch);
  // }, [dispatch]);

  // useEffect(() => {
  //   const handleFocus = () => {
  //     refetch(); // Force refetch on focus
  //   };
  //   window.addEventListener("focus", handleFocus);
  //   return () => {
  //     window.removeEventListener("focus", handleFocus);
  //   };
  // }, [refetch]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {errorMessage && <div>Error: {errorMessage}</div>}
      <div style={{ marginBottom: "1rem", padding: "1rem", width: "50%", border: "1px solid #ccc" }}>
        <label htmlFor="title">Title: </label>
        <input id="title" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <br />
        <br />
        <label htmlFor="content">Content: </label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} />
        <br />
        <br />
        <button onClick={handleAddPost}>Add Post</button>
      </div>
      {addPostErrorMessage && <div>Error: {addPostErrorMessage}</div>}
      <hr />
      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => handleDeletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Posts;
