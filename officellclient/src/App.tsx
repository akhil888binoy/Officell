
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { VentDetailsPage } from './pages/VentDetailsPage';
import { CreateVentPage } from './pages/CreateVentPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminReportsPage } from './pages/AdminReportsPage';
import { LandingPage } from './pages/LandingPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>} ></Route>
        <Route path="/feed" element={<FeedPage></FeedPage>} ></Route>
        <Route path="/companies" element={<CompaniesPage></CompaniesPage>} ></Route>
        <Route path="/companies/:id" element={<CompanyDetailsPage></CompanyDetailsPage>} ></Route>
        <Route path="/vent/:id" element={<VentDetailsPage></VentDetailsPage>} ></Route>
        <Route path="/vent/new" element={<CreateVentPage></CreateVentPage>} ></Route>
        <Route path="/profile" element={<ProfilePage></ProfilePage>} ></Route>
        <Route path="/admin/reports" element={<AdminReportsPage></AdminReportsPage>} ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;