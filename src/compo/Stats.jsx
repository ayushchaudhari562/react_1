function Stats({ attendance }) {

  const values=Object.values(attendance)
  const total=values.length
  const present=values.filter(v=>v==="present").length
  const percentage=total?Math.round(present/total*100):0
  const required=percentage>=75?0:Math.ceil((0.75*total-present)/0.25)
  return (
    <div className="flex flex-col items-center mb-6">

      <div
        className="w-40 h-40 rounded-full flex items-center justify-center mb-2"
        style={{
          background:`conic-gradient(${percentage>=75?"#22c55e":"#ef4444"} ${percentage}%,#374151 0)`
        }}
      >
        <div className="w-28 h-28 bg-gray-900 rounded-full flex items-center justify-center text-xl">
          {percentage}%
        </div>
      </div>

      <p className={`text-sm ${percentage>=75?"text-green-400":"text-red-400"}`}>
        {percentage>=75?"Safe attendance":`Attend next ${required} classes to reach 75%`}
      </p>

    </div>
  )
}

export default Stats
