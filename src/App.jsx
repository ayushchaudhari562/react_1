import { useState, useEffect } from "react"
import "./App.css"
import Home from "./compo/Home"
function App() {
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dashboard, setDashboard] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    const savedUser = JSON.parse(localStorage.getItem("user"))
    if (loggedIn === "true" && savedUser?.username) {
      setUsername(savedUser.username)
      setDashboard(true)
    } else {
      localStorage.removeItem("isLoggedIn")
    }
  }, [])

  const handleAuth = (type) => {
    if (loading) return
    setLoading(true)

    if (type === "signup") {
      if (password !== confirmPassword) {
        alert("Passwords do not match")
        setLoading(false)
        return
      }
      localStorage.setItem("user", JSON.stringify({ username, password }))
    }

    const savedUser = JSON.parse(localStorage.getItem("user"))
    if (!savedUser || savedUser.username !== username || savedUser.password !== password) {
      alert("Invalid credentials")
      setLoading(false)
      return
    }

    localStorage.setItem("isLoggedIn", "true")
    setTimeout(() => {
      setLoading(false)
      setDashboard(true)
    }, 700)
  }

  if (dashboard) {
    return <Home username={username} setDashboard={setDashboard} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className={`w-full max-w-sm bg-gray-900/80 backdrop-blur-xl text-white p-6 rounded-2xl shadow-xl ${isSignup ? "slide-left" : "slide-right"}`}>

        <h1 className="text-2xl font-bold text-center mb-6">
          {isSignup ? "Create Account" : "Sign In"}
        </h1>

        <div className="space-y-4">
          <div className="float-group">
            <input
              className="float-input w-full p-3 rounded-xl bg-gray-800 border border-gray-700"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label className="float-label">Username</label>
          </div>

          <div className="float-group">
            <input
              type="password"
              className="float-input w-full p-3 rounded-xl bg-gray-800 border border-gray-700"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="float-label">Password</label>
          </div>

          {isSignup && (
            <div className="float-group">
              <input
                type="password"
                className="float-input w-full p-3 rounded-xl bg-gray-800 border border-gray-700"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className="float-label">Confirm Password</label>
            </div>
          )}
        </div>

        <button
          onClick={() => handleAuth(isSignup ? "signup" : "signin")}
          className="ripple w-full bg-gradient-to-r from-yellow-600 to-yellow-800 py-3 rounded-xl font-semibold mt-6 flex justify-center"
        >
          {loading ? <div className="spinner" /> : isSignup ? "Sign Up" : "Sign In"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-400">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span
            className="text-yellow-400 cursor-pointer ml-1"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </span>
        </p>

      </div>
    </div>
  )
}

export default App
