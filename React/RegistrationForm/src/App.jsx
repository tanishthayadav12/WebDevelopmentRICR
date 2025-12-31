import React from "react";

function App() {
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        <header>
          <div className="w-full bg-amber-300 p-3 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNOHZTjTNfzlxgkO93TgCsYgk4jTU9Cm0zDA&s"
                alt=""
                className="w-[50px] h-[50px] rounded-full"
              />
              <h1 className="text-black font-bold text-2xl">
                Registration Page
              </h1>
            </div>
            <button className="bg-black text-amber-300 px-4 py-1 rounded text-shadow-blue-50 hover:bg-amber-300 hover:text-black ">
              Login
            </button>
          </div>
        </header>

        <main className="p-8">
          <div>
            <div className="border border-black rounded p-3 pt-4 my-3 relative">
              <span className="absolute -top-4 bg-white px-2 text-lg text-blue-600">
                Personal Information
              </span>

              <div className="grid gap-3">
                {[
                  ["Full Name", "text", "fullName"],
                  ["Email Address", "email", "email"],
                  ["Mobile no", "number", "mobile"],
                  ["D.O.B.", "date", "dob"],
                ].map(([label, type, id]) => (
                  <div key={id} className="flex items-center">
                    <label className="w-1/4 font-medium">
                      {label}: <sup className="text-red-500">*</sup>
                    </label>
                    <input
                      type={type}
                      id={id}
                      className="w-3/4 border rounded px-3 py-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-black rounded p-3 pt-4 my-3 relative">
              <span className="absolute -top-4 bg-white px-2 text-lg text-blue-600">
                Academic Details
              </span>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    Qualification: <sup className="text-red-500">*</sup>
                  </label>
                  <select className="w-3/4 border rounded px-3 py-1">
                    <option value="">--Select Qualification--</option>
                    <option>Secondary Schooling</option>
                    <option>Senior Secondary Schooling</option>
                    <option>Graduation</option>
                    <option>Post Graduation</option>
                    <option>P.hd</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    Percentage / Grade: <sup className="text-red-500">*</sup>
                  </label>
                  <input className="w-3/4 border rounded px-3 py-1" />
                </div>
              </div>
            </div>

            <div className="border border-black rounded p-3 pt-4 my-3 relative">
              <span className="absolute -top-4 bg-white px-2 text-lg text-blue-600">
                Course Information
              </span>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    Available Courses: <sup className="text-red-500">*</sup>
                  </label>
                  <select className="w-3/4 border rounded px-3 py-1">
                    <option value="">--Select Course</option>
                    <option>Full Stack Development</option>
                    <option>Data Science</option>
                    <option>Data Analytics</option>
                    <option>Java DSA</option>
                    <option>Python DSA</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    Preferred Batch: <sup className="text-red-500">*</sup>
                  </label>
                  <div className="flex gap-4">
                    {["Morning", "Afternoon", "Evening", "Weekends"].map(
                      (b) => (
                        <label key={b} className="flex items-center gap-2">
                          <input type="checkbox" />
                          <span>{b}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    Preferred Timing: <sup className="text-red-500">*</sup>
                  </label>
                  <div className="flex gap-4">
                    {["6:00-7:30 PM", "7:00-9:00 PM", "7:00-9:00 AM"].map(
                      (t) => (
                        <label key={t} className="flex items-center gap-2">
                          <input type="radio" name="timing" />
                          <span>{t}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-black rounded p-3 pt-4 my-3 relative">
              <span className="absolute -top-4 bg-white px-2 text-lg text-blue-600">
                Address
              </span>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    Address: <sup className="text-red-500">*</sup>
                  </label>
                  <textarea className="w-3/4 border rounded px-3 py-1" />
                </div>

                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    City: <sup className="text-red-500">*</sup>
                  </label>
                  <input className="w-3/4 border rounded px-3 py-1" />
                </div>

                <div className="flex items-center">
                  <label className="w-1/4 font-medium">
                    Pin Code: <sup className="text-red-500">*</sup>
                  </label>
                  <input className="w-3/4 border rounded px-3 py-1" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="reset"
                className="bg-red-600 text-white px-4 py-1 rounded"
              >
                Clear
              </button>
              <button className="bg-blue-600 text-white px-4 py-1 rounded">
                Submit
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
