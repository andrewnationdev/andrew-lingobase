import Link from "next/link";

export default function GreenButton({ props }: { props: { title: string, link: string, isCustom?: boolean } }) {
    return <Link
        className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white ${props.isCustom ? "bg-sky-600 hover:bg-sky-800" : "bg-teal-600 hover:bg-teal-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200`}
        href={props.link}>
        {props.title}
    </Link>
}