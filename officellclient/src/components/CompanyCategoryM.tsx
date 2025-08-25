import { useEffect } from 'react';
import 'flowbite';
import { Drawer } from 'flowbite';
import { FaRocket, FaBuilding, FaUniversity, FaLaptopCode, FaBriefcase, FaIndustry, FaHospital, FaGraduationCap, FaFilm, FaBalanceScale, FaLeaf } from "react-icons/fa";
import { MdOutlineCategory } from 'react-icons/md';

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

// Initialize drawer component
const initDrawer = () => {
  // Options for the drawer
  const options = {
  placement: 'left',
  backdrop: true,
  backdropClasses: 'bg-gray-900 bg-opacity-50 fixed inset-0 z-30', // 👈 important
  bodyScrolling: false,
  edge: false,
  edgeOffset: '',
  onHide: () => console.log('Drawer is hidden'),
  onShow: () => console.log('Drawer is shown'),
  onToggle: () => console.log('Drawer toggled')
};

  // Get the drawer element
  const $targetEl = document.getElementById('filter-sidebar');
  
  // Create a new Drawer instance
  if ($targetEl) {
    const drawer = new Drawer($targetEl, options);
    
    // Add click event listener to close drawer when clicking outside
    const backdrop = document.querySelector('drawer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        drawer.hide();
      });
    }
  }
};

export const CompanyCategoryM = () => {
  useEffect(() => {
    initDrawer();
  }, []);

  return (

    <div className='lg:hidden'>
      <button 
        data-drawer-target="filter-sidebar" 
        data-drawer-toggle="filter-sidebar" 
        aria-controls="filter-sidebar" 
        type="button" 
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <span className="sr-only">Open sidebar</span>
        <MdOutlineCategory className='h-6 w-6' />
      </button>

        <aside 
        id="filter-sidebar" 
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" 
        aria-label="Sidebar"
        tabIndex={-1}
        >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-950 border-r-1 border-gray-700 flex flex-col justify-between">
          {/* Top Section */}
        <div>
            <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-[40px] mt-4 font-arimo text-white font-bold tracking-[-0.07em]">
            ⟢ OFFICELL
            </h1>
            <div className="w-full bg-gray-950 overflow-y-auto no-scrollbar mt-3">
      {/* Heading */}
    <h2 className="px-4 pt-4 text-md font-light text-white tracking-widest">Company Categories</h2>
    
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
    </div>
        </div>
        </aside>
    </div>
    );
};

