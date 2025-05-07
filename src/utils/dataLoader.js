// File: src/utils/dataLoader.js
import Papa from "papaparse";

// Helper to parse basic XML format
const parseXML = (xmlText) => {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "application/xml");
  const entries = [...xml.querySelectorAll("entry")];

  return entries.map((entry) => {
    const obj = {};
    entry.childNodes.forEach((node) => {
      if (node.nodeType === 1) {
        obj[node.nodeName] = node.textContent;
      }
    });
    return obj;
  });
};

// Universal loader for supported formats
export async function loadData(filename) {
  if (!filename) throw new Error("Filename is required");

  const ext = filename.split(".").pop().toLowerCase();
  const res = await fetch(`/${filename}`);
  if (!res.ok) throw new Error(`Failed to load file: ${filename}`);

  const raw = await res.text();

  if (ext === "json") return JSON.parse(raw);
  if (ext === "csv") return Papa.parse(raw, { header: true, skipEmptyLines: true }).data;
  if (ext === "xml") return parseXML(raw);

  throw new Error("Unsupported file format");
}
