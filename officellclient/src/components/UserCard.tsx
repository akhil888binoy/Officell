import { MdLocationOn } from "react-icons/md";

export const UserCard = ({ username, location }: { username: string; location: string }) => {
  return (
    <div className="w-full max-w-sm bg-white dark:bg-gray-950 rounded-2xl shadow-md p-4 flex items-center gap-4 border  border-gray-700 hover:shadow-lg transition">
      {/* Info */}
      <div className="flex flex-col">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {username}
        </h3>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MdLocationOn className="mr-1 text-red-500" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};
