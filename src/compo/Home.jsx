import { useState, useEffect } from "react"



















function Home({ username, setDashboard }) {
 const clearAttendance = () => {
  const ok = window.confirm("Clear all attendance data?")
  if (!ok) return

  localStorage.removeItem("attendance")
  window.location.reload()
}

  const [subjects, setSubjects] = useState(
    () => JSON.parse(localStorage.getItem("subjects")) || ["Maths","Physics","Chemistry","English"]
  )
  const [currentSubject, setCurrentSubject] = useState(subjects[0])
  const [editing, setEditing] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects))
  }, [subjects])


//ATTENDANCE


  const allAttendance = JSON.parse(localStorage.getItem("attendance")) || {}
  const attendance = allAttendance[currentSubject] || {}

  const values = Object.values(attendance)
  const total = values.length
  const present = values.filter(v => v === "present").length
  const percentage = total ? Math.round((present / total) * 100) : 0
  const required = percentage >= 75 ? 0 : Math.ceil((0.75 * total - present) / 0.25)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const days = Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, i) => i + 1)
  const firstDay = new Date(year, month, 1).getDay()
  const today = new Date()

  const saveAttendance = (status) => {
    const updated = { ...allAttendance }

    updated[currentSubject] = {
      ...(updated[currentSubject] || {}),
      [selectedDate]: status
    }

    localStorage.setItem("attendance", JSON.stringify(updated))
    setShowModal(false)
  }
  
  const removeAttendance = () => {
    const updated = { ...allAttendance }

    delete updated[currentSubject][selectedDate]

    if (Object.keys(updated[currentSubject]).length === 0) {
      delete updated[currentSubject]
    }

    localStorage.setItem("attendance", JSON.stringify(updated))
    setShowModal(false)
  }

  const addSubject = () => {
    const name = `Subject ${subjects.length + 1}`
    setSubjects([...subjects, name])
    setCurrentSubject(name)
  }

  const deleteSubject = (sub) => {
    setSubjects(subjects.filter(s => s !== sub))
    const updated = { ...allAttendance }
    delete updated[sub]
    localStorage.setItem("attendance", JSON.stringify(updated))
    setCurrentSubject(subjects[0])
  }
 






//rendering

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 pb-32 overflow-x-hidden overflow-y-scroll no-scrollbar">

      <div className="flex flex-col items-center mt-6">
        <h1 className="text-2xl font-bold  bg-white/7 backdrop-blur-lg shadow-xl border border-white/5
 p-1 rounded-2xl ">{username}</h1>
        <p className="text-gray-400 mb-3">Attendance</p>

        <div className="flex justify-between w-full p-2 max-w-sm mb-2 bg-white/5 backdrop-blur-md rounded-2xl">
          <span>Subjects</span>
          <div className="flex gap-3 text-sm ">
            <button onClick={addSubject} className="text-green-400 cursor-pointer" >+ Add</button>
            <button onClick={() => setEditing(!editing)} className="text-yellow-400 cursor-pointer">
              {editing ? "Done" : "Edit"}
            </button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto w-full max-w-sm mb-4 no-scrollbar ">
          {subjects.map((s, i) => (
            <div
              key={i}
              onClick={() => !editing && setCurrentSubject(s)}
              className={` bg-white/5 backdrop-blur-md p-2 rounded-2xl text-sm ${currentSubject === s ? "bg-yellow-600 cursor-pointer" : "bg-gray-800 cursor-pointer"}`}
            >
              {editing ? (
                <>
                  <input
                    value={s}
                    onChange={e => {
                      const copy = [...subjects]
                      copy[i] = e.target.value
                      setSubjects(copy)
                    }}
                    className="bg-transparent w-20 outline-none"
                  />
                  <span onClick={() => deleteSubject(s)} className="ml-2 text-red-400">✕</span>
                </>
              ) : s}
            </div>
          ))}
        </div>
      <div
          className="w-40 h-40 rounded-full flex items-center justify-center mb-2"
          style={{
            background: `conic-gradient(${percentage >= 75 ? "#22c55e" : "#ef4444"} ${percentage}%, #374151 0)`
          }}
        >
          <div className="w-28 h-28 bg-gray-900 rounded-full flex items-center justify-center text-xl">
            {percentage}%
          </div>
        </div>
        <p className={`text-sm mb-4 ${percentage >= 75 ? "text-green-400" : "text-red-400"}`}>
          {percentage >= 75 ? "Safe attendance" : `Attend next ${required} classes to reach 75%`}
        </p>
          <br />
        <div className="flex justify-between w-full max-w-sm mb-2">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>←</button>
          <span>{currentDate.toLocaleString("default", { month: "long" })} {year}</span>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>→</button>
        </div>

        <div className="grid grid-cols-7 gap-2 w-full max-w-sm text-xs text-gray-400 text-center mb-1">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-2 w-full max-w-sm cursor-pointer">
          {Array.from({ length: firstDay }).map((_, i) => <div key={i} />)}

          {days.map(d => {
            const key = `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`
            const status = attendance[key]
            const future = new Date(year, month, d) > today

            return (
              <div
                key={d}
                onClick={() => {
                  if (future) return
                  setSelectedDate(key)
                  setShowModal(true)
                }}
                className={`h-10 flex items-center justify-center rounded-lg text-sm
                ${future ? "bg-gray-800 text-gray-500"
                : status === "present" ? "bg-green-600"
                : status === "absent" ? "bg-red-600"
                : "bg-gray-700"}`}
              >
                {d}
              </div>
            )
          })}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 w-full max-w-sm p-6 rounded-t-2xl">
            <p className="text-center mb-4">{currentSubject} • {selectedDate}</p>

            {attendance[selectedDate] ? (
              <button
                onClick={removeAttendance}
                className="w-full bg-gray-700 py-3 rounded-xl"
              >
                Remove Attendance
              </button>
            ) : (
              <div className="flex gap-4 justify-center ">
                <button onClick={() => saveAttendance("present")} className="flex-1 col-end-1 bg-green-600 py-3 rounded-xl">
                  Present
                </button>
                <button onClick={() => saveAttendance("absent")} className="flex-1 bg-red-600 py-3 rounded-xl">
                  Absent
                </button>
              </div>
            )}

            <button onClick={() => setShowModal(false)} className="mt-4 w-full text-gray-400">
              Cancel
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn")
          setDashboard(false)
        }}
        className="fixed bottom-15 right-6 bg-red-600 px-6 py-3 rounded-xl"
      >
        Logout
      </button>
<button
  onClick={clearAttendance}
  className="fixed bottom-15 left-6 bg-blue-300 px-5 py-3 rounded-2xl font-semibold text-black"
>
  Clear Data
</button>
    </div>
  )
}

export default Home
