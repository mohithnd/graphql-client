import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-200 mb-8 shadow-md">
        GraphQL Data Fetching
      </h1>
      <nav className="bg-gray-800 rounded-lg p-6 shadow-lg border border-blue-700">
        <ul className="list-none p-0 m-0">
          <li className="mb-4">
            <Link
              to="/posts"
              className="inline-block bg-blue-700 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-105"
            >
              <span className="text-blue-100">All</span> Posts
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/users"
              className="inline-block bg-green-700 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-105"
            >
              <span className="text-green-100">All</span> Users
            </Link>
          </li>
          <li>
            <Link
              to="/comments"
              className="inline-block bg-purple-700 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out hover:scale-105"
            >
              <span className="text-purple-100">All</span> Comments
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
