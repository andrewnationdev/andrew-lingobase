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
    <nav className="fixed left-4 bottom-4 w-16 bg-white/30 backdrop-blur-md p-2 rounded-2xl shadow-lg flex flex-col items-center space-y-4 md:top-1/2 md:-translate-y-1/2 md:bottom-auto">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.link}
          className="
    group w-5 h-5 md:w-6 md:h-6 lg:w-8 md:h-8 rounded-md flex items-center justify-center 
    text-gray-600 hover:bg-gray-100 transition-all duration-200
  "
        >
          <FontAwesomeIcon
            icon={item.icon}
            className="!text-sm transition-colors duration-200 text-teal-800 group-hover:text-blue-500"
          />
        </Link>
      ))}
    </nav>
  );
};

export default SidebarNav;
