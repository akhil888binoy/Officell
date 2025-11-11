import { useEffect} from 'react';
import 'flowbite';
import { Drawer } from 'flowbite';
import { MdOutlineCategory } from 'react-icons/md';
import { categories } from '../../../utils/ventCategory';


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
interface CategoryBarProps {
  category: string;
  onSelect: (value: string) => void;
}

export const CategoryBarM = ({ category, onSelect }: CategoryBarProps) => {
    
  const handleCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
  if (category) {
    onSelect("");
  } else {
    onSelect((e.target as HTMLButtonElement).value);
  }
};

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
        className={` items-center justify-center ms-3 mt-2 p-2 
                  hover:bg-gray-800 active:scale-95 transition text-sm sm:hidden
                  focus:outline-none focus:ring-2 focus:ring-gray-200 
                  ${category ? 'bg-gray-50 text-gray-950' : 'text-white'} `}
              >
        <span className="sr-only">Open sidebar</span>
        <MdOutlineCategory className='h-6 w-full' />
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
    <h2 className="px-4 pt-4 text-sm font-dmsans text-white tracking-[1px]">Categories</h2>
    
      {/* Category Buttons */}
        <div className="flex flex-col gap-4 p-4">
        {categories.map((cat, index) => (
            <button
              key={index}
              onClick={handleCategory}
              value={cat.name}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-dmsans font-light tracking-[0.5px] rounded-3xl
                  border border-gray-700 bg-gray-800 text-gray-200
                  hover:bg-gray-700 hover:border-gray-500 hover:scale-[1.01]
                  active:scale-95 active:bg-gray-600
                  transition-all duration-200 ease-in-out shadow-sm
                  ${category === cat.name ? 'border border-white' : ''}`}>
              <span className="text-base">{cat.icon}</span>
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

