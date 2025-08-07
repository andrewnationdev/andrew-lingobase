// components/SidebarNav.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faAdd, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const navItems = [
    { id: 1, icon: faHouse, link: "/dashboard" },
    { id: 2, icon: faAdd, link: "/dashboard/create_conlang" },
    { id: 3, icon: faUser, link: "/dashboard/user" },
];

const SidebarNav = () => {
    return (
        <nav className="fixed left-4 top-1/2 -translate-y-1/2 w-16 bg-white/30 backdrop-blur-md p-2 rounded-2xl shadow-lg flex flex-col items-center space-y-4">
            {navItems.map((item) => (
                <Link
                    key={item.id}
                    href={item.link}
                    className="
    group w-10 h-10 rounded-md flex items-center justify-center 
    text-gray-600 hover:bg-gray-100 transition-all duration-200
  "
                >
                    <FontAwesomeIcon 
                        icon={item.icon} 
                        className="text-xs transition-colors duration-200 group-hover:text-blue-500" 
                    />
                </Link>
            ))}
        </nav>
    );
};

export default SidebarNav;
