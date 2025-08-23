"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/database";
import ReturnComponent from "@/components/ui/return";
import { InfoIcon, XIcon } from "lucide-react";

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
  // 0 Bilabial
  ["p", "b"],
  // 1 Labiodental (no standard plosives)
  [null, null],
  // 2 Dental (using diacritics)
  ["t̪", "d̪"],
  // 3 Alveolar
  ["t", "d"],
  // 4 Postalveolar (none)
  [null, null],
  // 5 Palato-alveolar (none for plosives)
  [null, null],
  // 6 Retroflex
  ["ʈ", "ɖ"],
  // 7 Palatal
  ["c", "ɟ"],
  // 8 Velar
  ["k", "g"],
  // 9 Uvular
  ["q", "ɢ"],
  // 10 Pharyngeal (none)
  [null, null],
  // 11 Glottal
  ["ʔ", null],
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
        <div
          className="overflow-x-auto my-3 md:my-4 w-full max-w-[100vw] overscroll-x-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <table
            className="border mx-auto text-xs sm:text-sm md:text-base min-w-[380px] sm:min-w-[500px] md:min-w-[600px]"
            style={{ fontSize: "16px" }}
          >
            <thead>
              <tr>
                <th className="border px-1 py-1 md:px-2 md:py-1 whitespace-nowrap"></th>
                {ipaConsonantHeaders.map((h) => (
                  <th
                    key={h}
                    className="border px-1 py-1 md:px-2 md:py-1 whitespace-nowrap text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ipaConsonantChart.map((row, i) => (
                <tr key={i}>
                  <td className="border px-1 py-1 md:px-2 md:py-1 font-semibold text-center">
                    {row.label}
                  </td>
                  {row.cells.map((pair, j) => (
                    <td
                      key={j}
                      className="border px-1 py-1 md:px-2 md:py-1 text-center align-middle"
                    >
                      {pair && (pair[0] || pair[1]) ? (
                        <div className="flex flex-row gap-1 items-center justify-center">
                          {pair.map((c, index) =>
                            c ? (
                              <button
                                key={index}
                                className={`rounded font-bold px-1 py-1 w-7 md:w-8 text-bold ${
                                  phonemes.includes(c)
                                    ? "bg-green-400 text-white"
                                    : "bg-grey"
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
        <div
          className="overflow-x-auto my-3 md:my-4 w-full max-w-[100vw] overscroll-x-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <table
            className="border mx-auto text-xs sm:text-sm md:text-base min-w-[380px] sm:min-w-[500px] md:min-w-[600px]"
            style={{ fontSize: "16px" }}
          >
            <thead>
              <tr>
                <th className="border px-1 py-1 md:px-2 md:py-1 whitespace-nowrap"></th>
                {ipaVowelHeaders.map((h) => (
                  <th
                    key={h}
                    className="border px-1 py-1 md:px-2 md:py-1 whitespace-nowrap text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ipaVowelChart.map((row, i) => (
                <tr key={i}>
                  <td className="border px-1 py-1 md:px-2 md:py-1 font-semibold text-center">
                    {row.label}
                  </td>
                  {row.cells.map((cell, j) => (
                    <td
                      key={j}
                      className="border px-1 py-1 md:px-2 md:py-1 text-center align-middle"
                    >
                      {cell && cell.length > 0 ? (
                        <div className="flex flex-row gap-1 items-center justify-center flex-wrap">
                          {cell.map((v, idx) => (
                            <button
                              key={idx}
                              className={`font-bold rounded px-1 md:px-2 py-1 w-7 md:w-8 ${
                                phonemes.includes(v)
                                  ? "bg-green-400 text-white"
                                  : "bg-grey"
                              }`}
                              style={{ fontSize: "16px" }}
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

  const handleDeleteAllophone = (phoneme: string, allophone: string) => {
    if (!isEditable) return;
    const updatedAllophones = { ...allophones };
    if (updatedAllophones[phoneme]) {
      updatedAllophones[phoneme] = updatedAllophones[phoneme].filter(
        (a) => a !== allophone
      );
      // If no allophones left for this phoneme, remove the phoneme key
      if (updatedAllophones[phoneme].length === 0) {
        delete updatedAllophones[phoneme];
      }
    }
    setAllophones(updatedAllophones);
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
    <div className="mx-auto px-6 py-6 md:py-8 my-4 md:my-0 flex flex-col gap-6 w-full max-w-full md:max-w-4xl overflow-x-hidden">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-2">
        <div className="w-full md:w-auto">
          <ReturnComponent id={conlangId} />
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-center md:text-left w-full">
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
      <div className="mb-2 text-gray-600 text-center md:text-left">
        Conlang ID: <span className="font-mono break-all">{conlangId}</span>
      </div>
      <div className="mb-6">
        <h2 className="font-semibold mb-2 text-3xl">Phonemes</h2>
        {isEditable && (
          <div className="bg-green-100 border border-green-300 text-sm p-3 px-5 rounded-md text-green-800 flex gap-8 items-center">
            <InfoIcon size="16" strokeWidth={2} />
            Click phonemes to add them. They should become green.
            <br /> Green phonemes mean that they are part of the phonology.
          </div>
        )}
        <IPAChart
          phonemes={phonemes}
          onToggle={isEditable ? setPhonemes : () => {}}
        />
      </div>
      <div className="mb-6">
        <hr className="my-4" />
        <h2 className="text-3xl font-semibold">Allophones</h2>
        <ul className="my-4">
          {phonemes.map((p) => (
            <li key={p} className="mb-3">
              {allophones[p] && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center">
                    <span className="font-mono text-lg">{p}</span>
                    <span className="ml-2 text-sm text-gray-600">
                      Allophones:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 ml-4">
                    {allophones[p].map((allophone, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md"
                      >
                        <span className="font-mono text-sm">{allophone}</span>
                        {isEditable && (
                          <button
                            onClick={() => handleDeleteAllophone(p, allophone)}
                            className="text-red-500 hover:text-red-700 ml-1"
                            title="Delete allophone"
                          >
                            <XIcon size="14" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <select
            className="block w-full sm:w-[140px] rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
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
            className="block w-full sm:w-[200px] rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-cyan-600 focus:ring-cyan-600 sm:text-sm p-2 bg-white dark:bg-gray-700 dark:text-gray-200"
            type="text"
            placeholder="Allophone (IPA)"
            value={newAllophone.value}
            onChange={(e) =>
              setNewAllophone({ ...newAllophone, value: e.target.value })
            }
            disabled={!isEditable}
          />
        </div>
        {isEditable && (
          <button
            className="w-full sm:w-[180px] my-4 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
            onClick={handleAddAllophone}
          >
            Add allophone
          </button>
        )}
        <hr className="my-4" />
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-2xl md:text-3xl">
          Phonotactics and details
        </label>
        <textarea
          className="w-full h-48 md:h-80 p-3 md:p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 resize-none"
          rows={4}
          value={phonotactics}
          onChange={(e) => setPhonotactics(e.target.value)}
          placeholder="Describe phonotactic rules, phonological processes, etc."
          disabled={!isEditable}
        />
      </div>
      {isEditable && (
        <button
          className="w-full sm:w-[220px] flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save phonology"}
        </button>
      )}
    </div>
  );
}
