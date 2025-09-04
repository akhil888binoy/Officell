import { FaSearch } from "react-icons/fa";

export default function CompanySearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  return (
  <div
    className="flex items-center w-[90%] sm:w-[80%] md:w-[70%] lg:w-full max-w-md mx-auto bg-gray-950 mt-5 mb-5  border rounded-4xl border-gray-700 px-3 py-2"
  >
    <FaSearch className="text-gray-400 mr-3 text-lg"  />
    <input
      type="text"
      placeholder="Search companies..."
      onChange={(e) => 
          onSearch(e.target.value)
      }
      className="w-full bg-gray-950 text-gray-200 placeholder-gray-500 focus:outline-none"
    />
  </div>
  );
}
