import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import Loading from "./Loading";
import MyError from "./MyError";

const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      username
      email
      phone
      website
    }
  }
`;

const SingleUserPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: parseInt(id || "1") },
  });

  if (loading) return <Loading />;
  if (error) return <MyError message={error.message} />;

  if (!data || !data.getUser)
    return <p className="text-yellow-300">User not found.</p>;

  const { getUser: user } = data;

  return (
    <div className="bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-emerald-200 mb-6 shadow-md">
        <span className="text-emerald-300">Single</span> User
      </h2>
      <div className="bg-gray-800 rounded-lg p-8 shadow-lg border border-emerald-700 w-full max-w-md">
        <h3 className="text-2xl font-semibold text-lime-300 mb-4 shadow-sm">
          {user.name}
        </h3>
        <p className="text-gray-300 mb-2">
          Username:{" "}
          <span className="text-cyan-300 font-semibold">{user.username}</span>
        </p>
        <p className="text-gray-300 mb-2">
          Email:{" "}
          <span className="text-purple-300 font-semibold">{user.email}</span>
        </p>
        <p className="text-gray-300 mb-2">
          Phone:{" "}
          <span className="text-orange-300 font-semibold">{user.phone}</span>
        </p>
        <p className="text-gray-300">
          Website:{" "}
          <a
            href={user.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-400 transition duration-200"
          >
            {user.website}
          </a>
        </p>
      </div>
    </div>
  );
};

export default SingleUserPage;
