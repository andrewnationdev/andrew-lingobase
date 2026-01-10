"use client"
import GreenButton from "../../components/ui/green-button";

export default function ReturnComponent({ id }: { id: string }) {
    return <div
        className="rounded-xl w-full transition duration-150 ease-in-out hover:scale-125"
    >
        <GreenButton props={{
            title: "Dashboard",
            link: "/dashboard/view/" + id
        }}
        />
    </div>

}