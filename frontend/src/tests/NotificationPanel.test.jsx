import { render, screen, fireEvent } from "@testing-library/react";
import NotificationPanel from "../components/NotificationPanel";

describe("NotificationPanel", () => {
  const mockNotifications = [
    {
      id: "1",
      type: "task_assigned",
      message: "You have been assigned a new task",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      type: "task_completed",
      message: 'Task "Setup Testing" has been completed',
      timestamp: new Date().toISOString(),
      read: true,
    },
  ];

  const mockMarkAsRead = jest.fn();
  const mockDismiss = jest.fn();

  beforeEach(() => {
    mockMarkAsRead.mockClear();
    mockDismiss.mockClear();
  });

  it("renders notifications correctly", () => {
    render(
      <NotificationPanel
        notifications={mockNotifications}
        onMarkAsRead={mockMarkAsRead}
        onDismiss={mockDismiss}
      />
    );

    expect(screen.getByText(mockNotifications[0].message)).toBeInTheDocument();
    expect(screen.getByText(mockNotifications[1].message)).toBeInTheDocument();
  });

  it("shows unread indicator for unread notifications", () => {
    render(
      <NotificationPanel
        notifications={mockNotifications}
        onMarkAsRead={mockMarkAsRead}
        onDismiss={mockDismiss}
      />
    );

    const unreadNotification = screen
      .getByText(mockNotifications[0].message)
      .closest(".notification");
    expect(unreadNotification).toHaveClass("unread");
  });

  it("calls markAsRead when clicking on an unread notification", () => {
    render(
      <NotificationPanel
        notifications={mockNotifications}
        onMarkAsRead={mockMarkAsRead}
        onDismiss={mockDismiss}
      />
    );

    const unreadNotification = screen
      .getByText(mockNotifications[0].message)
      .closest(".notification");
    fireEvent.click(unreadNotification);

    expect(mockMarkAsRead).toHaveBeenCalledWith(mockNotifications[0].id);
  });

  it("calls dismiss when clicking dismiss button", () => {
    render(
      <NotificationPanel
        notifications={mockNotifications}
        onMarkAsRead={mockMarkAsRead}
        onDismiss={mockDismiss}
      />
    );

    const dismissButtons = screen.getAllByLabelText("Dismiss notification");
    fireEvent.click(dismissButtons[0]);

    expect(mockDismiss).toHaveBeenCalledWith(mockNotifications[0].id);
  });

  it("shows empty state when no notifications", () => {
    render(
      <NotificationPanel
        notifications={[]}
        onMarkAsRead={mockMarkAsRead}
        onDismiss={mockDismiss}
      />
    );

    expect(screen.getByText(/no new notifications/i)).toBeInTheDocument();
  });
});
