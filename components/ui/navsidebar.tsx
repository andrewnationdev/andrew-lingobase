import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faAdd,
  faUser,
  faMessage,
  faBook,
  faQuestionCircle
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const SidebarNav = ({ loggedUser }) => {
  const navItems = [
    { id: 1, icon: faHouse, link: "/dashboard" },
    { id: 2, icon: faAdd, link: "/dashboard/create_conlang" },
    { id: 3, icon: faUser, link: `/dashboard/user/${loggedUser}` },
    { id: 4, icon: faBook, link: `/dashboard/dictionary`},
    { id: 5, icon: faMessage, link: "https://discord.gg/6BEpySdDdv" },
    { id: 6, icon: faQuestionCircle, link: "/dashboard/faq" }
  ];


  return (
    <nav className="fixed left-1/2 bottom-4 -translate-x-1/2 w-auto bg-white/30 dark:bg-zinc-900 backdrop-blur-md p-2 rounded-2xl shadow-lg flex flex-row items-center space-x-4 md:top-auto md:bottom-4 md:left-1/2 md:-translate-x-1/2">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="
    group w-8 h-8 rounded-md flex items-center justify-center 
    text-gray-600 hover:bg-gray-100 transition-all duration-200
  "
        >
          <FontAwesomeIcon
            icon={item.icon}
            className="!text-lg transition-colors duration-200 text-teal-800 dark:text-sky-500 group-hover:text-blue-500"
          />
        </Link>
      ))}
    </nav>
  );
};

export default SidebarNav;
