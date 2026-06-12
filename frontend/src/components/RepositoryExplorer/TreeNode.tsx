import React, { useCallback, useState } from "react";
import { EntityIcon } from "./EntityIcon";
import type { TreeNodeProps } from "./types";

const INDENT_PX = 16;

export function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
}: TreeNodeProps): React.ReactElement {
  const isExpandable = node.type === "folder" || node.type === "file";
  const [expanded, setExpanded] = useState<boolean>(
    node.type === "folder" // folders open by default, files collapsed
  );

  const isSelected = selectedId === node.id;
  const hasChildren = node.children.length > 0;

  const handleToggle = useCallback(() => {
    if (isExpandable && hasChildren) {
      setExpanded((prev) => !prev);
    }
  }, [isExpandable, hasChildren]);

  const handleSelect = useCallback(() => {
    if (node.type === "entity") {
      onSelect(node.id);
    } else {
      handleToggle();
    }
  }, [node.type, node.id, onSelect, handleToggle]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    },
    [handleSelect]
  );

  const indentStyle: React.CSSProperties = {
    paddingLeft: `${depth * INDENT_PX}px`,
  };

  const rowClassName = [
    "edith-tree-row",
    `edith-tree-row--${node.type}`,
    isSelected ? "edith-tree-row--selected" : "",
    isExpandable && !hasChildren ? "edith-tree-row--empty" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li className="edith-tree-item" role="treeitem" aria-expanded={isExpandable ? expanded : undefined}>
      <div
        className={rowClassName}
        style={indentStyle}
        onClick={handleSelect}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isSelected}
        aria-label={`${node.type} ${node.label}`}
      >
        {isExpandable && hasChildren && (
          <span
            className={`edith-tree-chevron ${expanded ? "edith-tree-chevron--open" : ""}`}
            aria-hidden="true"
          >
            <svg viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 1.5l3 2.5-3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}

        {(!isExpandable || !hasChildren) && (
          <span className="edith-tree-chevron edith-tree-chevron--spacer" aria-hidden="true" />
        )}

        <EntityIcon
          nodeType={node.type}
          entityType={node.entityType}
          isExpanded={expanded}
        />

        <span className="edith-tree-label">{node.label}</span>

        {node.type === "entity" && node.entityType && (
          <span className={`edith-tree-badge edith-tree-badge--${node.entityType}`}>
            {node.entityType === "class" ? "class" : "fn"}
          </span>
        )}

        {node.type === "file" && node.language && (
          <span className="edith-tree-badge edith-tree-badge--lang">
            {node.language}
          </span>
        )}
      </div>

      {isExpandable && hasChildren && expanded && (
        <ul className="edith-tree-children" role="group">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
