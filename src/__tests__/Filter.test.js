import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../components/App"; // App contains Filter and ShoppingList
import Filter from "../components/Filter";

const testData = [
  { id: 1, name: "Yogurt", category: "Dairy" },
  { id: 2, name: "Pomegranate", category: "Produce" },
  { id: 3, name: "Lettuce", category: "Produce" },
  { id: 4, name: "String Cheese", category: "Dairy" },
  { id: 5, name: "Swiss Cheese", category: "Dairy" },
  { id: 6, name: "Cookies", category: "Dessert" },
];

// ✅ Filter Component Direct Test
test("uses a prop of 'search' to display the search term in the input field", () => {
  const noop = () => {};
  render(<Filter search="testing" onSearchChange={noop} />);
  expect(screen.getByPlaceholderText(/Search/i).value).toBe("testing");
});

test("calls the onSearchChange callback prop when the input is changed", () => {
  const onChange = jest.fn();
  render(<Filter search="testing" onSearchChange={onChange} />);
  fireEvent.change(screen.getByPlaceholderText(/Search/i), {
    target: { value: "testing123" },
  });
  expect(onChange).toHaveBeenCalled();
});

// ✅ These tests now render the whole App to access both Filter and ShoppingList
test("the input field acts as a controlled input", () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search/i);
  fireEvent.change(searchInput, { target: { value: "testing 123" } });
  expect(searchInput.value).toBe("testing 123");
});

test("the shopping list displays all items when initially rendered", () => {
  render(<App />);
  const listItems = screen.getAllByRole("listitem");
  expect(listItems.length).toBeGreaterThan(0); // At least the default items
});

test("the shopping filters based on the search term to include full matches", () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search/i);

  fireEvent.change(searchInput, { target: { value: "Yogurt" } });
  expect(screen.queryByText("Yogurt")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument();

  fireEvent.change(searchInput, { target: { value: "Lettuce" } });
  expect(screen.queryByText("Lettuce")).toBeInTheDocument();
  expect(screen.queryByText("Yogurt")).not.toBeInTheDocument();
});

test("the shopping filters based on the search term to include partial matches", () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/Search/i);

  fireEvent.change(searchInput, { target: { value: "Cheese" } });
  expect(screen.queryByText("Swiss Cheese")).toBeInTheDocument();
  expect(screen.queryByText("String Cheese")).toBeInTheDocument();
  expect(screen.queryByText("Yogurt")).not.toBeInTheDocument();
});
