import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Loading from "./Loading";
import MyError from "./MyError";

const GET_POST = gql`
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      body
      user {
        name
        email
      }
    }
  }
`;

const SinglePostPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { id: parseInt(id || "1") },
  });

  if (loading) return <Loading />;
  if (error) return <MyError message={error.message} />;

  if (!data || !data.getPost)
    return <p className="text-yellow-300">Post not found.</p>;

  const { getPost: post } = data;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-purple-200 mb-6 shadow-md">
        <span className="text-purple-300">Single</span> Post
      </h2>
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-purple-700 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-blue-300 mb-4 shadow-sm">
          {post.title}
        </h3>
        <p className="text-gray-300 leading-relaxed mb-4">{post.body}</p>
        <div className="text-sm text-gray-400 border-t border-gray-700 pt-4">
          Author:{" "}
          <span className="text-green-300 font-semibold">
            {post.user?.name}
          </span>{" "}
          (<span className="text-yellow-300">{post.user?.email}</span>)
        </div>
      </div>
    </div>
  );
};

export default SinglePostPage;
