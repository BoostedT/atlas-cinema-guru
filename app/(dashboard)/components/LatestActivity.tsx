"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: string | number;
  title: string;
  timestamp: string;
  activity: "FAVORITED" | "WATCH_LATER";
}

export default function LatestActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch("/api/activities?page=1")
      .then((res) => res.json())
      .then((data) => setActivities(data.activities || []))
      .catch(console.error);
  }, []);

  return (
    <ul className="space-y-3 text-sm text-[#0A0D3A]">
      {activities.length === 0 && (
        <p className="text-center opacity-70">No recent activity</p>
      )}

      {activities.map((a) => (
        <li key={a.id} className="bg-[#17b496]/70 p-3 rounded-lg shadow">
          {/* Timestamp */}
          <span className="block text-xs opacity-80">
            {new Date(a.timestamp).toLocaleString()}
          </span>

          {/* Activity description */}
          {a.activity === "FAVORITED" && (
            <span>
              Favorited <strong>{a.title}</strong>
            </span>
          )}
          {a.activity === "WATCH_LATER" && (
            <span>
              Added <strong>{a.title}</strong> to Watch Later
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
