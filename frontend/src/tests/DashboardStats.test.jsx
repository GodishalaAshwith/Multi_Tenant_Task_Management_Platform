import { render, screen, fireEvent } from "@testing-library/react";
import DashboardStats from "../components/DashboardStats";

describe("DashboardStats", () => {
  const mockStats = {
    totalTasks: 100,
    completedTasks: 75,
    overdueTasks: 5,
    tasksByCategory: {
      Bug: 30,
      Feature: 45,
      Documentation: 25,
    },
    tasksByPriority: {
      High: 20,
      Medium: 50,
      Low: 30,
    },
  };

  it("renders all stats correctly", () => {
    render(<DashboardStats stats={mockStats} />);

    expect(screen.getByText("100")).toBeInTheDocument(); // Total tasks
    expect(screen.getByText("75%")).toBeInTheDocument(); // Completion rate
    expect(screen.getByText("5")).toBeInTheDocument(); // Overdue tasks
  });

  it("renders category distribution chart", () => {
    render(<DashboardStats stats={mockStats} />);

    Object.entries(mockStats.tasksByCategory).forEach(([category, count]) => {
      expect(screen.getByText(category)).toBeInTheDocument();
      expect(screen.getByText(count.toString())).toBeInTheDocument();
    });
  });

  it("renders priority distribution chart", () => {
    render(<DashboardStats stats={mockStats} />);

    Object.entries(mockStats.tasksByPriority).forEach(([priority, count]) => {
      expect(screen.getByText(priority)).toBeInTheDocument();
      expect(screen.getByText(count.toString())).toBeInTheDocument();
    });
  });

  it("shows loading state when stats are undefined", () => {
    render(<DashboardStats />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
