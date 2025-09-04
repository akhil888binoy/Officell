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
interface Vent {
    category: string;
    company_id: string;
    id: string;
    verified_employee: boolean;
    content: string;
    upvote: string;
    downvote: string;
    company:{
      name : string ,
      country: string
    };
    _count :{
      comments:string
    };
    author:{
      username:string
    };
    createdAt: string;
    author_id:string;
    Media:[],
    votes:[]
}
export const CompanyDetailsPage = () => {
  const {id} = useParams();
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState("");
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vents , setVents] = useState<Vent[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [user_id , setUser_id] = useState(null);
  const [category, setCategory] = useState("");

useEffect(() => {
    const fetchData = async () => {
      try {
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
         setUser_id(profileResponse.data.user.id);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch company details");
      } 
    };
    
    fetchData();
  }, [id]); 

useEffect(() => {
    const fetchVents = async () => {
      try {
        if (!id) return ;
        if (vents.length === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: ventsJson } = await axios.get(`http://localhost:3000/v1/vents?skip=${skip}&company_id=${id}&category=${category}`, {
          headers: headers
        });
        
        console.log(ventsJson.vents);
        const newVents = ventsJson.vents;
        
        // Check if we've reached the end of the list
        if (newVents.length === 0) {
          setHasMore(false);
        } else {
          setVents([...vents, ...newVents]);
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
    if (hasMore || vents.length === 0|| category.length > 0) {
      fetchVents();
    }
  }, [skip, id,category]);

  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 100; 
    if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
            setSkip(vents.length);
    }
  }



  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700">
        <Sidebar></Sidebar>
        <CategoryBarM 
        onSelect={(q)=>{
            setSkip(0);
            setHasMore(true);
            setVents([]);
            setCategory(q)
          }}  
          />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll" onScroll={handleScroll}>
          <PostCard />
         {company && 
         <CompanyCard 
            key={company.id} 
            company_id={company.id} 
            company_name={company.name} 
            industry={company.industry} 
            city={company.city} 
            country={company.country}
          />
          }
          
            {loading &&  <Loader />}
              {!loading && vents.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  Be the first to bitch
                </div>
              )}
                            {/* Error message */}
                                    {error && (
                                      <div className="text-red-500 text-center p-4">
                                        {error}
                                      </div>
                                    )}
                                    
                                     {/* Companies list */}
                                    {vents.map(vent => (
                                      <VentCard
                                          key={vent.id}
                                          id={vent.id}
                                          company_id={vent.id}
                                          category= {vent.category}
                                          content = {vent.content}
                                          upvote={vent.upvote}
                                          downvote={vent.downvote}
                                          company_country={vent.company.country}
                                          company_name={vent.company.name}
                                          author={vent.author.username}
                                          author_id = {vent.author_id}
                                          commentcount = {vent._count.comments}
                                          createdAt= {vent.createdAt}
                                          media = {vent.Media}
                                          votes= {vent.votes}
                                          user_id = {user_id}
                                      />
                                    ))}
                                    
                                     {/* Loading more indicator */}
                                    {loadingMore && <Loader />}
                                    
                                     {/* End of results message */}
                                    {!hasMore && vents.length > 0 && (
                                      <div className="text-center text-gray-400 py-6">
                                        You've reached the end of the list
                                      </div>
                              )}
        </div>
        
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4">
          <UserCard username={username} location={location} />
          <CategoryBar 
            onSelect={(q)=>{
            setSkip(0);
            setHasMore(true);
            setVents([]);
            setCategory(q)
          }}  
          />
        </div>
      </div>
    </div>
  );
};