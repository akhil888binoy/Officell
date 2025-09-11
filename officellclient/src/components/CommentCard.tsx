// src/components/CommentCard.jsx
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Cookies from 'js-cookie';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import useCommentStore from "../store/commentStore";

export const CommentCard = ({ comment , user_id}) => {

  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading , setLoading] = useState(false);
  const addSubComment = useCommentStore((state)=>state.addSubComment);
  const deleteComment = useCommentStore((state)=>state.deleteComment);
  const deleteSubComment = useCommentStore((state)=>state.deleteSubComment);

  const handleReply = async ()=>{
    if(!replyText){
      toast.error('Type some reply !', {
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
      const  {data:response }= await axios.post(`http://localhost:3000/v1/comments/${comment.id}/subcomments`, {
          subcomment: replyText
        },{
          headers:headers,
      });
      addSubComment(response.subcomment)
      console.log("Subcomment",response);
      setReplyText("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  const handleDelete = async()=>{
    try {
      setDisableSubmitBtn(true);
        const token =  Cookies.get("Auth");
        const headers={
          'Authorization': `Bearer ${token}`
      }
      const response = await axios.delete(`http://localhost:3000/v1/comments/${comment.id}?vent_id=${comment.vent_id}`,{
        headers: headers
      });
      deleteComment(comment.id);
      setDisableSubmitBtn(false);
      toast.success('Deleted Successfully 💀', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
    } catch (error) {
      console.error(error);
          setDisableSubmitBtn(false);
       toast.error('Oops Failed to Delete! Dont worry its a mistake from our side ', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
              });
    }
  }


  const handleDeleteSubComment = async (subcommentId)=>{
    try {
      console.log("Handle delete sub comment");
        setDisableSubmitBtn(true);
        const token =  Cookies.get("Auth");
        const headers={
          'Authorization': `Bearer ${token}`
      }
      console.log("SubcommentId ", subcommentId)
      const response = await axios.delete(`http://localhost:3000/v1/subcomments/${subcommentId}`,{
        headers: headers
      });
      deleteSubComment( subcommentId, comment.id);
      setDisableSubmitBtn(false);
    } catch (error) {
      console.error(error);
            setDisableSubmitBtn(false);
    }
  }

  return (
    <>
    {comment.id &&  <div className="bg-gray-950 p-3 sm:p-4 ">
       {/* Comment Content */}
        <div className="flex items-start justify-between">
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed break-words flex-1">
          {comment.comment}
        </p>
        {comment.author_id === user_id && 
            <button disabled={disableSubmitBtn} onClick={handleDelete} className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-600 transition ml-2">
              <FaTrash />
            </button>
        }
        
      </div>
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
        <span className="text-gray-400">{comment.author?.username}</span>
        <div className="flex gap-3">
          <button
            className="hover:text-gray-100 transition"
            onClick={() => setReplying(!replying)}
          >
            Reply
          </button>
          {comment.subcomments?.length > 0 && (
            <button
              className="hover:text-gray-100 transition"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies
                ? "Hide Replies"
                : `View Replies (${comment.subcomments.length})`}
            </button>
          )}
          
        </div>
      </div>
      {replying && (
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={handleReply}
            className="self-end mt-2 sm:self-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-xs sm:text-sm text-white hover:bg-white hover:text-black active:scale-95 transition"
          >
            Send
          </button>
        </div>
      )}
      {showReplies && (
        <div className="mt-3 pl-3 border-l border-gray-700">
          {comment.subcomments.map((reply,index) => (
            <div key={index}>
            {reply &&
                <div className="mt-2 flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-300">{reply.subcomment}</p>
                    <span className="text-xs text-gray-400">{reply.author?.username}</span>
                </div>
                { reply.author.id === user_id &&
                    <button 
                        disabled={disableSubmitBtn} 
                        onClick={()=>handleDeleteSubComment(reply.id)} 
                        className="text-gray-400 hover:text-red-400 active:text-red-600 transition ml-2"
                    >
                        <FaTrash />
                    </button>
                }
            
            </div>
            }
            </div>
            
          ))}
        </div>
      )}
    </div> }
    </>
   
  );
};
