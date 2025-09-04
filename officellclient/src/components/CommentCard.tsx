// src/components/CommentCard.jsx
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export const CommentCard = ({ comment }) => {
  
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  // const handleReply = () => {
  //   if (replyText.trim() && onReply) {
  //     onReply(comment.id, replyText);
  //     setReplyText("");
  //     setReplying(false);
  //   }
  // };

  return (

    <div className="bg-gray-950 p-3 sm:p-4 ">
       {/* Comment Content */}
            <div className="flex items-start justify-between">
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed break-words flex-1">
          {comment.comment}
        </p>
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 active:text-red-600 transition ml-2">
          <FaTrash />
        </button>
      </div>
      
      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-2 sm:mt-3 text-xs sm:text-sm text-gray-400 gap-2 sm:gap-0">
        <span className="text-gray-400">{comment.author.username}</span>
        <div className="flex gap-3">
          <button
            className="hover:text-gray-100 transition"
            onClick={() => setReplying(!replying)}
          >
            Reply
          </button>
          {comment.replies?.length > 0 && (
            <button
              className="hover:text-gray-100 transition"
              onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies
                ? "Hide Replies"
                : `View Replies (${comment.replies.length})`}
            </button>
          )}
          
        </div>
      </div>

      {/* Reply Input
      {replying && (
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <button
            onClick={handleReply}
            className="self-end sm:self-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-xs sm:text-sm text-white hover:bg-white hover:text-black active:scale-95 transition"
          >
            Send
          </button>
        </div>
      )} */}

      {/* Replies */}
{/* {showReplies && (
  <div className="mt-3 pl-3 border-l border-gray-700">
    {comment.replies.map((reply) => (
      <div key={reply.id} className="mt-2">
        <p className="text-sm text-gray-300">{reply.text}</p>
        <span className="text-xs text-gray-400">{reply.author}</span>
      </div>
    ))}
  </div>
)} */}
    </div>
  );
};
