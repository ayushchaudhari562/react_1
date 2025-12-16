function Calendar({ attendance,currentDate,onPrev,onNext,onDateClick }) {
  const today=new Date()
  const year=currentDate.getFullYear()
  const month=currentDate.getMonth()
  const daysInMonth=new Date(year,month+1,0).getDate()
  const firstDay=new Date(year,month,1).getDay()
  const days=[...Array(daysInMonth)].map((_,i)=>i+1)
  return (
    <div className="w-full max-w-sm mt-6">

      <div className="flex justify-between mb-2">
        <button onClick={onPrev}>←</button>
        <span>
          {currentDate.toLocaleString("default",{month:"long"})} {year}
        </span>
        <button onClick={onNext}>→</button>
      </div>

      <div className="grid grid-cols-7 text-xs text-center text-gray-400 mb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {[...Array(firstDay)].map((_,i)=><div key={i}/>)}

        {days.map(d=>{
          const key=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`
          const status=attendance[key]
          const future=new Date(year,month,d)>today

          return(
            <div
              key={d}
              onClick={()=>!future&&onDateClick(key)}
              className={`h-10 flex items-center justify-center rounded-lg text-sm
              ${future?"bg-gray-800 text-gray-500":
              status==="present"?"bg-green-600":
              status==="absent"?"bg-red-600":"bg-gray-700"}`}
            >
              {d}
            </div>
          )
        })}
      </div>
    </div>
  )
}



export default Calendar
