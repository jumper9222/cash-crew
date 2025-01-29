import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from 'react-redux';
import LandingPage from "./pages/auth/LandingPage";
import NavigationBar from "./components/NavigationBar";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Sidebar from "./components/Sidebar";
import PersonalDashboard from "./pages/personal/PersonalDashboard";
import PersonalExpenses from "./pages/personal/PersonalExpenses";
import TransactionPage from "./pages/TransactionPage";
import FriendsPage from './pages/shared/FriendsPage';
import ProfilePage from './pages/ProfilePage';
import RequireAuth from './components/RequireAuth';

export default function App() {
  const dispatch = useDispatch();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NavigationBar />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<Sidebar />}>
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