import { FaArrowUp, FaArrowDown, FaRegComment } from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";

export const VentCard = () => {
  return (
    <div className="relative flex flex-col bg-gray-950 shadow-md border-b border-r border-l sm:border-l-0 sm:border-r-0 border-gray-700 w-full overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* User + Time */}
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-white font-semibold text-sm md:text-base">
              AnonymousUser123
            </h3>
            <span className="text-xs text-gray-400">2h ago</span>
          </div>
        </div>

        {/* Company + Location */}
        <div className="flex flex-col items-end text-xs text-gray-400 lg:gap-2 gap-1">
          <div className="flex items-center gap-1">
            <RiBuilding2Line className="text-gray-500" />
            <span>BigTech Inc.</span>
          </div>
          <div className="flex items-center gap-1">
            <MdLocationOn className="text-gray-500" />
            <span>Bangalore, India</span>
          </div>
        </div>
      </div>

      {/* Confession Text */}
      <div className="px-4 pb-3">
        <p className="text-gray-200 leading-relaxed text-sm md:text-base">
          I just wanted to confess that I sometimes eat dessert before dinner 🍰😅
        </p>
      </div>

      {/* Footer (Upvote / Downvote / Comments) */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 active:text-green-400 transition">
            <FaArrowUp />
            <span className="text-sm md:text-base">123</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-400 transition">
            <FaArrowDown />
            <span className="text-sm md:text-base">12</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-blue-400 active:text-blue-400 transition">
            <FaRegComment />
            <span className="text-sm md:text-base">12</span>
          </button>
        </div>
      </div>
    </div>
  );
};
