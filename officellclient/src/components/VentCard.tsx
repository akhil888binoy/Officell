import { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaRegComment,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { RiBuilding2Line } from "react-icons/ri";
import { MdLocationOn } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

export const VentCard = () => {
  const navigate = useNavigate();
  const ventId = "123";

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    "I just wanted to confess that I sometimes eat dessert before dinner 🍰😅"
  );
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSave = () => {
    // Here you would handle updating in backend
    console.log("Updated content:", content);
    console.log("Attached file:", file);
    setIsEditing(false);
  };

  return (
    <div className="relative flex flex-col bg-gray-950 border-t border-b border-gray-700  w-full overflow-hidden">
      <Link to={`/vent/${ventId}`}>
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
      </Link>

      {/* Confession Text */}
      <div className="px-4 pb-3">
        {isEditing ? (
          <div className="flex flex-col gap-3">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="text-sm text-gray-400"
            />
            {file && (
              <p className="text-xs text-gray-300">Attached: {file.name}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-200 leading-relaxed text-sm md:text-base lg:text-lg">
            {content}
          </p>
        )}
      </div>

            {/* Attached Media Preview */}
      {file && !isEditing && (
        <div className=" pb-3 px-4  flex flex-col justify-center items-center " >
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="attachment"
              className="w-auto h-auto max-h-96 rounded-lg object-contain "
            />
          ) : (
            <video
              controls
              src={URL.createObjectURL(file)}
              className="w-full max-h-96 rounded-lg object-contain"
            />
          )}
        </div>
      )}


      {/* Footer (Upvote / Downvote / Comments / Edit) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 gap-3 sm:gap-0">
        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 active:text-green-400 transition">
            <FaArrowUp />
            <span className="text-sm md:text-base">123</span>
          </button>
          <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-400 transition">
            <FaArrowDown />
            <span className="text-sm md:text-base">12</span>
          </button>
          <button
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 active:text-blue-400 transition"
            onClick={() => navigate(`/vent/${ventId}`)}
          >
            <FaRegComment />
            <span className="text-sm md:text-base">12</span>
          </button>
        </div>

        {/* Edit/Save Controls */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 text-green-400 hover:text-green-500 transition"
              >
                <FaSave />
                <span className="text-sm">Save</span>
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 text-red-400 hover:text-red-500 transition"
              >
                <FaTimes />
                <span className="text-sm">Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition"
            >
              <FaEdit />
              <span className="text-sm">Edit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
