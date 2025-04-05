const MyError = ({ message }: { message: any }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center justify-center">
      <div className="text-center">
        <svg
          className="mx-auto mb-6 h-16 w-16 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-3xl font-bold text-red-300 shadow-md mb-4">
          An Error Occurred
        </h2>
        {message && <p className="text-red-200 mb-4">{message}</p>}
        <p className="text-gray-400">Please try again later.</p>
      </div>
    </div>
  );
};

export default MyError;
