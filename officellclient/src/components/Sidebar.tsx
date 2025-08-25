import { useEffect } from 'react';
import 'flowbite';
import { Drawer } from 'flowbite';
import { VscAccount } from "react-icons/vsc";
import { FaFireAlt } from 'react-icons/fa';
import { RiBuilding2Line } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { BiMessageDetail, BiMessageEdit } from 'react-icons/bi';

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
  const $targetEl = document.getElementById('logo-sidebar');
  
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

export const Sidebar = () => {
  useEffect(() => {
    // Initialize the drawer when component mounts
    initDrawer();
  }, []);

  return (
    <div>
      <button 
        data-drawer-target="logo-sidebar" 
        data-drawer-toggle="logo-sidebar" 
        aria-controls="logo-sidebar" 
        type="button" 
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-white rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
      >
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside 
        id="logo-sidebar" 
        className="fixed  top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" 
        aria-label="Sidebar"
        tabIndex={-1}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-950 border-r-1 border-gray-700 flex flex-col justify-between">
          {/* Top Section */}
          <div>
            <h1 className="text-4xl sm:text-4xl md:text-6xl lg:text-[40px] mt-4 font-arimo text-white font-bold tracking-[-0.07em]">
              ⟢ OFFICELL
            </h1>
            <ul className="space-y-2 font-medium mt-10">
              {/* Profile */}
              <li>
                <a href="/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="text-[20px] lg:text-[25px]"><VscAccount /></span> 
                  <span className="ms-3 text-[20px] lg:text-[25px] tracking-widest font-light">Profile</span>
                </a>
              </li>
              {/* Feed */}
              <li>
                <a href="/feed" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="text-[20px] lg:text-[25px]"><BiMessageDetail /></span> 
                  <span className="ms-3 text-[20px] lg:text-[25px] tracking-widest font-light">Feed</span>
                </a>
              </li>
              {/* Trending */}
              <li>
                <a href="/trending" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="text-[20px] lg:text-[25px]"><FaFireAlt /></span> 
                  <span className="ms-3 text-[20px] lg:text-[25px] tracking-widest font-light">Trending</span>
                </a>
              </li>
              {/* Companies */}
              <li>
                <a href="/companies" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="text-[20px] lg:text-[25px]"><RiBuilding2Line /></span> 
                  <span className="ms-3 text-[20px] lg:text-[25px] tracking-widest font-light">Companies</span>
                </a>
              </li>
              {/* My Posts */}
              <li>
                <a href="/myposts" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="text-[20px] lg:text-[25px]"><BiMessageEdit /></span> 
                  <span className="ms-3 text-[20px] lg:text-[25px] tracking-widest font-light">My Posts</span>
                </a>
              </li>
              {/* Settings */}
              <li>
                <a href="/myposts" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <span className="text-[20px] lg:text-[25px]"><IoSettingsOutline /></span> 
                  <span className="ms-3 text-[20px] lg:text-[25px] tracking-widest font-light">Settings</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Bottom Button */}
          <button className="border border-white text-white px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-white active:bg-white active:text-black hover:text-black  transition duration-200 mb-4">
            Post
          </button>
        </div>
      </aside>
    </div>
  );
};

