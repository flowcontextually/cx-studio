"use client";

import React, { useMemo } from "react";
import { Loader, Text } from "@mantine/core";
import JsonOutput from "./renderers/JsonOutput";
import TableOutput from "./renderers/TableOutput";
import TreeOutput, { TreeOutputNode } from "./renderers/TreeOutput";
import { Command } from "@/shared/types/commands";
import {
  InboundMessage,
  ErrorPayload,
  DataPayload,
} from "@/shared/types/server";

interface OutputViewerProps {
  result: InboundMessage | null;
  status: "running" | "success" | "error";
  executable?: Command | null;
  options?: Record<string, unknown> | null;
}

export default function OutputViewer({
  result,
  status,
  executable,
  options,
}: OutputViewerProps) {
  // --- Memoized Data Processing Hook ---
  // This hook processes the raw result and returns the final data to be rendered.
  // It is called at the top level, satisfying the Rules of Hooks.
  const dataToRender = useMemo(() => {
    if (
      status !== "success" ||
      !result ||
      result.payload === null ||
      result.payload === undefined
    ) {
      return null;
    }

    let processedData = result.payload as DataPayload | DataPayload[];
    const isListCommand =
      executable?.subcommand === "list" ||
      executable?.command === "connections";

    if (
      !isListCommand &&
      typeof processedData === "object" &&
      processedData !== null &&
      !Array.isArray(processedData)
    ) {
      if ("result" in processedData)
        processedData = (processedData as { result: DataPayload }).result;
      if (
        processedData &&
        typeof processedData === "object" &&
        "data" in processedData
      ) {
        processedData = (processedData as { data: DataPayload }).data;
      }
    }
    return processedData;
  }, [result, status, executable]);

  // --- Memoized Tree Transformation Hook ---
  const transformedTreeData = useMemo(() => {
    const isConnectionList =
      (executable?.command === "connection" ||
        executable?.command === "connections") &&
      executable?.subcommand === "list";
    if (isConnectionList && Array.isArray(dataToRender)) {
      const connectionsByNamespace = (
        dataToRender as Record<string, string>[]
      ).reduce((acc, conn) => {
        const blueprintId: string =
          conn["Blueprint ID"] || "unknown/unknown@0.0.0";
        let namespace = blueprintId.split("/")[0].split(":")[0];
        if (!namespace || namespace === "catalog") namespace = "system";
        if (!acc[namespace]) acc[namespace] = [];

        acc[namespace].push({
          key: conn.ID || conn.Name,
          title: conn.Name,
          isLeaf: true,
          nodeType: "connection",
          metadata: { ID: conn.ID, "Blueprint ID": conn["Blueprint ID"] },
        });
        return acc;
      }, {} as Record<string, TreeOutputNode[]>);

      return Object.keys(connectionsByNamespace)
        .sort()
        .map(
          (namespace): TreeOutputNode => ({
            key: `namespace:${namespace}`,
            title: namespace.charAt(0).toUpperCase() + namespace.slice(1),
            isLeaf: false,
            nodeType: "namespace",
            children: connectionsByNamespace[namespace].sort((a, b) =>
              String(a.title).localeCompare(String(b.title))
            ),
          })
        );
    }
    return null;
  }, [dataToRender, executable]);

  // --- Render Logic ---
  if (status === "running") {
    return <Loader size="xs" />;
  }
  if (status === "error") {
    const errorPayload = result?.payload as ErrorPayload;
    return (
      <Text c="red">{errorPayload?.error || "An unknown error occurred."}</Text>
    );
  }
  if (dataToRender === null || dataToRender === undefined) {
    return (
      <Text c="dimmed">Command executed successfully with no data output.</Text>
    );
  }

  if (transformedTreeData) {
    return <TreeOutput data={transformedTreeData} title="Local Connections" />;
  }

  const isListOfDicts =
    Array.isArray(dataToRender) &&
    dataToRender.length > 0 &&
    typeof dataToRender[0] === "object" &&
    dataToRender[0] !== null;
  const isListCommand =
    executable?.subcommand === "list" || executable?.command === "connections";

  if ((isListCommand || options?.output_mode === "table") && isListOfDicts) {
    return <TableOutput data={dataToRender} />;
  }

  if (typeof dataToRender === "object") {
    return <JsonOutput data={dataToRender} />;
  }

  return <Text>{String(dataToRender)}</Text>;
}
