"use client";
import ArticleForm from "@/components/ui/articles-form";
import ArticleView from "@/components/ui/articles-view";
import { useState } from "react";

export default function Articles({
  id,
  loggedUser,
  conlangOwner
}: {
  id: string;
  loggedUser: string;
  conlangOwner: string;
}) {
  const [currArticle, setCurrArticle] = useState({
    title: "",
    content: "",
    written_by: "",
    id: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditArticle = (article) => {
    setCurrArticle(article);
    setIsEditing(true);
  };

  return (
    <>
      {loggedUser !== "" && loggedUser !== undefined && loggedUser == conlangOwner && (
        <div id="form">
          <ArticleForm
            loggedUser={loggedUser}
            id={id}
            currArticle={currArticle}
            isEditing={isEditing}
          />
        </div>
      )}
      <hr className="my-2" />
      <div id="view">
        <ArticleView
          id={id}
          loggedUser={loggedUser ? loggedUser : "anonymous"}
          onSelectArticle={handleEditArticle}
        />
      </div>
    </>
  );
}
