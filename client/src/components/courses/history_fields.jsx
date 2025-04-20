"use client";
import React from "react";
import { Input } from "@/components/ui/input";

/**
 * A reusable component that renders:
 *  - "Last Term" select
 *  - "Last GPA" input
 *  - "Current Term" select
 * 
 * Props:
 *  availableTerms: string[] – e.g. ["Spring 2024", "Summer 2024", ...]
 *  history: { lastTerm: string, lastGPA: string, currentTerm: string }
 *  setHistory: (newHistory: object) => void
 */
export default function HistoryFields({ availableTerms, history, setHistory }) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      {/* Last Term Dropdown */}
      <select
        className="border p-2 rounded-md"
        value={history.lastTerm}
        onChange={(e) => setHistory({ ...history, lastTerm: e.target.value })}
        required
      >
        <option value="" disabled>
          Select Last Term
        </option>
        {availableTerms.map((term) => (
          <option key={`last-${term}`} value={term}>
            {term}
          </option>
        ))}
      </select>

      {/* Last GPA */}
      <Input
        type="number"
        step="0.01"
        placeholder="Last GPA"
        value={history.lastGPA}
        onChange={(e) => setHistory({ ...history, lastGPA: e.target.value })}
        required
      />

      {/* Current Term Dropdown */}
      <select
        className="border p-2 rounded-md"
        value={history.currentTerm}
        onChange={(e) => setHistory({ ...history, currentTerm: e.target.value })}
        required
      >
        <option value="" disabled>
          Select Current Term
        </option>
        {availableTerms.map((term) => (
          <option key={`current-${term}`} value={term}>
            {term}
          </option>
        ))}
      </select>
    </div>
  );
}