import {CategoryBar} from "../components/CategoryBar";
import { CategoryBarM } from "../components/CategoryBarM";
import PostCard from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import { VentCard } from "../components/VentCard";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { Loader } from "../components/Loader";
import useUserStore from "../store/userStore";
import useVentStore from "../store/ventStore";

export const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [category, setCategory] = useState("");
  const location = useUserStore((state) => state.location)
  const user = useUserStore((state) => state.user);
  const addVents = useVentStore((state) => state.addVents);
  const reset = useVentStore((state)=>state.reset);
  const vents = useVentStore((state) => state.vents);

  useEffect(()=>{
    reset()
  },[]);

  useEffect(() => {
    const fetchVents = async () => {
      try {

        if (!user.id) return;

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
        const { data: ventsJson } = await axios.get(`http://localhost:3000/v1/vents?skip=${skip}&author_id=${user.id}&category=${category}`, {
          headers: headers
        });
        
        console.log(ventsJson.vents);
        const newVents = ventsJson.vents;
        
        if (newVents.length === 0) {
          setHasMore(false);
        } else {
          addVents(newVents);
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
      const timer = setTimeout(()=>{
        fetchVents();
      },100) ;
      return()=>clearTimeout(timer);
    }
  }, [skip, category]);

    const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 1000; 
        if (scrollHeight - (offsetHeight + scrollTop) < threshold && !loadingMore && hasMore) {
            setSkip(vents.length);
    }

  }

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen  border-r-1 border-gray-700  " >
      <Sidebar></Sidebar>
      <CategoryBarM
        onSelect={(q)=>{
            setSkip(0);
            setHasMore(true);
            reset();
            setCategory(q)
          }}
          ></CategoryBarM>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll  " onScroll={handleScroll}>
            <PostCard />
            <div className="border-t border-gray-700">
              <UserCard username={user.username} location={location.city} />
            </div>
          
                <h3 className="text-1xl sm:text-3xl md:text-6xl  lg:text-[20px]   font-arimo font-bold text-gray-100  lg:pt-3 lg:px-3 lg:pb-3 pt-2 px-2 pb-2">
                    Confessions
                </h3>
              {loading && vents.length === 0 && <Loader />}
              {!loading && vents.length === 0 && (
                <div className="text-center text-gray-500 py-6">
                  Come on! spill something
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
                                        <VentCard
                                          key={index}
                                          id={vent?.id}
                                          category= {vent?.category}
                                          content = {vent?.content}
                                          upvote={vent?.upvote}
                                          downvote={vent?.downvote}
                                          company_country={vent?.company?.country}
                                          company_name={vent?.company?.name}
                                          author={vent?.author?.username}
                                          author_id = {vent?.author_id}
                                          commentcount = {vent?._count?.comments}
                                          createdAt= {vent?.createdAt}
                                          media = {vent?.Media}
                                          votes={vent?.votes}
                                          user_id = {user.id}
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
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username={user.username} location={location.city} />
          <CategoryBar
            onSelect={(q)=>{
            setSkip(0);
            setHasMore(true);
            reset();
            setCategory(q)
          }}  
          ></CategoryBar>
        </div>
      </div>
    </div>
  );
};
