
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { VentDetailsPage } from './pages/VentDetailsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { LandingPage } from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import RegisterCompanyPage from './pages/RegisterCompanyPage';
import AddUsernamePage from './pages/AddUsernamePage';
import NotFoundPage from './pages/NotFoundPage';
import { TrendingPage } from './pages/TrendingPage';
import Cookies from 'js-cookie';


function App() {
  const token = Cookies.get("Auth");
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>} ></Route>
        <Route path="/login" element={<LoginPage></LoginPage>} ></Route>
        <Route path="/username" element={<AddUsernamePage></AddUsernamePage>} ></Route>
        <Route path="/feed" element={ token != null ? <FeedPage></FeedPage> : <Navigate to="/login" /> } ></Route>
        <Route path="/trending" element={ token != null ? <TrendingPage></TrendingPage> :   <Navigate to="/login" />} ></Route>
        <Route path="/companies" element={ token != null ?  <CompaniesPage></CompaniesPage> :   <Navigate to="/login" />} ></Route>       
        <Route path="/companies/:id" element={ token != null ? <CompanyDetailsPage></CompanyDetailsPage> :   <Navigate to="/login" />} ></Route>       
        <Route path="/companies/register" element={ token != null ? <RegisterCompanyPage></RegisterCompanyPage> :   <Navigate to="/login" />} ></Route>       
        <Route path="/vent/:id" element={ token != null ? <VentDetailsPage></VentDetailsPage> :   <Navigate to="/login" />} ></Route>       
        <Route path="/profile" element={ token != null ? <ProfilePage></ProfilePage> :   <Navigate to="/login" />} ></Route>       
        <Route path="/settings" element={ token != null ? <SettingsPage></SettingsPage> :   <Navigate to="/login" />} ></Route>       
        <Route path="/admin/reports" element={<AdminReportsPage></AdminReportsPage>} ></Route>       
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
    </>
  
  );
}

export default App;