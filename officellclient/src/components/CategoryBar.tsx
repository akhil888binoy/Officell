import { FaUserTie, FaRegLaughBeam, FaBeer, FaUsers, FaBriefcase } from "react-icons/fa";
import { MdOutlineWorkHistory, MdOutlineLaptopChromebook, MdOutlineDarkMode } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FiEye } from "react-icons/fi";
import { useState } from "react";

const categories = [
  { name: "Culture", icon: <FaBriefcase /> },
  { name: "Colleague Drama", icon: <FaUsers /> },
  { name: "Boss Stories", icon: <FaUserTie /> },
  { name: "Overtime", icon: <MdOutlineWorkHistory /> },
  { name: "Salary & Perks", icon: <BiMoney /> },
  { name: "WFH Chronicles", icon: <MdOutlineLaptopChromebook /> },
  { name: "Secret Affairs", icon: <FiEye /> },
  { name: "Gossip", icon: <FaRegLaughBeam /> },
  { name: "After Work Fun", icon: <FaBeer /> },
  { name: "Dark Secrets", icon: <MdOutlineDarkMode /> },
];

export const CategoryBar = ({onSelect}) => {
  const [category , setCategory] = useState("");
  
    const handleCategory =(e)=>{
      if(category){
        setCategory("");
        onSelect("");
      }else{
        setCategory(e.target.value);
        console.log(e.target.value);
        onSelect(e.target.value);
      }
    }

  return (
    <div className="w-full  bg-gray-950 overflow-y-auto no-scrollbar mt-3">
      {/* Heading */}
      <h2 className="px-4 pt-4 text-lg font-light text-white tracking-widest">Categories</h2>
      
      {/* Category Buttons */}
      <div className="flex flex-col gap-4 p-4">
        {categories.map((cat, index) => (
          <button
            key={index}
            onClick={handleCategory}
            value={cat.name}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-4xl
              border border-gray-700 bg-gray-800 text-gray-200
              hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.02] 
              active:scale-95 active:bg-gray-600
              focus:outline-none
              transition-all duration-200 ease-in-out shadow-sm
              ${category === cat.name?'border-2 border-white':''} `}>
            <span className="text-lg">{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
};
