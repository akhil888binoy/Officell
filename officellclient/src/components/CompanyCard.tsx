import { FaMapMarkerAlt } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { Link } from "react-router-dom";

export const CompanyCard = ({company_id , city , country , company_name , industry}) => {
   
  return (
     <Link to={`/companies/${company_id}`}>
    <div className="relative flex flex-col bg-gray-950  border-t border-b  border-gray-700 w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-white font-semibold text-lg md:text-xl lg:text-2xl">
       {company_name}
        </h3>
        {/* Category Badge */}
        <span className="px-3 py-1 text-xs md:text-sm lg:text-base font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
         {industry}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
          <FaMapMarkerAlt className="text-red-400" />
          <span>{city}, {country}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
          <BiMessageDetail className="text-blue-400" />
          <span>245 Confessions</span>
        </div>
      </div>
    </div>
    </Link>
  );
};
