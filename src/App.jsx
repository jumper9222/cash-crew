import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/auth/LandingPage";
import NavigationBar from "./components/NavigationBar";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Sidebar from "./components/Sidebar";
import PersonalDashboard from "./pages/personal/PersonalDashboard";
import PersonalExpenses from "./pages/personal/PersonalExpenses";
import TransactionPage from "./pages/TransactionPage";
import SharedDashboard from "./pages/shared/SharedDashboard";
import SharedExpenses from "./pages/shared/SharedExpenses";
import FriendsPage from './pages/shared/FriendsPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavigationBar />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route element={<Sidebar />}>
            <Route path="/personal" element={<PersonalDashboard />} />
            <Route path="/personal/expenses" element={<PersonalExpenses />} >
              <Route path="/personal/expenses/:transaction_id" element={<TransactionPage />} />
            </Route>
            <Route path="/shared" element={<SharedDashboard />} />
            <Route path="/shared/expenses" element={<SharedExpenses />} />
            <Route path="/friends" element={<FriendsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}