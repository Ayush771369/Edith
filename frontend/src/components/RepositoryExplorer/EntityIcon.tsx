import React from "react";
import type { EntityType, TreeNodeType } from "./types";

interface EntityIconProps {
  nodeType: TreeNodeType;
  entityType?: EntityType;
  isExpanded?: boolean;
}

export function EntityIcon({
  nodeType,
  entityType,
  isExpanded,
}: EntityIconProps): React.ReactElement {
  if (nodeType === "folder") {
    return (
      <svg
        className="edith-tree-icon edith-tree-icon--folder"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {isExpanded ? (
          <path
            d="M1 4.5A1.5 1.5 0 012.5 3h3.172a1.5 1.5 0 011.06.44l.829.828A1.5 1.5 0 008.62 4.75H13.5A1.5 1.5 0 0115 6.25v6.25A1.5 1.5 0 0113.5 14h-11A1.5 1.5 0 011 12.5V4.5z"
            fill="currentColor"
          />
        ) : (
          <>
            <path
              d="M1 4.5A1.5 1.5 0 012.5 3h3.172a1.5 1.5 0 011.06.44l.829.828A1.5 1.5 0 008.62 4.75H13.5A1.5 1.5 0 0115 6.25V7H1V4.5z"
              fill="currentColor"
              opacity="0.6"
            />
            <path
              d="M1 7h14v5.5A1.5 1.5 0 0113.5 14h-11A1.5 1.5 0 011 12.5V7z"
              fill="currentColor"
            />
          </>
        )}
      </svg>
    );
  }

  if (nodeType === "file") {
    return (
      <svg
        className="edith-tree-icon edith-tree-icon--file"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 1.5A1.5 1.5 0 015.5 0h4.672a1.5 1.5 0 011.06.44l2.829 2.828A1.5 1.5 0 0114.5 4.33V14.5A1.5 1.5 0 0113 16H5.5A1.5 1.5 0 014 14.5V1.5z"
          fill="currentColor"
          opacity="0.15"
        />
        <path
          d="M4 1.5A1.5 1.5 0 015.5 0h4.672a1.5 1.5 0 011.06.44l2.829 2.828A1.5 1.5 0 0114.5 4.33V14.5A1.5 1.5 0 0113 16H5.5A1.5 1.5 0 014 14.5V1.5z"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M10 0v3.5A1.5 1.5 0 0011.5 5H15"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  // entity node
  if (entityType === "class") {
    return (
      <svg
        className="edith-tree-icon edith-tree-icon--class"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect x="1" y="1" width="14" height="14" rx="2" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
        <text x="8" y="11.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="monospace">C</text>
      </svg>
    );
  }

  // function
  return (
    <svg
      className="edith-tree-icon edith-tree-icon--function"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="14" height="14" rx="7" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
      <text x="8" y="11.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="currentColor" fontFamily="monospace">ƒ</text>
    </svg>
  );
}
