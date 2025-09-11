
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage></LandingPage>} ></Route>
        <Route path="/login" element={<LoginPage></LoginPage>} ></Route>
        <Route path="/username" element={<AddUsernamePage></AddUsernamePage>} ></Route>
        <Route path="/feed" element={<FeedPage></FeedPage>} ></Route>
        <Route path="/trending" element={<TrendingPage></TrendingPage>} ></Route>
        <Route path="/companies" element={<CompaniesPage></CompaniesPage>} ></Route>
        <Route path="/companies/:id" element={<CompanyDetailsPage></CompanyDetailsPage>} ></Route>
        <Route path="/companies/register" element={<RegisterCompanyPage></RegisterCompanyPage>} ></Route>
        <Route path="/vent/:id" element={<VentDetailsPage></VentDetailsPage>} ></Route>
        <Route path="/profile" element={<ProfilePage></ProfilePage>} ></Route>
        <Route path="/settings" element={<SettingsPage></SettingsPage>} ></Route>
        <Route path="/admin/reports" element={<AdminReportsPage></AdminReportsPage>} ></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
    </>
  
  );
}

export default App;