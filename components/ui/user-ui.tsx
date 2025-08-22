"use client";

import { supabase } from "@/lib/supabase/database";
import { useEffect, useState } from "react";
import GreenButton from "./green-button";

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
        .from("user_profiles")
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
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          username: userName,
          description: editDescription,
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) {
        console.error("Error saving description:", error);
        alert("Failed to save description");
      } else {
        setUserDescription(editDescription);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to save description");
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
      <h1 className="text-3xl bold">{`${userName}'s Profile`}</h1>
      
      {/* User Description Section */}
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">About {userName}</h2>
          {canEdit && !isEditing && (
            <button
              onClick={handleEditClick}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={4}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveDescription}
                disabled={isLoading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50"
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
      <h2 className="text-3xl font-semibold">{`This user's conlangs`}</h2>
      <span>This user has {conlangCount} conlangs on the website!</span>
      <ol className="flex flex-col gap-2 max-w-[250px] text-center mx-auto">
        {userLangs.length > 0 &&
          userLangs.map((c) => (
            <GreenButton
              key={c.id}
              props={{
                title: c.english_name,
                link: `/dashboard/conlang/${c.conlang_code}`,
              }}
            />
          ))}
      </ol>
    </div>
  );
}
