import {CategoryBar} from "../components/CategoryBar";
import { CategoryBarM } from "../components/CategoryBarM";
import PostCard from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import {VentCard}  from "../components/VentCard";
import { useEffect, useRef, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import useUserStore from "../store/userStore";
import useVentStore from "../store/ventStore";
import Shuffle from "../styles/Shuffle";
import { FaSkullCrossbones } from "react-icons/fa";



export const FeedPage = () => {

  const scrollToRef = useRef<null | HTMLElement>(null);
  const scrollToCard= useVentStore((state)=> state.scrollToItem) ;
  const [error, setError] = useState<string | null>(null);
  const skip = useVentStore((state)=> state.scrollSkip);
  const loadingMore = useVentStore((state)=> state.scrollLoadinMore);
  const loading = useVentStore((state)=> state.scrollLoading);
  const category = useVentStore((state)=> state.scrollCategory);
  const hasMore = useVentStore((state)=> state.scrollHasMore);
  const addUser = useUserStore((state)=>state.addUser);
  const location = useUserStore((state) => state.location)
  const user = useUserStore((state) => state.user);
  const vents = useVentStore((state) => state.vents);
  const addVents = useVentStore((state) => state.addVents);
  const addScrollSkip = useVentStore((state)=> state.addScrollSkip);
  const addloading = useVentStore((state)=> state.addScrollLoading);
  const addloadingMore = useVentStore((state)=> state.addScrollLoadingMore);
  const addcategory = useVentStore((state)=> state.addScrollCategory);
  const addHasMore = useVentStore((state)=> state.addHasMore);
  const addScrollToItem = useVentStore((state)=> state.addScrollToItem);
  const reset = useVentStore((state)=>state.reset);

  // const resetCategory = useVentStore((state)=>state.resetScrollCategory);
  // const resetScrollLoading = useVentStore((state)=>state.resetScrollLoading);
  // const resetScrollLoadingMore = useVentStore((state)=>state.resetScrollLoadingMore);
  // const resetScrollSkip = useVentStore((state)=>state.resetScrollSkip);
  // const resetScrollHasMore = useVentStore((state)=> state.resetHasMore);

  const fetchData = async ()=>{
      try {
        const token =  Cookies.get("Auth");
        if(!token){
          await axios.post("http://localhost:3000/v1/auth/refreshtoken", {}, { withCredentials: true });
      }
        const headers={
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        const {data: response } = await axios.get("http://localhost:3000/v1/profile",{
          headers: headers
        });
        addUser(response);
      } catch (error) {
        console.error(error)
      }
    }

  useEffect(()=>{
    fetchData();
    if( scrollToRef.current ) {
            scrollToRef.current.scrollIntoView();
        }
  },[]);

useEffect(() => {
  const controller = new AbortController();
  
  const fetchVents = async () => {
    try {
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

      const { data: ventsJson } = await axios.get(
        `http://localhost:3000/v1/vents?skip=${skip}&category=${category}`,
        { headers, signal: controller.signal } 
      );

      if (ventsJson.vents.length === 0) {
        addHasMore(false);
      } else {
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

  if (hasMore || vents?.length === 0 || category.length > 0) {
    const timer = setTimeout(() => {
      fetchVents();
    }, 100);

    return () => {
      clearTimeout(timer);
      controller.abort(); 
    };
  }
}, [skip, category]);


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
      <div className="h-screen border-r-1 border-gray-700" >
      <Sidebar/>
      <CategoryBarM
          onSelect={(q)=>{
              addScrollSkip(0);
              addHasMore(true);
              reset();
              addcategory(q)
            }} 
      ></CategoryBarM>

      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll " onScroll={handleScroll}>
            <PostCard />
            {loading && vents.length === 0 &&  <Shuffle
                                      text="⟢ OFFICELL"
                                      className="font-arimo text-white font-bold tracking-[-0.001em] text-5xl sm:text-4xl md:text-6xl lg:text-[70px] md:ml-4 lg:ml-20"
                                      shuffleDirection="right"
                                      duration={0.35}
                                      animationMode="evenodd"
                                      shuffleTimes={1}
                                      ease="power3.out"
                                      stagger={0.03}
                                      threshold={0.1}
                                      loop={true}
                                      respectReducedMotion={true}
                              />}
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
                      {loadingMore && <Shuffle
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
                    />}
                      
                      {/* End of results message */}
                      {!hasMore && vents.length > 0 && (
                        <div className="text-center text-gray-400 py-6 flex justify-center items-center space-x-2">
                          <FaSkullCrossbones />
                          <span>THE END</span>
                        </div>
                      )}
        </div>
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username={user.username} location={location.city} />
          <CategoryBar
                onSelect={(q)=>{
                  addScrollSkip(0);
                  addHasMore(true);
                  reset();
                  addcategory(q)
                }}  
          ></CategoryBar>
        </div>
      </div>
    </div>
  );
};
