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
];

function arrayToCSV(arr: string[] | IWordData[]) {
  if (!arr.length) return "";
  const header = CSV_FIELDS.join(",");
  const rows = arr.map((obj) =>
    CSV_FIELDS.map(
      (f) => '"' + (obj[f]?.replaceAll('"', '""') || "") + '"'
    ).join(",")
  );
  return [header, ...rows].join("\n");
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
  const [jsonImport, setJsonImport] = useState(""); // Para import JSON

  async function handleExport() {
    setLoading(true);
    setImportResult(null);
    const { data, error } = await supabase
      .from("conlang-dictionary")
      .select("lexical_item,definition,pos,notes,transliteration")
      .eq("conlang_code", langCode)
      .eq("owner", owner);
    if (error) {
      setCsv("");
      setImportResult("Error exporting: " + error.message);
    } else {
      setCsv(arrayToCSV((data ?? []) as IWordData[]));
    }
    setLoading(false);
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setImportResult(null);
    try {
      let arr = [];
      try {
        arr = JSON.parse(jsonImport);
      } catch (err) {
        throw new Error("Invalid JSON: " + err);
      }
      if (!Array.isArray(arr))
        throw new Error("JSON must be an array of objects");
      const arrWithMeta = arr.map((obj) => ({
        ...obj,
        conlang_code: langCode,
        owner,
      }));
      const filtered = arrWithMeta.filter(
        (w) => w?.lexical_item && w?.definition
      );
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
            setJsonImport("");
            setImportResult(null);
          }}
        >
          Import JSON
        </Button>
      </div>
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
            Paste a JSON array:
          </label>
          <textarea
            className="w-full h-48 p-2 border rounded text-xs"
            value={jsonImport}
            onChange={(e) => setJsonImport(e.target.value)}
            placeholder={`[
              {
                "lexical_item": "",
                "definition": "",
                "pos": "",
                "notes": "",
                "transliteration": ""
              }
            ]`}
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
