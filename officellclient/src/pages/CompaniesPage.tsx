import { CompanyCategory } from "../components/CompanyCategory";
import { Sidebar } from "../components/Sidebar";
import { UserCard } from "../components/UserCard";
import { CompanyCategoryM } from "../components/CompanyCategoryM";
import CompanySearchBar from "../components/CompanySearchBar";
import { CompanyCard } from "../components/CompanyCard";

export const CompaniesPage = () => {
  return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div >
      <Sidebar/>
      <CompanyCategoryM></CompanyCategoryM>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 ">
            <CompanySearchBar onSearch={(q) => console.log("Searching for:", q)} />
                <CompanyCard/>
                <CompanyCard/>
        </div>
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username="Anonymous123" location="Bangalore, India" />
          <CompanyCategory></CompanyCategory>
          
        </div>
      </div>
    </div>
  );
};
