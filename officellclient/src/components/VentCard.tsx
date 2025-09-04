import { FaArrowUp, FaArrowDown, FaRegComment, FaTrash } from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";
import moment from 'moment';
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';



export const VentCard = ({ id , company_id , category , content , upvote , downvote , company_name , company_country, author, author_id, commentcount , createdAt, media, votes, user_id }) => {

  const [time, setTime] = useState("");
  const [isupvote , setIsUpVote] = useState(false);
  const [isdownvote , setIsDownVote] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

  useEffect(()=>{
    for (const vote of votes){
      if(vote.user_id == user_id && vote.vote=='UPVOTE'){
        setIsUpVote(true)
      } else if (vote.user_id == user_id && vote.vote=='DOWNVOTE'){
        setIsDownVote(true)
      }
    }
    console.log("Author",author );
    console.log("User_id", user_id);
  },[downvote, upvote]);

const handleDownvote=async ()=>{
  try {
      setDisableSubmitBtn(true)
      const token =  Cookies.get("Auth");
      const headers={
        'Authorization': `Bearer ${token}`
      };
      const {data: response }= await axios.post(`http://localhost:3000/v1/vents/${id}/downvote`,"",{
          headers:headers,
      });
    console.log(response.author_id);
    setDisableSubmitBtn(false)
  } catch (error) {
    console.error(error);
    setDisableSubmitBtn(false);
    toast.error('Oops Failed to Down Vote! Dont worry its a mistake from our side ', {
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

const handleUpvote=async ()=>{
  try {
      setDisableSubmitBtn(true);
      const token =  Cookies.get("Auth");
      const headers={
        'Authorization': `Bearer ${token}`
      };
      const response = await axios.post(`http://localhost:3000/v1/vents/${id}/upvote`,"",{
          headers:headers,
      });
    console.log(response);
    setDisableSubmitBtn(false)
  } catch (error) {
    console.error(error);
    setDisableSubmitBtn(false);
    toast.error('Oops Failed to Up Vote! Dont worry its a mistake from our side ', {
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

const handleDeleteVent =async()=>{
  try {
      setDisableSubmitBtn(true);
      const token =  Cookies.get("Auth");
      const headers={
        'Authorization': `Bearer ${token}`
      };
      const response = await axios.delete(`http://localhost:3000/v1/vents/${id}`,{
          headers:headers,
      });
    console.log(response);
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

useEffect(() => {
  if (createdAt) {
    setTime(moment.utc(createdAt).local().startOf("seconds").fromNow());
  }
}, [createdAt]);

  return (
    <div className="relative flex flex-col bg-gray-950 border-t border-b border-gray-700 w-full overflow-hidden">
      <a href={`/vent/${id}`} >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          {/* User + Time */}
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-white font-semibold text-sm md:text-baseclea">
                {author}
              </h3>
              <span className="text-xs text-gray-400">{time}</span>
            </div>
          </div>
        
      
          {/* Company + Location */}
          <div className="flex flex-col items-end text-xs text-gray-300 lg:gap-2 gap-1">
            <div className="flex items-center gap-1 flex-wrap justify-end">
              <span className="text-right break-words max-w-[140px] md:max-w-[180px]">
                {company_name}
              </span>
                    <RiBuilding2Line className="text-gray-400 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1">
              <MdLocationOn className="text-gray-400 flex-shrink-0" />
              <span>{company_country}</span>
            </div>
          </div>


          
        </div>
      </a>

      {/* Confession Text */}
<div className="px-4 pb-3">
  <div className="mb-2">
  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm">
    {category}
  </span>
</div>
  <p className="text-gray-200 leading-relaxed text-sm md:text-base lg:text-lg">
    {content}
  </p>


  <div className="mt-3 flex flex-wrap justify-center items-center gap-3">
    {media.map((image) => (
      <div key={image.id} className="relative group">
        <img
          src={image.url}
          alt="Post content"
          className="max-w-full h-auto rounded-lg shadow-md transition-transform duration-300 hover:shadow-lg"
          style={{
            maxHeight: media.length === 1 ? '480px' : '320px',
            minHeight: '160px'
          }}
        />
      </div>
    ))}
  </div>
</div>

      {/* Footer (Upvote / Downvote / Comments / Delete) */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          {/* UpVote Button */}
          <button disabled={disableSubmitBtn} onClick={handleUpvote} className={`flex items-center gap-2  hover:text-green-400 active:text-green-400 transition ${isupvote? 'text-green-400':'text-gray-400'}`}>
            <FaArrowUp />
            <span className="text-sm md:text-base">{upvote}</span>
          </button>
          {/* Down Vote */}
          <button disabled={disableSubmitBtn} onClick={handleDownvote} className={`flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-400 transition ${isdownvote? 'text-red-400':'text-gray-400'}`}>
            <FaArrowDown />
            <span className="text-sm md:text-base">{downvote}</span>
          </button>
        {/* Comment */}
          <button 
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 active:text-blue-400 transition"
          > <a href={`/vent/${id}`} >
            <FaRegComment />
            </a>
            <span className="text-sm md:text-base">{commentcount}</span>
          </button>
        </div>
      { author === user_id && 
        <button disabled={disableSubmitBtn} onClick={handleDeleteVent} className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-600 transition">
          <FaTrash />
        </button>
      }
      </div>
    </div>
  );
};
