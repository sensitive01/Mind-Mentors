

const EnterPassword = () => {
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-center text-gray-900">
              Sign In
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="operations@sensitive.co.in"
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent bg-gray-50"
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Next
            </button>
  
            <div className="text-center space-y-2">
              <div>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="text-sm text-gray-600">
                Dont have an account?{' '}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default EnterPassword;