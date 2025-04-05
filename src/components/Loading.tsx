const Loading = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 min-h-screen py-10 px-5 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500 mx-auto mb-6"></div>
        <p className="text-xl font-semibold text-blue-200 shadow-md">
          Loading data...
        </p>
        <p className="text-gray-400 mt-2">Please wait.</p>
      </div>
    </div>
  );
};

export default Loading;
