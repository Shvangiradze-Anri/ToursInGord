function PageNotFound() {
  return (
    <div className="flex items-center  justify-center h-screen dark:bg-black">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-300">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-400 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-gray-600 dark:text-gray-500">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <a
          href="/"
          className="mt-6 inline-block bg-blue-700 hover:bg-blue-800 dark:bg-orange-500 dark:hover:bg-orange-400 text-white dark:text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Go back to home
        </a>
      </div>
    </div>
  );
}

export default PageNotFound;
