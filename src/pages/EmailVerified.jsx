function EmailVerified() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
        <div className="mx-auto mb-5 flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
          <span className="text-5xl">✓</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Email Verified!
        </h1>

        <p className="text-gray-500 mb-6">
          Your email has been successfully verified. You can now login to your
          Project Camp account.
        </p>

        <a
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
}

export default EmailVerified;
