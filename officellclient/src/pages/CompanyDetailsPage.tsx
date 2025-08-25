import {CategoryBar} from "../components/CategoryBar";
import { CategoryBarM } from "../components/CategoryBarM";
import { CompanyCard } from "../components/CompanyCard";
import PostCard from "../components/PostCard";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import { VentCard } from "../components/VentCard";

export const CompanyDetailsPage = () => {
    
  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div >
      <Sidebar/>
      <CategoryBarM></CategoryBarM>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 ">
            <PostCard />
            <CompanyCard></CompanyCard>
            <h3 className="text-1xl sm:text-3xl md:text-6xl border-b border-gray-700 lg:text-[20px]   font-arimo text-white font-bold  lg:pt-3 lg:px-3 lg:pb-3 pt-2 px-2 pb-2">
                Confessions
            </h3>
            <VentCard></VentCard>
        </div>
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username="Anonymous123" location="Bangalore, India" />
          <CategoryBar></CategoryBar>
        </div>
      </div>
    </div>
  );
};
