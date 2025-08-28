import { useParams } from "react-router-dom";
import {CategoryBar} from "../components/CategoryBar";
import { CategoryBarM } from "../components/CategoryBarM";
import { CompanyCard } from "../components/CompanyCard";
import PostCard from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import { VentCard } from "../components/VentCard";
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

export const CompanyDetailsPage = () => {
  const {id} = useParams();
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

   useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const [profileResponse, companyResponse] = await Promise.all([
          axios.get("http://localhost:3000/v1/profile", { headers }),
          axios.get(`http://localhost:3000/v1/companies/${id}`, { headers })
        ]);

        console.log(profileResponse.data);
        console.log(companyResponse.data.companies);
        
        setCompany(companyResponse.data.companies);
        setUsername(profileResponse.data.user.username);
        setLocation(profileResponse.data.location.city);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]); 

if (loading) {
    return (
      <div className="h-screen w-screen bg-gray-950">
         <Loader></Loader>
      </div>
     
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex bg-gray-950 justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="w-screen h-screen flex bg-gray-950 justify-center items-center">
        <div className="text-white">Loading company details...</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700">
        <Sidebar />
        <CategoryBarM />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll">
          <PostCard />
          <CompanyCard 
            key={company.id} 
            company_id={company.id} 
            company_name={company.name} 
            industry={company.industry} 
            city={company.city} 
            country={company.country}
          />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
          <VentCard />
        </div>
        
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4">
          <UserCard username={username} location={location} />
          <CategoryBar />
        </div>
      </div>
    </div>
  );
};