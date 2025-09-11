// src/components/CommentSection.jsx
import { useState, useRef } from "react";
import { CommentCard } from "./CommentCard";
import Cookies from 'js-cookie';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import useVentStore from "../store/ventStore";
import useCommentStore from "../store/commentStore";
import { Loader } from "./Loader";

export const CommentSection = ({vent_id}) => {
    const [newComment, setNewComment] = useState("");
    const [loading , setLoading]= useState(false);
    const addComment = useCommentStore((state)=> state.addComment);

    const handleComment = async ()=>{
    if(!newComment){
      toast.error('Type some comment !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
      return;
    }
      try {
        setLoading(true);
        const token = Cookies.get("Auth");
        const headers={
          'Authorization': `Bearer ${token}`
        }
        const  {data:response} = await axios.post(`http://localhost:3000/v1/vents/${vent_id}/comments`, {
          comment: newComment
        },{
          headers:headers,
      });
      setLoading(false);
      console.log(response.comment);
      addComment(response.comment);
      setNewComment("");
      } catch (error) {
        console.error(error);
        toast.error('Oops Failed to Post!', {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: false,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "dark",
                });
          setLoading(false);
        
      }
    }

  return (
    <div  >
      <ToastContainer></ToastContainer>
      {loading ?  <Loader /> : 
      <>
      {/* Comment Input Styled like PostCard */}
      <div className="w-full  bg-gray-950  border-b-1 border-gray-700">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 ">
          <input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
          />
        </div>

        <div className="flex justify-end px-2 sm:px-4 pb-2 pt-2">
          <button
            onClick={handleComment}
            className="ml-auto rounded-full border border-gray-500 
                      px-3 py-2 text-xs 
                      sm:px-5 sm:py-2 sm:text-sm 
                      font-semibold uppercase tracking-wide text-white 
                      hover:bg-white hover:text-black active:scale-95 transition"
          >
            comment
          </button>
        </div>

      </div>
      </>
      }
      
    </div>
  );
};
