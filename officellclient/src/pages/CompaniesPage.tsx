import { CompanyCategory } from "../components/CompanyCategory";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import { CompanyCategoryM } from "../components/CompanyCategoryM";
import CompanySearchBar from "../components/CompanySearchBar";
import { CompanyCard } from "../components/CompanyCard";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { Loader } from "../components/Loader";
interface Company {
  id: string;
  name: string;
  industry: string;
  city: string;
  country: string;
}

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [skip, setSkip] = useState(0);
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [country , setCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: response } = await axios.get("http://localhost:3000/v1/profile", {
          headers: headers
        });
        console.log(response);
        setUsername(response.user.username);
        setLocation(response.location.city);
        setCountry(response.location.country);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch profile details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 100; 
        if (scrollHeight - (offsetHeight + scrollTop) < threshold && 
        !loadingMore && 
        hasMore) {
              setSkip(companies.length);
    }
  }

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        if (companies.length === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: companiesJson } = await axios.get(`http://localhost:3000/v1/companies?skip=${skip}&country=${country}`, {
          headers: headers
        });
        
        console.log(companiesJson.companies);
        const newCompanies = companiesJson.companies;
        
        // Check if we've reached the end of the list
        if (newCompanies.length === 0) {
          setHasMore(false);
        } else {
          setCompanies([...companies, ...newCompanies]);
        }
        
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch companies");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    
    if (hasMore || companies.length === 0) {
      fetchCompanies();
    }
  }, [skip]);

  

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700">
        <Sidebar />
        <CompanyCategoryM />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll" onScroll={handleScroll}>
          <CompanySearchBar onSearch={(q) => console.log("Searching for:", q)} />
          
          {/* Initial loading indicator */}
          {loading && companies.length === 0 && <Loader />}
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          )}
          
          {/* Companies list */}
          {companies.map(company => (
            <CompanyCard
              key={company.id}
              company_id={company.id}
              company_name={company.name}
              industry={company.industry}
              city={company.city}
              country={company.country}
            />
          ))}
          
          {/* Loading more indicator */}
          {loadingMore && <Loader />}
          
          {/* End of results message */}
          {!hasMore && companies.length > 0 && (
            <div className="text-center text-gray-400 py-6">
              You've reached the end of the list
            </div>
          )}
        </div>
        
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4">
          <UserCard username={username} location={location} />
          <CompanyCategory />
        </div>
      </div>
    </div>
  );
};