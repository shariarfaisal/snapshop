export default function SignupPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input type="text" className="w-full px-4 py-2 border rounded-lg" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <a href="/auth/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
