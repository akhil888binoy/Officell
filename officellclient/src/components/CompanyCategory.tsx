import { FaRocket, FaBuilding, FaUniversity, FaLaptopCode, FaBriefcase, FaIndustry, FaHospital, FaGraduationCap, FaFilm, FaBalanceScale, FaLeaf } from "react-icons/fa";

const categories = [
{ name: "Startups", icon: <FaRocket className="text-pink-500" /> },
  { name: "MNCs", icon: <FaBuilding className="text-blue-500" /> },
  { name: "Government Jobs", icon: <FaUniversity className="text-yellow-600" /> },
  { name: "Software", icon: <FaLaptopCode className="text-indigo-500" /> },
  { name: "Finance", icon: <FaBriefcase className="text-gray-50" /> },
  { name: "Manufacturing ", icon: <FaIndustry className="text-orange-500" /> },
  { name: "Healthcare ", icon: <FaHospital className="text-red-500" /> },
  { name: "Education", icon: <FaGraduationCap className="text-green-600" /> },
  { name: "Media ", icon: <FaFilm className="text-pink-600" /> },
  { name: "Law", icon: <FaBalanceScale className="text-yellow-700" /> },
  { name: "NGOs ", icon: <FaLeaf className="text-green-500" /> },
];

export const CompanyCategory = () => {
  return (
    <div className="w-full bg-gray-950 overflow-y-auto no-scrollbar mt-3">
      {/* Heading */}
      <h2 className="px-4 pt-4 text-lg font-light text-white tracking-widest">Company Categories</h2>
      
      {/* Category Buttons */}
      <div className="flex flex-col gap-4 p-4">
        {categories.map((cat, index) => (
          <button
            key={index}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-4xl
              border border-gray-700 bg-gray-800 text-gray-200
              hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.02] 
              active:scale-95 active:bg-gray-600
              focus:ring-2 focus:ring-white focus:outline-none
              transition-all duration-200 ease-in-out shadow-sm">
            <span className="text-lg">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};
