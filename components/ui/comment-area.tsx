import { MessageCircleIcon } from "lucide-react";
import React, { useState } from "react";

export type Comment = {
  id: string;
  text: string;
  author: string;
  createdAt: string;
};

export type ICommentArea = {
  handleSendComment: (comment: Comment) => void;
  comments: Comment[] | [];
}

const CommentAreaComponent: React.FC<ICommentArea> = ({ handleSendComment, comments }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      text: trimmed,
      author: "Anonymous", // placeholder para o nome do usuário
      createdAt: new Date().toISOString(),
    };
    // delegate saving to parent via prop
    console.log("Sending comment:", newComment);
    handleSendComment(newComment);
    setText("");
  };

  const handleReport = (id: string) => {
    console.log("Report comment id:", id);
    alert("Comment reported."); 
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center" aria-hidden="true">
                <MessageCircleIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Write a comment</h3>
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">Comments</h4>

          {comments.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No comments yet. Be the first to comment.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{c.author}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">• {new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{c.text}</p>
                    </div>

                    <div className="flex-shrink-0 ml-4">
                      <button
                        type="button"
                        onClick={() => handleReport(c.id)}
                        className="inline-flex items-center justify-center py-2 px-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={`Report comment by ${c.author}`}
                      >
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />

          <form onSubmit={handleSubmit} className="mt-2">
            <label htmlFor="comment" className="sr-only">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your comment..."
              rows={4}
              maxLength={180}
              className="block w-full mt-2 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm p-3 bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-cyan-600 focus:border-cyan-600 sm:text-sm resize-vertical"
              aria-label="Comment field"
            />

            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">{text.length}/180 characters</span>
              <button
                type="submit"
                className="inline-flex items-center justify-center py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!text.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentAreaComponent;