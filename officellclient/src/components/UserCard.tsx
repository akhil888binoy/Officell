import axios from "axios";
import { useEffect, useState } from "react";
import { MdLocationOn } from "react-icons/md";
import Cookies from 'js-cookie';

export const UserCard = ({ username, location }: { username: string; location: string }) => {
  
  const [user , setUser ] = useState({ username : ""});

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

        setUser(response.user);
        
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();

  },[]);
  return (
    <div className="w-full  bg-gray-950  p-6 flex items-center gap-5  border-gray-700 transition">
      {/* Avatar */}
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-lg">
        {username[0].toUpperCase()}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {user.username}
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MdLocationOn className="mr-1 text-red-500" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};
