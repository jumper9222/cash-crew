import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/auth/LandingPage";
import NavigationBar from "./layouts/NavigationBar";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Sidebar from "./layouts/Sidebar";
import PersonalDashboard from "./pages/PersonalDashboard";
import PersonalExpenses from "./pages/PersonalExpenses";
import TransactionPage from "./pages/TransactionPage";
import FriendsPage from './pages/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import RequireAuth from './components/RequireAuth';
import TransactionFormContextProvider from "./features/transactions/TransactionFormContextProvider";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavigationBar />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<RequireAuth />}>
            <Route element={
              <TransactionFormContextProvider>
                <Sidebar />
              </TransactionFormContextProvider>
            }>
              <Route path="/dashboard" element={<PersonalDashboard />} />
              <Route path="/dashboard/shared" element={<PersonalDashboard />} />
              <Route path="/expenses" element={<PersonalExpenses />} >
                <Route path="/expenses/personal/:transaction_id" element={<TransactionPage />} />
              </Route>
              <Route path="/expenses/shared" element={<PersonalExpenses />} >
                <Route path="/expenses/shared/:transaction_id" element={<TransactionPage />} />
              </Route>
              <Route path="/friends" element={<FriendsPage />} />
            </Route>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}