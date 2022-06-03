import { render, screen } from "@testing-library/react";
import DishesForm from "./DishesForm";
import userEvent from "@testing-library/user-event";

describe("<DishesForm />", () => {
  const setup = () => {
    return render(<DishesForm />);
  };

  it("should render dish name field", () => {
    setup();
    expect(screen.getByLabelText(/Dish name/i)).toBeInTheDocument();
  });

  it("should render preparation time field", () => {
    setup();
    expect(screen.getByLabelText(/Preparation time/i)).toBeInTheDocument();
  });

  it("should render dish type field", () => {
    setup();
    expect(screen.getByLabelText(/Choose dish type/i)).toBeInTheDocument();
  });

  it("should render dish type field options", () => {
    setup();
    const selectField = screen.getByLabelText(/Choose dish type/i);
    userEvent.click(selectField);
    expect(screen.getByRole("option", { name: /Pizza/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Soup/i })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /Sandwich/i })
    ).toBeInTheDocument();
  });

  it("should render pizza slices and pizza size fields, when pizza type is chosen", async () => {
    setup();
    const selectField = screen.getByLabelText(/Choose dish type/i);
    userEvent.click(selectField);

    const pizzaTypeOption = screen.getByRole("option", { name: /Pizza/i });
    userEvent.click(pizzaTypeOption);

    expect(
      await screen.findByLabelText(/The number of pizza slices/i)
    ).toBeInTheDocument();
    expect(await screen.findByLabelText(/Pizza size/i)).toBeInTheDocument();
  });

  it("should render spiciness scale field, when soup type is chosen", async () => {
    setup();
    const selectField = screen.getByLabelText(/Choose dish type/i);
    userEvent.click(selectField);

    const soupTypeOption = screen.getByRole("option", { name: /Soup/i });
    userEvent.click(soupTypeOption);

    expect(
      await screen.findByText("Spiciness scale (1-10)")
    ).toBeInTheDocument();
  });

  it("should render slices of bread field, when sandwich type is chosen", async () => {
    setup();
    const selectField = screen.getByLabelText(/Choose dish type/i);
    userEvent.click(selectField);

    const soupTypeOption = screen.getByRole("option", { name: /Sandwich/i });
    userEvent.click(soupTypeOption);

    expect(
      await screen.findByLabelText(/Slices of bread/i)
    ).toBeInTheDocument();
  });

  it("should submit correct form data", async () => {
    setup();

    userEvent.type(screen.getByLabelText(/Dish name/i), "Tomato soup");
    userEvent.type(screen.getByLabelText(/Preparation time/i), "03:03:45");

    const selectField = screen.getByLabelText(/Choose dish type/i);
    userEvent.click(selectField);

    const soupTypeOption = screen.getByRole("option", { name: /Soup/i });
    userEvent.click(soupTypeOption);

    userEvent.type(await screen.findByText("Spiciness scale (1-10)"), "5");

    const submitButton = screen.getByText(/Save/i);
    userEvent.click(submitButton);

    expect(
      await screen.findByText(/Recipe has been successfully saved!/i)
    ).toBeInTheDocument();
  });
});
