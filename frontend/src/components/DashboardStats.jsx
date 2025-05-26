import React from "react";

const StatCard = ({ title, value, bgColor = "bg-white" }) => (
  <div className={`${bgColor} p-6 rounded-lg shadow-md border border-gray-200`}>
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
  </div>
);

const DashboardStats = ({ tasks }) => {
  const getStats = () => {
    const stats = {
      total: tasks.length,
      overdue: tasks.filter((task) => task.status === "Expired").length,
      completed: tasks.filter((task) => task.status === "Completed").length,
      inProgress: tasks.filter((task) => task.status === "In Progress").length,
      categories: {},
      priorities: {},
    };

    // Calculate category stats
    tasks.forEach((task) => {
      stats.categories[task.category] =
        (stats.categories[task.category] || 0) + 1;
      stats.priorities[task.priority] =
        (stats.priorities[task.priority] || 0) + 1;
    });

    return stats;
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Tasks" value={stats.total} bgColor="bg-white" />
        <StatCard title="Overdue" value={stats.overdue} bgColor="bg-red-50" />
        <StatCard
          title="Completed"
          value={stats.completed}
          bgColor="bg-green-50"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          bgColor="bg-blue-50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">
            Tasks by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.categories).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-600">{category}</span>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${(count / stats.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-700 font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">
            Tasks by Priority
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.priorities).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="text-gray-600">{priority}</span>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className={`h-full rounded-full ${
                        priority === "High"
                          ? "bg-red-500"
                          : priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${(count / stats.total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-gray-700 font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
