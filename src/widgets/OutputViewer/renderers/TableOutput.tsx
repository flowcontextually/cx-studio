"use client";

import React, { useMemo } from "react";
import { DataTable } from "mantine-datatable";
import { nanoid } from "nanoid"; // We'll use this for unique keys

interface TableOutputProps {
  data: Record<string, any>[];
}

export default function TableOutput({ data }: TableOutputProps) {
  // --- THIS IS THE FIX ---
  // 1. We add a unique `id` to each record for React's key prop.
  // 2. We handle the "no records" text explicitly.
  const recordsWithIds = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    // Mantine DataTable uses the 'id' property by default for keys.
    // Let's ensure every record has one. We'll try to use a real ID
    // field if it exists, otherwise we generate one with nanoid.
    return data.map((record) => ({
      ...record,
      id: record.id || record.ID || record.Id || nanoid(),
    }));
  }, [data]);

  const columns = useMemo(() => {
    if (!recordsWithIds || recordsWithIds.length === 0) return [];
    const allKeys = new Set<string>();
    recordsWithIds.forEach((row) => {
      // We don't want to show our internal 'id' column if we generated it
      Object.keys(row).forEach((key) => {
        if (key !== "id" || "id" in data[0] || "ID" in data[0]) {
          allKeys.add(key);
        }
      });
    });

    return Array.from(allKeys).map((key) => ({
      accessor: key,
      title: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      render: (record: Record<string, any>) => {
        const value = record[key];
        if (typeof value === "object" && value !== null)
          return JSON.stringify(value);
        return String(value ?? "");
      },
    }));
  }, [recordsWithIds, data]);

  // 2. Explicitly handle the "no records" state.
  if (recordsWithIds.length === 0) {
    return <p>No records to display.</p>;
  }

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      withColumnBorders
      striped
      highlightOnHover
      records={recordsWithIds}
      columns={columns}
      // 3. Tell the table how to find our unique key.
      //   recordIdAccessor="id"
      // 4. Provide a custom message for when there's no data to display.
      noRecordsText="No records to display"
    />
  );
}
