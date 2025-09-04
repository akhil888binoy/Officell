// src/components/CommentSection.jsx
import { useState, useRef } from "react";
import { CommentCard } from "./CommentCard";

export const CommentSection = () => {
  const [comments, setComments] = useState([
    { id: 1, text: "This is the first comment!", author: "Alice", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },
    { id: 2, text: "Great post!", author: "Bob", replies: [] },

  ]);

    const [newComment, setNewComment] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-expand textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  // Add new top-level comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry = {
      id: Date.now(),
      text: newComment,
      author: "You",
      replies: [],
    };
    setComments([...comments, newEntry]);
    setNewComment("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // reset height
    }
  };

  // // Handle replies
  // const handleReply = (commentId, replyText) => {
  //   const addReply = (items) =>
  //     items.map((item) => {
  //       if (item.id === commentId) {
  //         return {
  //           ...item,
  //           replies: [
  //             ...item.replies,
  //             { id: Date.now(), text: replyText, author: "You", replies: [] },
  //           ],
  //         };
  //       }
  //       return { ...item, replies: addReply(item.replies) };
  //     });

  //   setComments(addReply(comments));
  // };

  return (
    <div  >
      {/* Comment Input Styled like PostCard */}
      <div className="w-full  bg-gray-950  border-b-1 border-gray-700">
        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-2 ">
          <textarea
            ref={textareaRef}
            placeholder="Write a comment..."
            rows={1}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onInput={handleInput}
            className="w-full resize-none overflow-hidden rounded-lg bg-gray-950 text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base"
          />
        </div>

        <div className="flex justify-end px-3 sm:px-4 pb-3 pt-2 ">
          <button
            onClick={handleAddComment}
            className="ml-auto rounded-full border border-gray-500 px-4 sm:px-5 py-1.5 sm:py-2 font-semibold uppercase tracking-wide text-sm text-white hover:bg-white hover:text-black active:scale-95 transition"
          >
            Post
          </button>
        </div>
      </div>

      
    </div>
  );
};
