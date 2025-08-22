"use client";

import { supabase } from "@/lib/supabase/database";
import { useEffect, useState } from "react";
import GreenButton from "./green-button";
import { showErrorToast, showSuccessToast } from "@/lib/toast";

export default function UserPageComponent({ user, loggedUser }: { user: string; loggedUser?: string }) {
  const [userName, setUserName] = useState("");
  const [userLangs, setUserLangs] = useState([]);
  const [conlangCount, setConlangCount] = useState(0);
  const [userDescription, setUserDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserLangs = async () => {
      const langs = await supabase
        .from("conlang")
        .select("*")
        .eq("created_by", userName);

      const num = langs.data?.length || 0;

      setConlangCount(num);
      setUserLangs(langs.data || []);
    };

    const fetchUserProfile = async () => {
      if (!userName) return;
      
      const { data, error } = await supabase
        .from("user-profiles")
        .select("description")
        .eq("username", userName)
        .single();

      if (!error && data) {
        setUserDescription(data.description || "");
      } else {
        setUserDescription("");
      }
    };

    if (userName) {
      fetchUserLangs();
      fetchUserProfile();
    }
  }, [userName, user]);

  useEffect(() => {
      setUserName(user);
  }, [user]);

  const handleEditClick = () => {
    setEditDescription(userDescription);
    setIsEditing(true);
  };

  const handleSaveDescription = async () => {
    if (!userName) return;
    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("user-profiles")
        .select("username")
        .eq("username", userName)
        .single();

      if (fetchError && fetchError.code !== "PGRST116") {
        showErrorToast("Failed to check user profile");
        setIsLoading(false);
        return;
      }

      let error;
      if (data && data.username) {
        ({ error } = await supabase
          .from("user-profiles")
          .update({ description: editDescription })
          .eq("username", userName));
      } else {
        ({ error } = await supabase
          .from("user-profiles")
          .insert({ username: userName, description: editDescription }));
      }

      if (error) {
        console.log("Error saving description:", error);
        showErrorToast("Failed to save description");
      } else {
        setUserDescription(editDescription);
        setIsEditing(false);
        showSuccessToast("Saved changes successfully");
      }
    } catch (err) {
      showErrorToast("Error:", err);
      showErrorToast("Failed to save description");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditDescription("");
    setIsEditing(false);
  };

  const canEdit = loggedUser === userName;

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-center mb-2">{`${userName}'s Profile`}</h1>

      {/* User Description Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">About {userName}</h2>
          {canEdit && !isEditing && (
            <button
              onClick={handleEditClick}
              className="py-2 px-4 rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            >
              Edit Description
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Tell others about yourself..."
              className="w-[300px] md:w-[500px] h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-200 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveDescription}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gray-400 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {userDescription || "This user hasn't added a description yet."}
          </p>
        )}
      </div>

      <hr className="my-4" />
      <h2 className="text-2xl font-semibold text-center mb-2">{`This user's conlangs`}</h2>
      <span className="text-center mb-2">This user has <span className="font-bold">{conlangCount}</span> conlangs on the website!</span>
      <ol className="flex flex-col gap-2 max-w-xs text-center mx-auto">
        {userLangs.length > 0 &&
          userLangs.map((c) => (
            <GreenButton
              key={c.id}
              props={{
                title: c.english_name,
                link: `/dashboard/view/${c.code}`,
              }}
            />
          ))}
      </ol>
    </div>
  );
}
