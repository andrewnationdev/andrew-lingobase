"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase/database";
import { Button } from "./button";

const CSV_FIELDS = [
  "lexical_item",
  "definition",
  "pos",
  "notes",
  "transliteration",
  "conlang_code",
  "owner",
];

function arrayToCSV(arr: string[]) {
  if (!arr.length) return "";
  const header = CSV_FIELDS.join(",");
  const rows = arr.map((obj) =>
    CSV_FIELDS.map(
      (f) => '"' + (obj[f]?.replaceAll('"', '""') || "") + '"'
    ).join(",")
  );
  return [header, ...rows].join("\n");
}

function csvToArray(csv: string) {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((h) => h.replace(/^"|"$/g, ""));
  return lines.map((line) => {
    const values =
      line
        .match(/("[^"]*("{2})*[^"]*"|[^,]*)/g)
        ?.map((v) => v.replace(/^"|"$/g, "").replace(/""/g, '"')) || [];
    const obj = {};
    headers.forEach((h, i) => (obj[h] = values[i] || ""));
    return obj;
  });
}

export interface IWordData {
  lexical_item: string;
  definition: string;
  pos: string;
  notes: string;
  transliteration: string;
  conlang_code: string;
  owner: string;
}

export default function WordImport({
  langCode,
  owner,
}: {
  langCode: string;
  owner: string;
}) {
  const [mode, setMode] = useState<"none" | "import" | "export">("none");
  const [csv, setCsv] = useState("");
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  async function handleExport() {
    setLoading(true);
    setImportResult(null);
    const { data, error } = await supabase
      .from("conlang-dictionary")
      .select("*")
      .eq("conlang_code", langCode)
      .eq("owner", owner);
    if (error) {
      setCsv("");
      setImportResult("Error exporting: " + error.message);
    } else {
      setCsv(arrayToCSV(data || []));
    }
    setLoading(false);
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setImportResult(null);
    try {
      const arr = csvToArray(csv).map((obj) => ({
        ...obj,
        conlang_code: langCode,
        owner,
      }));
      const filtered = arr.filter((w: IWordData) => w?.lexical_item && w?.definition);
      if (!filtered.length) throw new Error("No valid data to import.");
      const { error } = await supabase
        .from("conlang-dictionary")
        .insert(filtered);
      if (error) setImportResult("Error importing: " + error.message);
      else setImportResult("Import completed successfully!");
    } catch (err) {
      setImportResult("Error importing: " + err);
    }
    setLoading(false);
  }

  return (
    <div className="my-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={mode === "export" ? "secondary" : "outline"}
          onClick={() => {
            setMode("export");
            handleExport();
          }}
        >
          Export CSV
        </Button>
        <Button
          variant={mode === "import" ? "secondary" : "outline"}
          onClick={() => {
            setMode("import");
            setCsv("");
            setImportResult(null);
          }}
        >
          Import CSV
        </Button>
      </div>
      <span>{`The import function isn't working yet. Try the export function instead! <br/> A user manual about how to use it will be released soon!`}</span>
      {mode === "export" && (
        <div>
          <label className="block mb-2 font-medium">Copy the CSV below:</label>
          <textarea
            className="w-full h-48 p-2 border rounded bg-gray-100 text-xs"
            value={csv}
            readOnly
          />
          {importResult && (
            <div className="text-red-500 mt-2">{importResult}</div>
          )}
        </div>
      )}
      {mode === "import" && (
        <form onSubmit={handleImport}>
          <label className="block mb-2 font-medium">
            Paste the CSV to import:
          </label>
          <textarea
            className="w-full h-48 p-2 border rounded text-xs"
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder={
              CSV_FIELDS.join(",") +
              "\nlexical_item,definition,pos,notes,transliteration,..."
            }
            required
          />
          <Button type="submit" className="mt-2" disabled={loading}>
            {loading ? "Importing..." : "Import"}
          </Button>
          {importResult && (
            <div
              className={
                importResult.startsWith("Import completed")
                  ? "text-green-600 mt-2"
                  : "text-red-500 mt-2"
              }
            >
              {importResult}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
