import { FaArrowUp, FaArrowDown, FaRegComment, FaTrash } from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";
import moment from 'moment';
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { getName } from "country-list";
import useVentStore from "../store/ventStore";
import { useLocation } from "react-router-dom";


export const VentCard = ({ id , category , content , upvote , downvote , company_name , company_country, author, author_id, commentcount , createdAt, media, votes, user_id }) => {

  const [time, setTime] = useState("");
  const [isupvote , setIsUpVote] = useState(false);
  const [isdownvote , setIsDownVote] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const upVote = useVentStore((state)=> state.upVote);
  const downVote = useVentStore((state)=> state.downVote);
  const deleteVent = useVentStore((state)=>state.deleteVent);
  const page = useLocation();
  
const cleanCountryName = (name) => {
  if (!name) return '';
  return name
    .replace(/^(?:the\s|The\s)/i, '') 
    .replace(/\s*\(the\)$/i, '') 
    .trim(); 
};

  useEffect(()=>{
    if (votes?.length > 0 ){
      for (const vote of votes){
        if(vote.user_id == user_id && vote.vote=='UPVOTE'){
          setIsUpVote(true)
        } else if (vote.user_id == user_id && vote.vote=='DOWNVOTE'){
          setIsDownVote(true)
        }
      }
    }
  },[]);

const handleDownvote=async ()=>{
  try {
      setDisableSubmitBtn(true)
      const token =  Cookies.get("Auth");
      const headers={
        'Authorization': `Bearer ${token}`
      };
      let voteenum;
      const vote = votes.find((vote)=> vote.user_id === user_id);
        if(vote){
          if(vote.vote === 'NOVOTE' || vote.vote === 'UPVOTE'){
            voteenum = 'DOWNVOTE';
            setIsDownVote(true);
            setIsUpVote(false);
          }else if (vote.vote ==='DOWNVOTE'){
            voteenum = 'NOVOTE';
            setIsDownVote(false);
            setIsUpVote(false);
          }
        }else{
          voteenum = 'DOWNVOTE';
          setIsDownVote(true);
          setIsUpVote(false);
        }
        downVote(id , author_id, {vent_id : id , user_id : user_id , vote: voteenum});
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
        let voteenum;

        const vote = votes.find((vote)=> vote.user_id === user_id);
        if(vote){
          if(vote.vote === 'NOVOTE' || vote.vote === 'DOWNVOTE'){
            voteenum = 'UPVOTE';
            setIsUpVote(true)
            setIsDownVote(false)
          }else if (vote.vote ==='UPVOTE'){
            voteenum = 'NOVOTE';
            setIsUpVote(false)
            setIsDownVote(false)
          }
        }else{
          voteenum = 'UPVOTE';
          setIsUpVote(true);
          setIsDownVote(false);
        }
        upVote(id , author_id, {vent_id : id , user_id : user_id , vote: voteenum});
        const {data: response} = await axios.post(`http://localhost:3000/v1/vents/${id}/upvote`,"",{
            headers:headers,
        });
        console.log(response.vote);
        setDisableSubmitBtn(false);
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
    deleteVent(id);
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
    <>
    {id &&
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
                    <RiBuilding2Line className="text-blue-400 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-1 flex-wrap justify-end">
              <span className="text-right break-words max-w-[140px] md:max-w-[180px]">
                {cleanCountryName(getName(company_country))}
              </span>
              <MdLocationOn className="text-red-400 flex-shrink-0" />
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
    {media?.map((image) => (
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
        {page.pathname != `/vent/${id}` && 
            <button 
                className="flex items-center gap-2 text-gray-400 hover:text-blue-400 active:text-blue-400 transition"
              > <a href={`/vent/${id}`} >
                <FaRegComment />
                </a>
                <span className="text-sm md:text-base">{commentcount}</span>
              </button>
          }
          
        </div>
      { author_id === user_id && page.pathname != `/vent/${id}` &&
        <button 
        data-modal-target="category-modal"
                data-modal-toggle="category-modal"
                disabled={disableSubmitBtn}  className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-600 transition">
          <FaTrash />
        </button>
      }
      <div id="category-modal" ria-hidden="true" className="hidden  fixed top-0 right-0 left-0 z-50 justify-center items-center w-[10px] md:inset-0 h-[calc(90%-1rem)] max-h-full">
      <div className="relative p-4 w-full max-w-md  max-h-full">
        
          <div className="relative rounded-lg shadow-sm bg-gray-950 ">
            
              <div className="flex  items-center justify-between md:p-5  rounded-t border-r border-l border-t border-gray-700">
                      <h2 className="px-4 pt-4 pb-4 text-lg font-light text-white tracking-widest">Choose Category</h2>
              </div>
              <div className="p-4  md:p-5 justify-center items-center flex-1 overflow-y-scroll max-h-[60vh] border-l border-r border-t border-gray-700">
                  <div className="flex flex-col gap-4 p-4">
                        
                  </div>
              </div>
          
              <div className="flex items-center justify-between p-4 md:p-5  border-gray-200 rounded-b border dark:border-gray-600">
              <button data-modal-hide="category-modal" type="button" className="text-black bg-gray-50 hover:bg-gray-950 hover:text-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Choose</button>
              <button type="button" 		className="border border-red-500 bg-red-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-red-600 focus:outline-none focus:shadow-outline" data-modal-hide="category-modal">
                      Cancel
                </button>
              </div>
          </div>
      </div>
  </div>

      </div>
    </div> 
    }
    </>
  );
};
