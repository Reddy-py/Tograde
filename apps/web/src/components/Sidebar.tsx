export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-white border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-900">
          Top Grade CRM
        </h1>
      </div>

      <nav className="flex flex-col gap-2 px-4">
        <button className="text-left p-3 rounded hover:bg-gray-100">
          Dashboard
        </button>

        <button className="text-left p-3 rounded hover:bg-gray-100">
          Students
        </button>

        <button className="text-left p-3 rounded hover:bg-gray-100">
          Teachers
        </button>

        <button className="text-left p-3 rounded hover:bg-gray-100">
          Courses
        </button>

        <button className="text-left p-3 rounded hover:bg-gray-100">
          Payments
        </button>
      </nav>
    </aside>
  );
}