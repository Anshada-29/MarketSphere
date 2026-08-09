"use client";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import Papa from "papaparse";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  CheckCircle2,
  FileSpreadsheet,
  UploadCloud,
  X,
} from "lucide-react";

type CustomerRow = {
  [key: string]: string;
};

const requiredColumns = [
  "Customer ID",
  "Purchase Amount",
  "Purchase Frequency",
  "Last Purchase Date",
];

export default function UploadPage() {
  const router = useRouter();
  
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");
    setRows([]);
    setColumns([]);

    if (!selectedFile.name.toLowerCase().endsWith(".csv")) {
      setError("For this step, please upload a CSV file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10 MB.");
      return;
    }

    setFile(selectedFile);
    setIsUploading(true);

    Papa.parse<CustomerRow>(selectedFile, {
      header: true,
      skipEmptyLines: true,
      preview: 5,
      complete: (result) => {
        const parsedRows = result.data.filter((row) =>
          Object.values(row).some((value) => value?.trim())
        );

        const parsedColumns = parsedRows.length
          ? Object.keys(parsedRows[0])
          : [];

        setRows(parsedRows);
        setColumns(parsedColumns);
        setIsUploading(false);

        if (!parsedColumns.length) {
          setError("This file does not contain readable data.");
        }
      },
      error: () => {
        setError("We could not read this file. Please check the CSV format.");
        setIsUploading(false);
      },
    });
  }

  function removeFile() {
    setFile(null);
    setRows([]);
    setColumns([]);
    setError("");
  }

  const missingColumns = requiredColumns.filter(
    (column) => !columns.some((item) => item.toLowerCase() === column.toLowerCase())
  );

  const isValid = file && rows.length > 0 && missingColumns.length === 0;

    async function uploadToBackend() {
    if (!file || !isValid) return;

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch( `${API_URL}/customers/upload`, {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          typeof data.detail === "string"
            ? data.detail
            : data.detail?.message || "Upload failed.";

        throw new Error(errorMessage);
      }

      router.push("/segments");
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Could not connect to the MarketSphere API."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to overview
        </Link>

        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold text-indigo-600">
            Data workspace
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            Upload customer data
          </h1>
          <p className="mt-2 text-slate-500">
            Review your data before MarketSphere creates customer segments.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          {!file && (
            <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 p-10 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <UploadCloud size={30} />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                Upload your customer CSV
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Your file should contain customer and purchase information.
              </p>

              <label className="mt-6 inline-flex cursor-pointer rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
                Choose CSV file
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <p className="mt-4 text-xs text-slate-400">
                CSV only · Maximum size: 10 MB
              </p>
            </div>
          )}

          {file && (
            <>
              <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
                    <FileSpreadsheet size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  onClick={removeFile}
                  className="flex items-center gap-2 self-start text-sm font-medium text-red-500 hover:text-red-600 md:self-auto"
                >
                  <X size={16} />
                  Remove file
                </button>
              </div>

              {isUploading && (
                <p className="py-8 text-center text-sm text-slate-500">
                  Uploading your customer data...
                </p>
              )}

              {!isUploading && rows.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">Data preview</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Showing the first {rows.length} rows.
                      </p>
                    </div>

                    {missingColumns.length === 0 ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                        <CheckCircle2 size={17} />
                        Data looks good
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-amber-600">
                        Review required columns
                      </span>
                    )}
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          {columns.map((column) => (
                            <th key={column} className="whitespace-nowrap px-4 py-3">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-50">
                            {columns.map((column) => (
                              <td
                                key={`${rowIndex}-${column}`}
                                className="whitespace-nowrap px-4 py-3 text-slate-600"
                              >
                                {row[column] || "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {missingColumns.length > 0 && (
                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-800">
                        Missing recommended columns
                      </p>
                      <p className="mt-1 text-sm text-amber-700">
                        Add these columns before continuing:{" "}
                        {missingColumns.join(", ")}
                      </p>
                    </div>
                  )}

                 <button
  type="button"
  onClick={uploadToBackend}
  disabled={!isValid || isUploading}
  className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
>
  {isUploading ? "Uploading customer data..." : "Continue to segmentation"}
</button>
                </div>
              )}
            </>
          )}

          {(error || uploadError) && (
  <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    {error || uploadError}
  </div>
)}
        </section>
      </div>
    </main>
  );
}