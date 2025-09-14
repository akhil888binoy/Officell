import { FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { BiMessageDetail } from "react-icons/bi";
import { Link } from "react-router-dom";
import {getName} from "country-list";

export const CompanyCard = ({company_id , city , country , company_name , industry , vents_count, domain}) => {
  
  const cleanDomain = (url) => {
  if (!url) return '';
  try {
    // Remove protocol (http://, https://) and www.
    return url
      .replace(/^https?:\/\//, '') // Remove http:// or https://
      .replace(/^www\./, '') // Remove www.
      .replace(/\/$/, ''); // Remove trailing slash
  } catch {
    return url; // Fallback to original URL if parsing fails
  }
};

const cleanCountryName = (name) => {
  if (!name) return '';
  return name
    .replace(/^(?:the\s|The\s)/i, '') 
    .replace(/\s*\(the\)$/i, '') 
    .trim(); 
};

  return (
   <>
  {company_id ? 
   
      <div className="relative flex flex-col bg-gray-950 border-t border-b border-gray-700 w-full overflow-hidden">
        {/* Header */}
        <a href={`/companies/${company_id}`} data-testid="company-link" >
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="text-white font-semibold text-lg md:text-xl lg:text-2xl">
            {company_name}
          </h3>
          {/* Category Badge */}
          <span className="px-3 py-1 text-xs md:text-sm lg:text-base font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-400/30">
            {industry}
          </span>
        </div>
        </a>
        
        {/* Body */}
        <div className="px-4 pb-3 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
            <FaMapMarkerAlt className="text-red-400" />
            <span>{city}, {cleanCountryName(getName(country))}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
            <BiMessageDetail className="text-blue-400" />
            <span>{vents_count}</span>
          </div>

        {/* Website */}
        {domain && (
                <div className="flex items-center gap-2 text-gray-400 text-sm md:text-base">
                  <FaGlobe className="text-green-400" />
                  <a
                    data-testid="website-link"
                    onClick={(e) => e.stopPropagation()}
                    href={domain}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-300 transition-colors"
                  >
                    {cleanDomain(domain)}
                  </a>
                </div>
              )}
        </div>
      </div>
  : ""}
</>

    
  );
};
