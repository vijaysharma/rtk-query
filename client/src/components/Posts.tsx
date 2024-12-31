import React, { useEffect } from "react";
import { useGetPostsQuery, useAddPostMutation, useDeletePostMutation } from "../apiSlice/postsApiSlice";
import { FetchBaseQueryError, setupListeners } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

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
  const { data: posts, isLoading, error, refetch } = useGetPostsQuery();
  const [addPost, { error: addPostError }] = useAddPostMutation();
  const [deletePost] = useDeletePostMutation();
  const [title, setTitle] = React.useState("new post");
  const [content, setContent] = React.useState("add some content");

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
      console.error("Failed to delete post:", err);
    }
  };

  const dispatch = useDispatch();
  // Setup listeners (just in case)
  useEffect(() => {
    setupListeners(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const handleFocus = () => {
      refetch(); // Force refetch on focus
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [refetch]);

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {errorMessage && <div>Error: {errorMessage}</div>}

      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <br />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <br />
      <button onClick={handleAddPost}>Add Post</button>
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
