import { CompanyCategory } from "../components/CompanyCategory";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import { CompanyCategoryM } from "../components/CompanyCategoryM";
import CompanySearchBar from "../components/CompanySearchBar";
import { CompanyCard } from "../components/CompanyCard";
import { useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import AddCompany from "../components/AddCompany";
import useUserStore from "../store/userStore";
import useCompanyStore from "../store/companyStore";
import Shuffle from "../styles/Shuffle";
import { PAGE_SIZE } from "../utils/pagesize";
import useCompanyVentStore from "../store/companyventStore";


export const CompaniesPage = () => {

  const scrollToRef = useRef<null | HTMLElement>(null);
  const scrollToCard= useCompanyStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  const [search , setSearch] = useState("");
  const skip = useCompanyStore((state)=> state.scrollSkip);
  const loadingMore = useCompanyStore((state)=> state.scrollLoadinMore);
  const loading = useCompanyStore((state)=> state.scrollLoading);
  const category = useCompanyStore((state)=> state.scrollCategory);
  const hasMore = useCompanyStore((state)=> state.scrollHasMore);
  const companies = useCompanyStore((state) => state.companies);
  const addCompanies = useCompanyStore((state) => state.addCompanies);
  const location = useUserStore((state) => state.location)
  const user = useUserStore((state) => state.user);
  const addScrollSkip = useCompanyStore((state)=> state.addScrollSkip);
  const addloading = useCompanyStore((state)=> state.addScrollLoading);
  const addloadingMore = useCompanyStore((state)=> state.addScrollLoadingMore);
  const addcategory = useCompanyStore((state)=> state.addScrollCategory);
  const addHasMore = useCompanyStore((state)=> state.addHasMore);
  const addScrollToItem = useCompanyStore((state)=> state.addScrollToItem);
  const logout = useCompanyStore((state)=> state.logout);
  const logoutCompanyVent = useCompanyVentStore((state)=>state.logout);


  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 1000; 
        if (scrollHeight - (offsetHeight + scrollTop) < threshold && 
        !loadingMore && hasMore) {
        addScrollSkip(companies.length);
    }
  }


  useEffect(() => {
    const controller = new AbortController();
    const fetchCompanies = async () => {

      try {
        
        if (companies.length === 0) {
          addloading(true);
        } else {
          addloadingMore(true);
        }
        
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: companiesJson } = await axios.get(`http://localhost:3000/v1/companies?skip=${skip}&company_name=${search}&industry=${category}`, {
          headers, signal: controller.signal , withCredentials: true
        });
        
        console.log("Companies",companiesJson.companies);
        const newCompanies = companiesJson.companies;
        
        // Check if we've reached the end of the list
        if (newCompanies.length < PAGE_SIZE) {
              addHasMore(false);  
            }
        if (newCompanies.length > 0) {
              addCompanies(newCompanies);
          }
        setError(null);
      } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            console.error(error);
            setError("Failed to fetch companies");
          }
      } finally {
        addloading(false);
        addloadingMore(false);
      }
    };
    
    if (hasMore || companies?.length === 0 || search.length > 0 || category.length > 0 ) {
      const timer = setTimeout(()=>{
        fetchCompanies();
      },1000);

      return () => {
        clearTimeout(timer);
        controller.abort(); 
      };
    }
  }, [skip, search, category]);

  useEffect(()=>{
    logoutCompanyVent();
    if( scrollToRef.current ) {
        scrollToRef.current.scrollIntoView();
      }
  },[]);

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700">
        <Sidebar />
        <CompanyCategoryM onSelect={(q)=>{
            logout()
            addcategory(q)
          }} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll" onScroll={handleScroll}>
          <CompanySearchBar onSearch={(q) => {
            logout();
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
          <span key={index} onClick={()=> addScrollToItem(index) }>
            <CompanyCard
              company_id={company.id}
              company_name={company.name}
              industry={company.industry}
              city={company.city}
              country={company.country}
              vents_count={company._count?.vents}
              domain={company.domain}
              ref={index === scrollToCard ?  scrollToRef : null}
            />
          </span>
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
            logout()
            addcategory(q)
          }} />
        </div>
      </div>
    </div>
  );
};