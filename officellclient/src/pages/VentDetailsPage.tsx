import { useParams } from "react-router-dom";
import { CategoryBarM } from "../components/CategoryBarM";
import { CommentSection } from "../components/CommentSection";
import { Sidebar } from "../components/Sidebar";
import { VentCard } from "../components/VentCard";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { Loader } from "../components/Loader";
import { CommentCard } from "../components/CommentCard";
import { UserCard } from "../components/UserCard";

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
    comments:[]
    author:{
      username:string
    };
    createdAt: string;
    author_id:string;
    Media:[],
    votes:[]
}

interface Comment{
  id : string,
  comment: string
}
export const VentDetailsPage = () => {
  const {id} = useParams();
  const [vent, setVent] = useState<Vent | null>(null);
  const [comments , setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [username , setUsername ] = useState("");
  const [location, setLocation] = useState("");
  const [user_id , setUser_id] = useState(null);


  useEffect(()=>{

    const fetchData = async ()=>{
      try {
        const token =  Cookies.get("Auth");
        const headers={
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        const {data: response } = await axios.get("http://localhost:3000/v1/profile",{
          headers: headers
        });
        console.log(response);
        setUsername(response.user.username);
        setLocation(response.location.city);
        setUser_id(response.user.id);
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();

  },[]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: response } = await axios.get(`http://localhost:3000/v1/vents/${id}`, {
          headers: headers
        });
        console.log(response);
        setVent(response.vent);
        setError(null);
      } catch (error) {
        console.error(error);
        setError("Failed to fetch company details");
      } 
    };
    
    fetchData();
  }, [id]); 

  useEffect(() => {
    const fetchComments = async () => {
      try {
        if (comments.length === 0) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        
        const token = Cookies.get("Auth");
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };
        const { data: commentsJson } = await axios.get(`http://localhost:3000/v1/vents/${id}/comments`, {
          headers: headers
        });
        
        console.log(commentsJson.comments);
        const newComments = commentsJson.comments;
        
        // Check if we've reached the end of the list
        if (newComments.length === 0) {
          setHasMore(false);
        } else {
          setComments([...comments, ...newComments]);
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
    if (hasMore || comments.length === 0) {
      fetchComments();
    }
  }, [skip, id]);

   const handleScroll = (e) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target;
    const threshold = 100; 
        if (scrollHeight - (offsetHeight + scrollTop) < threshold && 
        !loadingMore && 
        hasMore) {
              setSkip(comments.length);
    }
  }

  // if (!vent) {
  //   return (
  //     <div className="w-screen h-screen bg-gray-950 ">
  //         <Loader />
  //     </div>
  //   );
  // }


  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
    <div className="border-r-1  border-gray-700  " >
      <Sidebar/>
      </div>
      {/* Main Content */}
        <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">

        <div className="flex-1 bg-gray-950 overflow-y-scroll " onScroll={handleScroll} >

        { vent &&
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
        }
          
                  
                              

          <div className="space-y-4 ">
          {vent &&  <CommentSection></CommentSection>}
              {loading && !vent && <Loader />}
              {!loading && comments.length === 0 && vent && (
                <div className="text-center text-gray-500 py-6">
                  Be the first to comment
                </div>
              )}
                {/* Error message */}
                      {error && (
                          <div className="text-red-500 text-center p-4">
                                {error}
                            </div>
                          )}
            {/* Render Comments */}
          {comments.map(comment => (
            <CommentCard
              key={comment.id}
              comment={comment}
              // onReply={handleReply}
            />
          ))}

                                     {/* Loading more indicator */}
                                     {loadingMore && <Loader />}
                                     
                                     {/* End of results message */}
                                     {!hasMore && comments.length > 0 && (
                                       <div className="text-center text-gray-400 py-6">
                                         You've reached the end of the list
                                       </div>
                              )}
          </div>

        </div>

        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
              <UserCard username={username} location={location} />
        </div>
      </div>
    </div>
  );
};
