import { useState } from "react";
import { MdOutlineAttachFile, MdOutlineCategory } from "react-icons/md"
import { RiBuilding2Line } from "react-icons/ri"
import InputEmoji from 'react-input-emoji';
import Cookies from 'js-cookie';
import axios from 'axios';

const PostCard = () => {

  const [post , setPost ] = useState("");
  const [company_id , setCompany_id] = useState("");
  const [category , setCategory] = useState("");
  const [media_url , setMedia_url] = useState("");
  const [media_type , setMedia_type] = useState(null);

  const handlePost= async ()=>{

      const token =  Cookies.get("Auth");
      console.log(token);
      const headers={
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const  response = await axios.post("http://localhost:3000/v1/vents", {
        content: post,
        company_id : company_id,
        category:category,
        media_url: media_url,
        media_type: media_type

      },{
          headers:headers
      });
      console.log(response)
  }
  return (

    <div className="w-full   bg-gray-950 ">
      {/* Input */}
      <div className="px-3 sm:px-6 lg:px-10 pt-4 sm:pt-5 pb-2 ">
        <input
          value={post}
          onChange={e=>setPost(e.target.value)}
          placeholder="Spill the tea..."
          className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
        />
      </div>
      {/* Action Row */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-10 pb-3 pt-3 border-gray-700 border-b">
        {/* Left side icons */}
        <div className="flex gap-x-2 sm:gap-x-3">
          <button className="flex items-center justify-center rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition">
            <MdOutlineAttachFile className="text-base sm:text-lg" />
          </button>
          <button className="flex items-center justify-center rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition">
            <RiBuilding2Line className="text-base sm:text-lg" />
          </button>
          <button className="flex items-center justify-center rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition">
            <MdOutlineCategory className="text-base sm:text-lg" />
          </button>
        </div>
        {/* Post Button */}
        <button onClick={handlePost} className="ml-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-sm text-white hover:bg-white hover:text-black active:scale-95 transition">
          Post
        </button>
      </div>
    </div>
  )
}

export default PostCard
