import React, { useCallback, useEffect, useState } from "react";
import { TreeNode } from "./TreeNode";
import { buildTree } from "../../utils/treeUtils";
import type {
  ApiRepositoryMap,
  RepositoryExplorerProps,
  TreeNode as TreeNodeType,
} from "./types.ts";
import "./RepositoryExplorer.css";

type Status = "idle" | "loading" | "error" | "success";

export function RepositoryExplorer({
  repositoryId,
  apiBaseUrl,
}: RepositoryExplorerProps): React.ReactElement {
  const [status, setStatus] = useState<Status>("idle");
  const [repoName, setRepoName] = useState<string>("");
  const [tree, setTree] = useState<TreeNodeType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchRepository = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `${apiBaseUrl}/repositories/map/${repositoryId}`
      );

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(
          text || `Request failed with status ${response.status}`
        );
      }

      const data: ApiRepositoryMap = await response.json();

      if (!data.files || data.files.length === 0) {
        setRepoName(data.repository_name);
        setTree([]);
        setStatus("success");
        return;
      }

      const builtTree = buildTree(data);
      setRepoName(data.repository_name);
      setTree(builtTree);
      setStatus("success");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setStatus("error");
    }
  }, [repositoryId, apiBaseUrl]);

  useEffect(() => {
    fetchRepository();
  }, [fetchRepository]);

  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  if (status === "loading") {
    return (
      <div className="edith-explorer edith-explorer--loading" role="status" aria-label="Loading repository">
        <div className="edith-loader">
          <span className="edith-loader__bar" />
          <span className="edith-loader__bar" />
          <span className="edith-loader__bar" />
        </div>
        <p className="edith-state-label">Loading repository…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="edith-explorer edith-explorer--error" role="alert">
        <svg className="edith-state-icon edith-state-icon--error" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 7v5M12 16.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="edith-state-label">Failed to load repository</p>
        <p className="edith-state-detail">{errorMessage}</p>
        <button className="edith-retry-btn" onClick={fetchRepository}>
          Retry
        </button>
      </div>
    );
  }

  if (status === "success" && tree.length === 0) {
    return (
      <div className="edith-explorer edith-explorer--empty">
        <svg className="edith-state-icon edith-state-icon--empty" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M3 7.5A2.5 2.5 0 015.5 5h4.086a2.5 2.5 0 011.768.732l1.414 1.414A2.5 2.5 0 0014.5 7.5H18.5A2.5 2.5 0 0121 10v7a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 17V7.5z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <p className="edith-state-label">No files found</p>
        <p className="edith-state-detail">
          {repoName
            ? `${repoName} has no indexed files yet.`
            : "This repository has no indexed files yet."}
        </p>
      </div>
    );
  }

  return (
    <nav className="edith-explorer" aria-label={`Repository: ${repoName}`}>
      <div className="edith-explorer__header">
        <svg className="edith-explorer__repo-icon" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M2 2.5A2.5 2.5 0 014.5 0h7A2.5 2.5 0 0114 2.5v11a2.5 2.5 0 01-2.5 2.5h-7A2.5 2.5 0 012 13.5v-11z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 4h6M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="edith-explorer__repo-name">{repoName}</span>
      </div>

      <ul className="edith-tree" role="tree" aria-label={repoName}>
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        ))}
      </ul>
    </nav>
  );
}
