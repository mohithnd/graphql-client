import { useQuery, gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import MyError from "./MyError";
import { useState } from "react";

const GET_ALL_COMMENTS = gql`
  query GetAllComments {
    getAllComments {
      id
      postId
      name
      email
      body
      post {
        id
        title
      }
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(id: $id)
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      postId
      name
      email
      body
      post {
        id
        title
      }
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      id
      postId
      name
      email
      body
      post {
        id
        title
      }
    }
  }
`;

interface CreateCommentInput {
  id?: string;
  postId: string;
  name: string;
  email: string;
  body: string;
}

interface UpdateCommentInput {
  id: string;
  postId?: string;
  name?: string;
  email?: string;
  body?: string;
}

const AllCommentsPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_COMMENTS);
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => {
      console.log("Comment deleted successfully!");
      setDeletingCommentId(null);
      refetch();
    },
    onError: (err) => {
      console.error("Error deleting comment:", err);
      setDeletingCommentId(null);
      alert(`Error deleting comment: ${err.message}`);
    },
  });
  const [createComment, { loading: creating, error: createError }] =
    useMutation(CREATE_COMMENT, {
      onCompleted: () => {
        console.log("Comment created successfully!");
        setIsCreating(false);
        setNewComment({ postId: "", name: "", email: "", body: "" });
        refetch();
      },
      onError: (err) => {
        console.error("Error creating comment:", err);
        alert(`Error creating comment: ${err.message}`);
      },
    });
  const [updateComment, { loading: updating, error: updateError }] =
    useMutation(UPDATE_COMMENT, {
      onCompleted: () => {
        console.log("Comment updated successfully!");
        setEditingCommentId(null);
        refetch();
      },
      onError: (err) => {
        console.error("Error updating comment:", err);
        alert(`Error updating comment: ${err.message}`);
      },
    });

  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<CreateCommentInput>({
    postId: "",
    name: "",
    email: "",
    body: "",
  });
  const [updatedComment, setUpdatedComment] = useState<UpdateCommentInput>({
    id: "",
    postId: "",
    name: "",
    email: "",
    body: "",
  });

  if (loading) return <Loading />;
  if (error) return <MyError message={error.message} />;
  if (createError) return <MyError message={createError.message} />;
  if (updateError) return <MyError message={updateError.message} />;

  const handleDeleteComment = (id: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setDeletingCommentId(id);
      deleteComment({ variables: { id } });
    }
  };

  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    createComment({
      variables: {
        input: {
          ...newComment,
          id: Math.floor(Math.random() * 90000) + 10000,
        },
      },
    });
  };

  const handleStartEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setUpdatedComment({
      id: comment.id,
      postId: comment.postId,
      name: comment.name,
      email: comment.email,
      body: comment.body,
    });
  };

  const handleUpdateComment = (e: React.FormEvent) => {
    e.preventDefault();
    updateComment({ variables: { input: updatedComment } });
  };

  const handleCancelEditing = () => {
    setEditingCommentId(null);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-pink-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center">
      <div className="w-full max-w-lg mb-6">
        <h2 className="text-3xl font-bold text-pink-200 shadow-md flex items-center justify-between py-2">
          <span className="text-pink-300">All</span> Comments
          <button
            onClick={() => setIsCreating(true)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-sm transition duration-200 ease-in-out"
          >
            Create New Comment
          </button>
        </h2>
      </div>

      {isCreating && (
        <div className="bg-gray-700 rounded-lg p-6 shadow-lg border border-green-700 w-full max-w-lg mb-6">
          <h3 className="text-xl font-semibold text-green-300 mb-4">
            Create New Comment
          </h3>
          <form onSubmit={handleCreateComment} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Post ID"
              value={newComment.postId}
              onChange={(e) =>
                setNewComment({ ...newComment, postId: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <input
              type="text"
              placeholder="Name"
              value={newComment.name}
              onChange={(e) =>
                setNewComment({ ...newComment, name: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newComment.email}
              onChange={(e) =>
                setNewComment({ ...newComment, email: e.target.value })
              }
              className="bg-gray-800 text-white rounded-md py-2 px-3"
              required
            />
            <textarea
              placeholder="Body"
              value={newComment.body}
              onChange={(e) =>
                setNewComment({ ...newComment, body: e.target.value })
              }
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

      <ul className="list-none p-4 m-0 bg-gray-800 rounded-lg shadow-lg border border-pink-700 w-full max-w-lg">
        {data?.getAllComments?.map((comment: any) => (
          <li
            key={comment.id}
            className="mb-4 p-4 rounded-md bg-gray-700 shadow-sm hover:shadow-md transition duration-200 ease-in-out"
          >
            {editingCommentId === comment.id ? (
              <div className="bg-gray-600 rounded-lg p-4 mb-2">
                <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                  Editing Comment
                </h3>
                <form
                  onSubmit={handleUpdateComment}
                  className="flex flex-col gap-3"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={updatedComment.name}
                    onChange={(e) =>
                      setUpdatedComment({
                        ...updatedComment,
                        name: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={updatedComment.email}
                    onChange={(e) =>
                      setUpdatedComment({
                        ...updatedComment,
                        email: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white rounded-md py-2 px-3"
                    required
                  />
                  <textarea
                    placeholder="Body"
                    value={updatedComment.body}
                    onChange={(e) =>
                      setUpdatedComment({
                        ...updatedComment,
                        body: e.target.value,
                      })
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
                      disabled={updating}
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
                    to={`/comment/${comment.id}`}
                    className="block text-white no-underline hover:text-pink-200"
                  >
                    <h3 className="text-xl font-semibold text-fuchsia-300 mb-1">
                      {comment.name}
                    </h3>
                    <p className="text-gray-300 mb-1">
                      Email:{" "}
                      <span className="text-lime-300">{comment.email}</span>
                    </p>
                    <p className="text-gray-300 mb-2">
                      {comment.body.substring(0, 100)}...
                    </p>
                    <p className="text-sm text-gray-400">
                      Post:{" "}
                      <span className="text-blue-300">
                        {comment.post?.title}
                      </span>{" "}
                      (ID:{" "}
                      <span className="text-orange-300">
                        {comment.post?.id}
                      </span>
                      )
                    </p>
                  </Link>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStartEditing(comment)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded-md shadow-sm transition duration-200 ease-in-out"
                    disabled={
                      creating || updating || deletingCommentId === comment.id
                    }
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-md shadow-sm transition duration-200 ease-in-out"
                    disabled={
                      creating || updating || deletingCommentId !== null
                    }
                  >
                    {deletingCommentId === comment.id
                      ? "Deleting..."
                      : "Delete"}
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

export default AllCommentsPage;
