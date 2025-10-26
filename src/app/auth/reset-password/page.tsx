export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="your@email.com" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
            Send Reset Link
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          <a href="/auth/login" className="text-blue-600 hover:underline">Back to login</a>
        </p>
      </div>
    </div>
  );
}
