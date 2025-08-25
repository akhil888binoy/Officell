import { useRef } from "react"
import { GrEmoji } from "react-icons/gr"
import { MdOutlineAttachFile } from "react-icons/md"
import { RiBuilding2Line } from "react-icons/ri"

const PostCard = () => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = textarea.scrollHeight + "px"
    }
  }

  return (
    <div className="w-full  border-gray-700 bg-gray-950 border-l sm:border-l-0">
      {/* Input */}
      <div className="px-3 sm:px-6 lg:px-10 pt-4 sm:pt-5 pb-2 ">
        <textarea
          ref={textareaRef}
          placeholder="Spill the tea..."
          rows={1}
          onInput={handleInput}
          className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
        />
      </div>

      {/* Action Row */}
      <div className="flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-10 pb-3 pt-3">
        {/* Left side icons */}
        <div className="flex gap-x-2 sm:gap-x-3">
          <button className="flex items-center justify-center rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition">
            <MdOutlineAttachFile className="text-base sm:text-lg" />
          </button>
          <button className="flex items-center justify-center rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition">
            <GrEmoji className="text-base sm:text-lg" />
          </button>
          <button className="flex items-center justify-center rounded-full p-1.5 sm:p-2 text-white hover:bg-gray-800 active:scale-95 transition">
            <RiBuilding2Line className="text-base sm:text-lg" />
          </button>
        </div>

        {/* Post Button */}
        <button className="ml-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-sm text-white hover:bg-white hover:text-black active:scale-95 transition">
          Post
        </button>
      </div>
    </div>
  )
}

export default PostCard
