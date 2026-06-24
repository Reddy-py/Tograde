export default function Dashboard() {
  return (
    <main className="lg:ml-[280px] min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 w-full px-8 h-16 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            Welcome back Admin
          </h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">
          Top Grade Learning CRM
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          
          <div className="bg-white p-6 rounded-xl shadow">
            <p>Total Students</p>
            <h3 className="text-3xl font-bold">1,284</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Teachers</p>
            <h3 className="text-3xl font-bold">96</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Revenue</p>
            <h3 className="text-3xl font-bold">$42.5K</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Attendance</p>
            <h3 className="text-3xl font-bold">94.8%</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p>Pending Fees</p>
            <h3 className="text-3xl font-bold">$8.2K</h3>
          </div>

        </div>
      </div>
    </main>
  );
}

<h1 className="text-5xl font-bold text-red-500">
  Tailwind Working Test 🚀
</h1>