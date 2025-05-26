import { render, screen, fireEvent } from "@testing-library/react";
import TaskStatusSelect from "../components/TaskStatusSelect";

describe("TaskStatusSelect", () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: "Todo",
    onChange: mockOnChange,
    disabled: false,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders with current status", () => {
    render(<TaskStatusSelect {...defaultProps} />);
    expect(screen.getByRole("combobox")).toHaveValue("Todo");
  });

  it("triggers onChange when status is changed", () => {
    render(<TaskStatusSelect {...defaultProps} />);
    const select = screen.getByRole("combobox");

    fireEvent.change(select, { target: { value: "In Progress" } });

    expect(mockOnChange).toHaveBeenCalledWith("In Progress");
  });

  it("is disabled when disabled prop is true", () => {
    render(<TaskStatusSelect {...defaultProps} disabled={true} />);
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("contains all valid status options", () => {
    render(<TaskStatusSelect {...defaultProps} />);
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(4); // Todo, In Progress, Review, Done
    expect(options[0]).toHaveValue("Todo");
    expect(options[1]).toHaveValue("In Progress");
    expect(options[2]).toHaveValue("Review");
    expect(options[3]).toHaveValue("Done");
  });
});
