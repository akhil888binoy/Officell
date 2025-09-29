import { useParams } from "react-router-dom";
import {CategoryBar} from "../components/CategoryBar";
import { CategoryBarM } from "../components/CategoryBarM";
import { CompanyCard } from "../components/CompanyCard";
import PostCard from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import  {VentCard } from "../components/VentCard";
import { useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import useUserStore from "../store/userStore";
import useCompanyStore from "../store/companyStore";
import Shuffle from "../styles/Shuffle";
import { FaSkullCrossbones } from "react-icons/fa";
import useCompanyVentStore from "../store/companyventStore";
import { PAGE_SIZE } from "../utils/pagesize";


export const CompanyDetailsPage = () => {

  const scrollToRef = useRef<null | HTMLElement>(null);
  const scrollToCard= useCompanyVentStore((state)=> state.scrollToItem) ;
  const {id} = useParams();
  const [error, setError] = useState<string | null>(null);
  const skip = useCompanyVentStore((state)=> state.scrollSkip);
  const loadingMore = useCompanyVentStore((state)=> state.scrollLoadinMore);
  const loading = useCompanyVentStore((state)=> state.scrollLoading);
  const category = useCompanyVentStore((state)=> state.scrollCategory);
  const hasMore = useCompanyVentStore((state)=> state.scrollHasMore);
  const location = useUserStore((state) => state.location);
  const user = useUserStore((state) => state.user);
  const company = useCompanyStore((state)=>state.getCompany(id));
  const addVents = useCompanyVentStore((state) => state.addVents);
  const addScrollSkip = useCompanyVentStore((state)=> state.addScrollSkip);
  const addloading = useCompanyVentStore((state)=> state.addScrollLoading);
  const addloadingMore = useCompanyVentStore((state)=> state.addScrollLoadingMore);
  const addcategory = useCompanyVentStore((state)=> state.addScrollCategory);
  const addHasMore = useCompanyVentStore((state)=> state.addHasMore);
  const addScrollToItem = useCompanyVentStore((state)=> state.addScrollToItem);
  const logout = useCompanyVentStore((state)=>state.logout);
  const vents = useCompanyVentStore((state) => state.companyvents);


useEffect(() => {
    const controller = new AbortController();
    const fetchVents = async () => {
      try {
        if (!id) return ;
        if (vents.length === 0) {
          addloading(true);
        } else {
          addloadingMore(true);
        }
        
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: ventsJson } = await axios.get(`http://localhost:3000/v1/vents?skip=${skip}&company_id=${id}&category=${category}`, {
          headers, signal: controller.signal , withCredentials: true
        });
        
        console.log(ventsJson.vents);
          if (ventsJson.vents.length < PAGE_SIZE) {
            addHasMore(false);  
          }
          if (ventsJson.vents.length > 0) {
            addVents(ventsJson.vents);
          }
        setError(null);
      } catch (error) {
        if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        console.error(error);
        setError("Failed to fetch vents");
      }
      } finally {
        addloading(false);
        addloadingMore(false);
      }
    };
    
    if (hasMore || vents.length === 0|| category.length > 0) {
      const timer = setTimeout(()=>{
        fetchVents();
        console.log('calling fetch vents')
      },100) ;
      return () => {
        clearTimeout(timer);
        controller.abort(); 
    };
    }
  }, [skip, id, category]);


  useEffect(()=>{
    if(scrollToRef.current ) {
      scrollToRef.current.scrollIntoView();
    }
  },[id]);


  const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 1000; 
    if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
        addScrollSkip(vents.length);
    }
  }


  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700">
        <Sidebar></Sidebar>
        <CategoryBarM 
        onSelect={(q)=>{
            logout();
            addcategory(q)
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
            vents_count={company._count.vents}
            domain={company.domain}
          />
          }
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
                                    {vents.map((vent,index) => (
                                      <span key={index} onClick={()=> addScrollToItem(index) }>
                                          <VentCard
                                            id={vent.id}
                                            category= {vent.category}
                                            content = {vent.content}
                                            upvote={vent.upvote}
                                            downvote={vent.downvote}
                                            company_country={vent.company?.country}
                                            company_name={vent.company?.name}
                                            author={vent.author?.username}
                                            author_id = {vent.author_id}
                                            commentcount = {vent._count?.comments}
                                            createdAt= {vent.createdAt}
                                            media = {vent.Media}
                                            votes={vent.votes}
                                            user_id = {user.id}
                                            ref={index === scrollToCard ?  scrollToRef : null}
                                        />     
                                    </span>
                                      
                                    ))}
                                    
                                     {/* Loading more indicator */}
                                    {loadingMore && 
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
                                    
                                     {/* End of results message */}
                                    {!hasMore && vents.length > 0 && (
                                      <div className="text-center text-gray-400 py-6 flex justify-center items-center space-x-2">
                                                                <FaSkullCrossbones />
                                                                <span>THE END</span>
                                      </div>
                              )}
        </div>
        
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4">
          <UserCard username={user.username} location={location.city} />
          <CategoryBar 
            onSelect={(q)=>{
            logout();
            addcategory(q)
          }}  
          />
        </div>
      </div>
    </div>
  );
};