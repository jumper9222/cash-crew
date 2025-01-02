import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import NavigationBar from "./components/NavigationBar";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import CreateTransaction from "./pages/forms/CreateTransaction";
import EditTransaction from "./pages/forms/EditTransaction";
import Sidebar from "./components/Sidebar";
import MonthlyBudget from "./pages/MonthlyBudget";
import AllTransactions from "./pages/AllTransactions";
import TransactionPage from "./pages/TransactionPage";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavigationBar />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<Sidebar />}>
            <Route path="/dashboard" element={<MonthlyBudget />} />
            <Route path="/transactions" element={<AllTransactions />} />
            <Route path="/transaction/:transaction_id" element={<TransactionPage />} />
            <Route path="/new-transaction" element={<CreateTransaction />} />
            <Route path="/edit-transaction/:transaction_id" element={<EditTransaction />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}