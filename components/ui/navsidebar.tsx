// components/SidebarNav.js

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faAdd, faUser } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const navItems = [
    { id: 1, icon: faHouse, color: 'bg-green-500', link: "/dashboard" },
    { id: 2, icon: faAdd, color: 'bg-orange-500', link: "/dashboard/create_conlang" },
    { id: 3, icon: faUser, color: 'bg-lime-500', link: "/dashboard" },
];

const SidebarNav = () => {
    return (
        <nav className="fixed left-0 top-1/2 -translate-y-1/2 bottom-0 w-16 h-64 bg-white p-2 shadow-lg flex flex-col items-center space-y-4">
            {navItems.map((item) => (
                <Link
                    key={item.id}
                    href={item.link}
                    className={`
    ${item.color} 
    w-10 h-10 rounded-md flex items-center justify-center 
    text-white text-xs font-bold text-center 
    transition-transform duration-200 hover:scale-110
  `}
                >
                    <FontAwesomeIcon icon={item.icon} className="text-xs!" />
                </Link>
            ))}
        </nav>
    );
};

export default SidebarNav;