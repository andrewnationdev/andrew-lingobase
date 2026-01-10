import { IResult } from "@/lib/dictionary";

interface IStatsList {
    title: string;
    data: IResult;
}

export default function StatsListComponent(props: IStatsList){
    return <><h2 className="mt-4 text-3xl font-bold">{props.title}</h2>
        <div className="flex flex-col gap-4 mt-4">
            {props.data.data && props.data.data.length > 0 ? props.data.data.map((item, index) => 
            <span key={index}>
                <strong>{item.lexical_item}</strong> - <em>{item.pos}</em> : {item.definition}</span>) : <span>No items found.</span>}
        </div></>
}