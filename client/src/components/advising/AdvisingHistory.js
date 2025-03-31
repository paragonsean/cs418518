"use client";

import { useState, useEffect } from "react";
import { fetchAdvisingRecordsByEmail } from "@/utils/advisingActions";
import AdvisingCard from "./AdvisingCard.js";

const AdvisingHistory = ({ email }) => {
  const [advisingRecords, setAdvisingRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // ✅ Fetch Advising Records
  useEffect(() => {
    if (email) {
      fetchAdvisingRecordsByEmail(email)
        .then((records) => {
          setAdvisingRecords(records || []);
        })
        .catch((error) => console.error("Error fetching advising records:", error));
    }
  }, [email]);

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-lg font-bold mb-4">Course Advising History</h2>
      
      {advisingRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advisingRecords.map((record) => (
            <AdvisingCard
              key={record.id}
              record={record}
              isSelected={selectedRecord?.id === record.id}
              onSelect={setSelectedRecord}
            />
          ))}
        </div>
      ) : (
        <p>No advising records found.</p>
      )}
    </div>
  );
};

export default AdvisingHistory;
