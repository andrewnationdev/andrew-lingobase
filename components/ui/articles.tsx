import ArticleForm from "@/components/ui/articles-form";
import ArticleView from "@/components/ui/articles-view";
import { useState } from "react";

export default function Articles({
  id,
  loggedUser,
}: {
  id: string;
  loggedUser: string;
}) {
  const [currArticle, setCurrArticle] = useState({
    title: "",
    content: "",
    written_by: "",
    id: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleEditArticle = (article) => {
    setCurrArticle(article);
    setIsEditing(true);
  };

  return (
    <>
      {loggedUser !== "" && loggedUser !== undefined && (
        <div id="form">
          <ArticleForm loggedUser={loggedUser} id={id} currArticle={{
            title: "",
            content: "",
            written_by: "",
            id: ""
          }} isEditing={isEditing} />
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
