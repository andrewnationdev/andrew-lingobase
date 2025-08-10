"use client"
import GreenButton from "../../components/ui/green-button";

export default function ReturnComponent({ id }: { id: string }) {
    return <div
        className="rounded-xl w-full "
    >
        <GreenButton props={{
            title: "< Return to Dashboard",
            link: "/dashboard/view/" + id
        }}
        />
    </div>

}