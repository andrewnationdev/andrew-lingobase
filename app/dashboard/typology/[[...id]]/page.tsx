import TypologyForm from "@/components/ui/typology-form";


export default function TypologyPage({params}) {
    const conlangCode = params.id[0];

    return <TypologyForm id={conlangCode}/>;
}