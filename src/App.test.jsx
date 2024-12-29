import { cleanup, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import LoginPage from "./pages/LoginPage";
import userEvent from "@testing-library/user-event";
import SignupPage from "./pages/SignUpPage";

test("Login form submission", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByTestId("emailInput")
    const passwordlInput = screen.getByTestId("passwordInput")
    const submitButton = screen.getByTestId("submitButton")

    await userEvent.type(emailInput, 'email@email.com')
    await userEvent.type(passwordlInput, "Abcd1234!")

    expect(submitButton.disabled).toBe(false);
    cleanup()
})

test("Login form submission failed", async () => {
    render(<LoginPage />);

    const emailInput = screen.getByTestId("emailInput")
    const passwordlInput = screen.getByTestId("passwordInput")
    const submitButton = screen.getByTestId("submitButton")

    await userEvent.type(emailInput, 'email')
    await userEvent.type(passwordlInput, "Abcd1234!")

    expect(submitButton.disabled).toBe(true);
    cleanup();
})

test("Signup form submission", async () => {
    render(<SignupPage />);

    const emailInput = screen.getByTestId("emailInput")
    const passwordlInput = screen.getByTestId("passwordInput")
    const confirmPasswordlInput = screen.getByTestId("confirmPasswordInput")
    const submitButton = screen.getByTestId("submitButton")

    await userEvent.type(emailInput, 'email@email.com')
    await userEvent.type(passwordlInput, "Abcd1234!")
    await userEvent.type(confirmPasswordlInput, "Abcd1234!")

    expect(submitButton.disabled).toBe(false);
    cleanup()
})

test("Signup form submission failed", async () => {
    render(<SignupPage />);

    const emailInput = screen.getByTestId("emailInput")
    const passwordlInput = screen.getByTestId("passwordInput")
    const confirmPasswordlInput = screen.getByTestId("confirmPasswordInput")
    const submitButton = screen.getByTestId("submitButton")

    await userEvent.type(emailInput, 'email@email.com')
    await userEvent.type(passwordlInput, "Abcd1234!")
    await userEvent.type(confirmPasswordlInput, "Abcd1234")

    expect(submitButton.disabled).toBe(true);
    cleanup()
})