export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Register</h1>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-3 rounded"
        />

        <button className="w-full bg-black text-white p-2 rounded">
          Create account
        </button>
      </div>
    </div>
  )
}