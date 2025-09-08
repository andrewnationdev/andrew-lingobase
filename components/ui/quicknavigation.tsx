"use client"
import Link from 'next/link';

export default function QuickNavigationComponent({data}:{data: {
    href: string,
    text: string
}[]}){
    return <nav className="light:bg-white shadow-lg p-4 flex justify-center space-x-6 rounded-lg">
        <span>Contents in this Page: </span>
        {data.map((link, index) => <Link key={index} href={link.href} className="text-teal-600">{link.text}</Link>)}
      </nav>
}