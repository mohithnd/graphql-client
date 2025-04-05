import { useQuery, gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import MyError from "./MyError";
import { useState } from "react";

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      id
      title
      body
      user {
        id
        name
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      id
      userId
      title
      body
      user {
        id
        name
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      id
      title
      body
    }
  }
`;

interface CreatePostInput {
  id?: string;
  userId: string;
  title: string;
  body: string;
}

interface UpdatePostInput {
  id: string;
  title?: string;
  body?: string;
}

const AllPostsPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_POSTS);
  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      console.log("Post deleted successfully!");
      setDeletingPostId(null);
      refetch();
    },
    onError: (err) => {
      console.error("Error deleting post:", err);
      setDeletingPostId(null);
      alert(`Error deleting post: ${err.message}`);
    },
  });
  const [createPost, { loading: creating, error: createError }] = useMutation(
    CREATE_POST,
    {
      onCompleted: () => {
        console.log("Post created successfully!");
        setIsCreating(false);
        setNewPost({ userId: "", title: "", body: "" });
        refetch();
      },
      onError: (err) => {
        console.error("Error creating post:", err);
        alert(`Error creating post: ${err.message}`);
      },
    }
  );
  const [updatePost, { loading: updating, error: updateError }] = useMutation(
    UPDATE_POST,
    {
      onCompleted: () => {
        console.log("Post updated successfully!");
        setEditingPostId(null);
        refetch();
      },
      onError: (err) => {
        console.error("Error updating post:", err);
        alert(`Error updating post: ${err.message}`);
      },
    }
  );

  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<CreatePostInput>({
    userId: "",
    title: "",
    body: "",
  });
  const [updatedPost, setUpdatedPost] = useState<UpdatePostInput>({
    id: "",
    title: "",
    body: "",
  });

  if (loading) return <Loading />;
  if (error) return <MyError message={error.message} />;
  if (createError) return <MyError message={createError.message} />;
  if (updateError) return <MyError message={updateError.message} />;

  const handleDeletePost = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setDeletingPostId(id);
      deletePost({ variables: { id } });
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    createPost({ variables: { input: newPost } });
  };

  const handleStartEditing = (post: any) => {
    setEditingPostId(post.id);
    setUpdatedPost({
      id: post.id,
      title: post.title,
      body: post.body,
    });
  };

  const handleUpdatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedPost.id) {
      updatePost({ variables: { input: updatedPost } });
    }
  };

  const handleCancelEditing = () => {
    setEditingPostId(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center">
      <div className="w-full max-w-lg mb-6">
        <h2 className="text-3xl font-bold text-indigo-200 shadow-md flex items-center justify-between py-2">
          <span className="text-indigo-300">All</span> Posts
          <button
            onClick={() => setIsCreating(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
          >
            Create New Post
          </button>
        </h2>
      </div>

      {isCreating && (
        <div className="bg-gray-700 rounded-lg p-6 shadow-lg border border-green-700 w-full max-w-lg mb-6">
          <h3 className="text-xl font-semibold text-green-300 mb-4">
            Create New Post
          </h3>
          <form onSubmit={handleCreatePost} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="User ID"
              value={newPost.userId}
              onChange={(e) =>
                setNewPost({ ...newPost, userId: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <textarea
              placeholder="Body"
              value={newPost.body}
              onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
                disabled={creating || updating}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}

      <ul className="list-none p-4 m-0 bg-gray-800 rounded-lg shadow-lg border border-indigo-700 w-full max-w-lg">
        {data?.getAllPosts?.map((post: any) => (
          <li
            key={post.id}
            className="mb-4 p-3 rounded-md bg-gray-700 shadow-sm hover:shadow-md transition duration-200 ease-in-out"
          >
            {editingPostId === post.id ? (
              <div className="bg-gray-600 rounded-lg p-4 mb-2">
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                  Editing Post
                </h3>
                <form
                  onSubmit={handleUpdatePost}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    value={updatedPost.title || ""}
                    onChange={(e) =>
                      setUpdatedPost({ ...updatedPost, title: e.target.value })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <textarea
                    value={updatedPost.body || ""}
                    onChange={(e) =>
                      setUpdatedPost({ ...updatedPost, body: e.target.value })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                    rows={4}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
                      disabled={updating || creating}
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <Link
                    to={`/post/${post.id}`}
                    className="block text-white no-underline hover:text-indigo-200"
                  >
                    <h3 className="text-xl font-semibold text-blue-300 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-300 mb-1">
                      {post.body.substring(0, 100)}...
                    </p>
                    <p className="text-sm text-gray-400">
                      Author:{" "}
                      <span className="text-green-300">{post.user?.name}</span>
                    </p>
                  </Link>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEditing(post)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-md shadow-sm transition duration-200 ease-in-out"
                    disabled={
                      creating || updating || deletingPostId === post.id
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md shadow-sm transition duration-200 ease-in-out"
                    disabled={creating || updating || deletingPostId !== null}
                  >
                    {deletingPostId === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllPostsPage;
