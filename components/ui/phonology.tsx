"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/database";
import ReturnComponent from "@/components/ui/return";

const ipaConsonantChart = [
  {
    label: "Nasal",
    cells: [
      ["m", "ɱ"],
      [null, null],
      ["n", "ɳ"],
      ["ɲ", "ŋ"],
      ["ɴ", null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Plosive",
    cells: [
      ["p", "b"],
      ["t", "d"],
      ["ʈ", "ɖ"],
      ["c", "ɟ"],
      ["k", "g"],
      ["q", "ɢ"],
      ["ʡ", null],
      ["ʔ", null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Affricate",
    cells: [
      ["t͡s", "d͡z"],
      ["t͡ʃ", "d͡ʒ"],
      ["t͡ɕ", "d͡ʑ"],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Fricative",
    cells: [
      ["ɸ", "β"],
      ["f", "v"],
      ["θ", "ð"],
      ["s", "z"],
      ["ʃ", "ʒ"],
      ["ɕ", "ʑ"],
      ["ʂ", "ʐ"],
      ["ç", "ʝ"],
      ["x", "ɣ"],
      ["χ", "ʁ"],
      ["ħ", "ʕ"],
      ["h", "ɦ"],
    ],
  },
  {
    label: "Lateral fricative",
    cells: [
      [null, null],
      [null, null],
      ["ɬ", "ɮ"],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Lateral approximant",
    cells: [
      [null, null],
      [null, null],
      ["l", "ɭ"],
      ["ʎ", "ʟ"],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Approximant",
    cells: [
      ["ʋ", null],
      [null, null],
      ["ɹ", "ɻ"],
      ["j", "ɰ"],
      [null, null],
      [null, null],
      [null, null],
      ["w", null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Trill",
    cells: [
      ["ʙ", null],
      [null, null],
      ["r", "ɾ"],
      ["ɽ", null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Implosive",
    cells: [
      ["ɓ", null],
      ["ɗ", null],
      [null, "ʄ"],
      ["ɠ", null],
      ["ʛ", null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
  {
    label: "Clicks",
    cells: [
      ["ʘ", null],
      ["ǀ", null],
      ["ǃ", null],
      ["ǂ", null],
      ["ǁ", null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
    ],
  },
];
const ipaConsonantHeaders = [
  "Bilabial",
  "Labiodental",
  "Dental",
  "Alveolar",
  "Postalveolar",
  "Palato-alveolar",
  "Retroflex",
  "Palatal",
  "Velar",
  "Uvular",
  "Pharyngeal",
  "Glottal",
];

const ipaVowelChart = [
  {
    label: "Close",
    cells: [
      ["i", "y"],
      ["ɨ", "ʉ"],
      ["ɯ", "u"],
    ],
  },
  { label: "Near-close", cells: [["ɪ", "ʏ"], ["ɪ̈", "ʊ̈"], ["ʊ"]] },
  {
    label: "Close-mid",
    cells: [
      ["e", "ø"],
      ["ɘ", "ɵ"],
      ["ɤ", "o"],
    ],
  },
  {
    label: "Mid",
    cells: [
      ["ɛ", "œ"],
      ["ə", "ɜ", "ɞ"],
      ["ʌ", "ɔ"],
    ],
  },
  { label: "Open-mid", cells: [["æ"], ["ɐ"], ["ɑ", "ɒ"]] },
  { label: "Open", cells: [["a", "ɶ"], ["ä"], ["ɑ", "ɒ"]] },
];
const ipaVowelHeaders = ["Front", "Central", "Back"];

function IPAChart({ phonemes, onToggle }) {
  const handleCellClick = (symbol) => {
    if (!symbol) return;
    if (phonemes.includes(symbol)) {
      onToggle(phonemes.filter((p) => p !== symbol));
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
          <table
            className="border mx-auto text-sm md:text-base"
            style={{ fontSize: "16px", minWidth: "600px" }}
          >
            <thead>
              <tr>
                <th className="border px-1 py-1 whitespace-nowrap"></th>
                {ipaConsonantHeaders.map((h) => (
                  <th
                    key={h}
                    className="border px-1 py-1 whitespace-nowrap text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ipaConsonantChart.map((row, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 font-semibold text-center">
                    {row.label}
                  </td>
                  {row.cells.map((pair, j) => (
                    <td key={j} className="border px-2 py-1 text-center">
                      {pair && (pair[0] || pair[1]) ? (
                        <div className="flex flex-row gap-1 items-center justify-center">
                          {pair.map((c, index) =>
                            c ? (
                              <button
                                key={index}
                                className={`rounded px-1 py-1 w-8 text-bold ${
                                  phonemes.includes(c)
                                    ? "bg-green-400 text-white"
                                    : "bg-white"
                                }`}
                                style={{ fontSize: "16px" }}
                                onClick={() => handleCellClick(c)}
                              >
                                {c}
                              </button>
                            ) : null
                          )}
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
          <table
            className="border mx-auto text-sm md:text-base"
            style={{ fontSize: "16px", minWidth: "600px" }}
          >
            <thead>
              <tr>
                <th className="border px-1 py-1 whitespace-nowrap"></th>
                {ipaVowelHeaders.map((h) => (
                  <th
                    key={h}
                    className="border px-1 py-1 whitespace-nowrap text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ipaVowelChart.map((row, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1 font-semibold text-center">
                    {row.label}
                  </td>
                  {row.cells.map((cell, j) => (
                    <td key={j} className="border px-2 py-1 text-center">
                      {cell && cell.length > 0 ? (
                        <div className="flex flex-row gap-1 items-center justify-center flex-wrap">
                          {cell.map((v, idx) => (
                            <button
                              key={idx}
                              className={`rounded px-2 py-1 w-8 ${
                                phonemes.includes(v)
                                  ? "bg-green-400 text-white"
                                  : "bg-white"
                              }`}
                              style={{ fontSize: "13px" }}
                              onClick={() => handleCellClick(v)}
                            >
                              {v}
                            </button>
                          ))}
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
    </div>
  );
}

export default function PhonologyComponent({ loggedUser }) {
  const params = useParams();
  const conlangId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [phonotactics, setPhonotactics] = useState("");
  const [phonemes, setPhonemes] = useState<string[]>([]);
  const [allophones, setAllophones] = useState<{ [key: string]: string[] }>({});
  const [newAllophone, setNewAllophone] = useState<{
    phoneme: string;
    value: string;
  }>({ phoneme: "", value: "" });
  const [conlangAuthor, setConlangAuthor] = useState<string | null>(null);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [loadingPhonology, setLoadingPhonology] = useState(true);
  const [saving, setSaving] = useState(false);
  const [phonologyExists, setPhonologyExists] = useState(true);

  useEffect(() => {
    async function fetchAuthor() {
      setLoadingAuthor(true);
      const { data, error } = await supabase
        .from("conlang")
        .select("*")
        .eq("code", conlangId)
        .single();
      if (data && data.created_by) {
        setConlangAuthor(data.created_by);
      }
      setLoadingAuthor(false);
      console.log(error);
    }

    if (conlangId) fetchAuthor();
  }, [conlangId]);

  useEffect(() => {
    async function fetchPhonology() {
      setLoadingPhonology(true);
      const { data, error } = await supabase
        .from("conlang-phonology")
        .select("phonemes, allophones, phonotactics")
        .eq("conlang_id", conlangId)
        .single();
      if (data) {
        setPhonemes(data.phonemes || []);
        setAllophones(data.allophones || {});
        setPhonotactics(data.phonotactics || "");
        setPhonologyExists(true);
      } else {
        setPhonologyExists(false);
      }

      console.log(error);
      setLoadingPhonology(false);
    }
    if (conlangId) fetchPhonology();
  }, [conlangId]);

  const isEditable = loggedUser === conlangAuthor;

  const handleAddAllophone = () => {
    if (!isEditable) return;
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

  const handleSave = async () => {
    if (!isEditable || saving) return;
    setSaving(true);
    const { data, error: fetchError } = await supabase
      .from("conlang-phonology")
      .select("*")
      .eq("conlang_id", conlangId)
      .single();
    if (fetchError && fetchError.code !== "PGRST116") {
      setSaving(false);
      alert("Error checking phonology: " + fetchError.message);
      return;
    }
    if (data && data.id) {
      const { error } = await supabase
        .from("conlang-phonology")
        .update({
          phonemes,
          allophones,
          phonotactics,
        })
        .eq("conlang_id", conlangId);
      setSaving(false);
      if (!error) {
        window.location.reload();
      } else {
        alert("Error updating phonology: " + error.message);
      }
    } else {
      const { error } = await supabase.from("conlang-phonology").insert({
        conlang_id: conlangId,
        phonemes,
        allophones,
        phonotactics,
      });
      setSaving(false);
      if (!error) {
        window.location.reload();
      } else {
        alert("Error creating phonology: " + error.message);
      }
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-x-4 mb-4">
        <div className="flex-1 max-w-[200px]"><ReturnComponent id={conlangId}/></div>
        <h1 className="text-2xl font-bold text-center">
          Edit Phonology
        </h1>
      </div>
      {loadingAuthor ? (
        <></>
      ) : !isEditable ? (
        <div className="mb-4 text-red-600 font-semibold">
          {`You do not have permission to edit this conlang's phonology.`}
        </div>
      ) : null}
      {!loadingPhonology && !phonologyExists && (
        <div className="mb-4 text-yellow-600 font-semibold">
          No phonology has been created for this language yet.
        </div>
      )}
      <div className="mb-2 text-gray-600">
        Conlang ID: <span className="font-mono">{conlangId}</span>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2 text-3xl">Phonemes</h2>
        {isEditable && (
          <span>
            Click phonemes to add them. They should become green.
            <br /> Green phonemes mean that they are part of the phonology.
          </span>
        )}
        <IPAChart
          phonemes={phonemes}
          onToggle={isEditable ? setPhonemes : () => {}}
        />
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
            onChange={(e) =>
              setNewAllophone({ ...newAllophone, phoneme: e.target.value })
            }
            disabled={!isEditable}
          >
            <option value="">Phoneme</option>
            {phonemes.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-2"
            type="text"
            placeholder="Allophone (IPA)"
            value={newAllophone.value}
            onChange={(e) =>
              setNewAllophone({ ...newAllophone, value: e.target.value })
            }
            disabled={!isEditable}
          />
          <button
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            onClick={handleAddAllophone}
            disabled={!isEditable}
          >
            Add allophone
          </button>
        </div>
        <div className="mt-6">
          <h3 className="font-bold mb-2">Blends</h3>
          <div className="border rounded p-2 bg-gray-50">
            (Add blends functionality here)
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-3xl">
          Phonotactics and details
        </label>
        <textarea
          className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none"
          rows={4}
          value={phonotactics}
          onChange={(e) => setPhonotactics(e.target.value)}
          placeholder="Describe phonotactic rules, phonological processes, etc."
          disabled={!isEditable}
        />
      </div>
      {isEditable && (
        <button
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save phonology"}
        </button>
      )}
    </div>
  );
}
