import {CategoryBar} from "../components/CategoryBar";
import { CategoryBarM } from "../components/CategoryBarM";
import PostCard from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import { VentCard } from "../components/VentCard";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import axios from "axios";

export const FeedPage = () => {
  const [username , setUsername ] = useState("");
  const [location, setLocation] = useState("");

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
      } catch (error) {
        console.error(error)
      }
    }

    fetchData();

  },[]);

  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700  " >
      <Sidebar/>
      <CategoryBarM></CategoryBarM>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll ">
            <PostCard />
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>
            <VentCard></VentCard>

        </div>
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username={username} location={location} />
          <CategoryBar></CategoryBar>
        </div>
      </div>
    </div>
  );
};
