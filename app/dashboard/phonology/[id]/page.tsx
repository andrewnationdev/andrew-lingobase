"use client"
import React, { useState } from "react";
import { useParams } from "next/navigation";

const ipaConsonantChart = [
	{ label: "Nasal", cells: [["m", "ɱ"], [null, null], ["n", "ɳ"], ["ɲ", "ŋ"], ["ɴ", null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]] },
	{ label: "Plosive", cells: [["p", "b"], ["t", "d"], ["ʈ", "ɖ"], ["c", "ɟ"], ["k", "g"], ["q", "ɢ"], ["ʡ", null], ["ʔ", null], [null, null], [null, null], [null, null]] },
	{ label: "Fricative", cells: [["ɸ", "β"], ["f", "v"], ["θ", "ð"], ["s", "z"], ["ʃ", "ʒ"], ["ʂ", "ʐ"], ["ç", "ʝ"], ["x", "ɣ"], ["χ", "ʁ"], ["ħ", "ʕ"], ["h", "ɦ"]] },
	{ label: "Lateral fricative", cells: [[null, null], [null, null], ["ɬ", "ɮ"], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]] },
	{ label: "Lateral approximant", cells: [[null, null], [null, null], ["l", "ɭ"], ["ʎ", "ʟ"], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]] },
	{ label: "Approximant", cells: [["ʋ", null], [null, null], ["ɹ", "ɻ"], ["j", "ɰ"], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]] },
	{ label: "Trill", cells: [["ʙ", null], [null, null], ["r", "ɾ"], ["ɽ", null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null], [null, null]] },
];
const ipaConsonantHeaders = [
  "Bilab.", "Labiod.", "Dental", "Alveolar", "Postalv.", "Retrofl.", "Palatal", "Velar", "Uvular", "Pharyng.", "Glottal"
];

const ipaVowelChart = [
	{ label: "Close", cells: ["i", "y", "ɨ", "ʉ", "ɯ", "u"] },
	{ label: "Near-close", cells: ["ɪ", "ʏ", null, null, "ʊ", null] },
	{ label: "Close-mid", cells: ["e", "ø", "ɘ", "ɵ", "ɤ", "o"] },
	{ label: "Mid", cells: ["ə", null, null, null, null, null] },
	{ label: "Open-mid", cells: ["ɛ", "œ", "ɜ", "ɞ", "ʌ", "ɔ"] },
	{ label: "Near-open", cells: ["æ", null, "ɐ", null, null, null] },
	{ label: "Open", cells: ["a", "ɶ", null, null, "ɑ", "ɒ"] },
];
const ipaVowelHeaders = [
  "Front", "Front-central", "Central", "Back-central", "Back", "Far-back"
];

function IPAChart({ phonemes, onToggle }) {
	const handleCellClick = (symbol) => {
		if (!symbol) return;
		if (phonemes.includes(symbol)) {
			onToggle(phonemes.filter(p => p !== symbol));
		} else {
			onToggle([...phonemes, symbol]);
		}
	};
	return (
		<div className="mb-8 flex flex-col items-center w-full">
			<h3 className="font-bold mb-2 text-center">IPA Chart</h3>
			<div className="mb-4 w-full flex flex-col items-center">
				<span className="font-semibold text-center">Consonants:</span>
				<div className="overflow-x-auto w-full max-w-full">
					<table className="border mx-auto text-sm md:text-base" style={{ fontSize: '16px', minWidth: '600px' }}>
						<thead>
							<tr>
								<th className="border px-1 py-1 whitespace-nowrap"></th>
								{ipaConsonantHeaders.map(h => (
									<th key={h} className="border px-1 py-1 whitespace-nowrap text-center">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{ipaConsonantChart.map((row, i) => (
								<tr key={i}>
									<td className="border px-2 py-1 font-semibold text-center">{row.label}</td>
									{row.cells.map((pair, j) => (
										<td key={j} className="border px-2 py-1 text-center">
											{pair && (pair[0] || pair[1]) ? (
												<div className="flex flex-row gap-1 items-center justify-center">
													{pair.map((c, idx) => c ? (
														<button
															key={c}
															className={`rounded px-1 py-1 w-8 ${phonemes.includes(c) ? "bg-green-400 text-white" : "bg-white"}`}
															style={{ fontSize: '13px' }}
															onClick={() => handleCellClick(c)}
														>{c}</button>
													) : null)}
												</div>
											) : null}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<div className="w-full flex flex-col items-center">
				<span className="font-semibold text-center">Vowels:</span>
				<div className="overflow-x-auto w-full max-w-full">
					<table className="border mx-auto text-sm md:text-base" style={{ fontSize: '16px', minWidth: '600px' }}>
						<thead>
							<tr>
								<th className="border px-1 py-1 whitespace-nowrap"></th>
								{ipaVowelHeaders.map(h => (
									<th key={h} className="border px-1 py-1 whitespace-nowrap text-center">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{ipaVowelChart.map((row, i) => (
								<tr key={i}>
									<td className="border px-2 py-1 font-semibold text-center">{row.label}</td>
									{row.cells.map((v, j) => (
										<td key={j} className="border px-2 py-1 text-center">
											{v ? (
												<button
													className={`rounded px-2 py-1 w-8 ${phonemes.includes(v) ? "bg-green-400 text-white" : "bg-white"}`}
													style={{ fontSize: '13px' }}
													onClick={() => handleCellClick(v)}
												>{v}</button>
											) : null}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default function EditPhonologyPage() {
	const params = useParams();
	const conlangId = Array.isArray(params?.id) ? params.id[0] : params?.id;
	const [phonotactics, setPhonotactics] = useState("");
	const [phonemes, setPhonemes] = useState<string[]>([]);
	const [allophones, setAllophones] = useState<{ [key: string]: string[] }>({});
	const [newAllophone, setNewAllophone] = useState<{ phoneme: string; value: string }>({ phoneme: "", value: "" });

	const handleAddAllophone = () => {
		if (newAllophone.phoneme && newAllophone.value) {
			setAllophones({
				...allophones,
				[newAllophone.phoneme]: [
					...(allophones[newAllophone.phoneme] || []),
					newAllophone.value,
				],
			});
			setNewAllophone({ phoneme: "", value: "" });
		}
	};

	return (
		<div className="p-6 max-w-3xl mx-auto">
			<h1 className="text-2xl font-bold mb-4">Edit Phonology</h1>
			<span className="my-8">This page is experimental and won't save yet!</span>
			<div className="mb-2 text-gray-600">Conlang ID: <span className="font-mono">{conlangId}</span></div>
			<div className="mb-6">
				<label className="block font-semibold mb-2">Phonotactics and details:</label>
				<textarea
					className="w-full border rounded p-2"
					rows={4}
					value={phonotactics}
					onChange={e => setPhonotactics(e.target.value)}
					placeholder="Describe phonotactic rules, phonological processes, etc."
				/>
			</div>
			<div className="mb-6">
				<h2 className="font-semibold mb-2">Select phonemes (IPA):</h2>
				<IPAChart phonemes={phonemes} onToggle={setPhonemes} />
			</div>
			<div className="mb-6">
				<h2 className="font-semibold mb-2">Selected phonemes:</h2>
				<ul>
					{phonemes.map((p) => (
						<li key={p} className="mb-1">
							<span className="font-mono">{p}</span>
							{allophones[p] && (
								<span className="ml-2 text-sm text-gray-600">
									Allophones: {allophones[p].join(", ")}
								</span>
							)}
						</li>
					))}
				</ul>
				<div className="mt-4 flex gap-2">
					<select
						className="border rounded px-2"
						value={newAllophone.phoneme}
						onChange={e => setNewAllophone({ ...newAllophone, phoneme: e.target.value })}
					>
						<option value="">Phoneme</option>
						{phonemes.map(p => <option key={p} value={p}>{p}</option>)}
					</select>
					<input
						className="border rounded px-2"
						type="text"
						placeholder="Allophone (IPA)"
						value={newAllophone.value}
						onChange={e => setNewAllophone({ ...newAllophone, value: e.target.value })}
					/>
					<button
						className="bg-green-500 text-white px-3 py-1 rounded"
						onClick={handleAddAllophone}
					>
						Add allophone
					</button>
				</div>
				<div className="mt-6">
					<h3 className="font-bold mb-2">Blends</h3>
					<div className="border rounded p-2 bg-gray-50">(Add blends functionality here)</div>
				</div>
			</div>
		</div>
	);
}
