import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Loading from "./Loading";
import MyError from "./MyError";

const GET_COMMENT = gql`
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      name
      email
      body
      post {
        title
        body
      }
    }
  }
`;

const SingleCommentPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_COMMENT, {
    variables: { id: parseInt(id || "1") },
  });

  if (loading) return <Loading />;
  if (error) return <MyError message={error.message} />;

  if (!data || !data.getComment)
    return <p className="text-yellow-300">Comment not found.</p>;

  const { getComment: comment } = data;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-orange-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-orange-200 mb-6 shadow-md">
        <span className="text-orange-300">Single</span> Comment
      </h2>
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-orange-700 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-yellow-300 mb-4 shadow-sm">
          {comment.name}
        </h3>
        <p className="text-gray-300 mb-2">
          Email:{" "}
          <span className="text-purple-300 font-semibold">{comment.email}</span>
        </p>
        <p className="text-gray-300 leading-relaxed mb-4">{comment.body}</p>
        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-2">
            Related Post:
          </h4>
          <p className="text-gray-300 mb-1">
            Title: <span className="text-cyan-300">{comment.post?.title}</span>
          </p>
          <p className="text-gray-300">
            Body:{" "}
            <span className="text-green-300">
              {comment.post?.body.substring(0, 100)}...
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SingleCommentPage;
