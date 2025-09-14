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
import AddCompany from "../components/AddCompany";
import useUserStore from "../store/userStore";
import useCompanyStore from "../store/companyStore";
import Shuffle from "../styles/Shuffle";

export const CompaniesPage = () => {
  const [skip, setSkip] = useState(0);
  const [category , setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [search , setSearch] = useState("");
  const companies = useCompanyStore((state) => state.companies);
  const addCompanies = useCompanyStore((state) => state.addCompanies);
  const reset = useCompanyStore((state)=>state.reset);
  const location = useUserStore((state) => state.location)
  const user = useUserStore((state) => state.user);


  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 1000; 
        if (scrollHeight - (offsetHeight + scrollTop) < threshold && 
        !loadingMore && hasMore) {
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
        const { data: companiesJson } = await axios.get(`http://localhost:3000/v1/companies?skip=${skip}&company_name=${search}&industry=${category}`, {
          headers: headers
        });
        
        console.log("Companies",companiesJson.companies);
        const newCompanies = companiesJson.companies;
        
        // Check if we've reached the end of the list
        if (newCompanies.length === 0) {
          setHasMore(false);
        } 
        else {
          addCompanies(newCompanies);
          console.log("companies",companies)
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
    
    if (hasMore || companies?.length === 0 || search.length > 0 || category.length > 0 ) {
      const timer = setTimeout(()=>{
        fetchCompanies();
      },1000);
      return () => clearTimeout(timer)
    }
  }, [skip, search, category]);

  useEffect(()=>{
    reset();
  },[]);

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700">
        <Sidebar />
        <CompanyCategoryM onSelect={(q)=>{
            setSkip(0);
            setHasMore(true);
            reset();
            setCategory(q)
          }} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll" onScroll={handleScroll}>
          <CompanySearchBar onSearch={(q) => {
            setSkip(0);
            setHasMore(true);
            reset();
            setSearch(q);
          }} />
          
          {/* Initial loading indicator */}
          {loading && companies?.length === 0 && 
                    <Shuffle
                          text="⟢ OFFICELL"
                          className="font-arimo text-white font-bold tracking-[-0.001em] text-5xl sm:text-4xl md:text-6xl lg:text-[70px] lg:ml-80"
                          shuffleDirection="right"
                          duration={0.35}
                          animationMode="evenodd"
                          shuffleTimes={1}
                          ease="power3.out"
                          stagger={0.03}
                          threshold={0.1}
                          loop={true}
                          respectReducedMotion={true}
                        />
            }
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-center p-4">
              {error}
            </div>
          )}
          
          {/* Companies list */}
          {companies?.map((company, index) => (
            <CompanyCard
              key={index}
              company_id={company.id}
              company_name={company.name}
              industry={company.industry}
              city={company.city}
              country={company.country}
              vents_count={company._count?.vents}
              domain={company.domain}
            />
          ))}
          
          {/* Loading more indicator */}
          {loadingMore &&  <Shuffle
                          text="⟢ OFFICELL"
                          className="font-arimo text-white font-bold tracking-[-0.001em] text-5xl sm:text-4xl md:text-6xl lg:text-[70px] lg:ml-80"
                          shuffleDirection="right"
                          duration={0.35}
                          animationMode="evenodd"
                          shuffleTimes={1}
                          ease="power3.out"
                          stagger={0.03}
                          threshold={0.1}
                          loop={true}
                          respectReducedMotion={true}
                        />
                  }
          <AddCompany></AddCompany>
          {/* End of results message */}
          {!hasMore && companies.length > 0 && (
            <div className="text-center text-gray-400 py-6">
              You've reached the end of the list
            </div>
          )}
        </div>
        
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4">
          <UserCard username={user.username} location={location.city} />
          <CompanyCategory onSelect={(q)=>{
            setSkip(0);
            setHasMore(true);
            reset();
            setCategory(q)
          }} />
        </div>
      </div>
    </div>
  );
};