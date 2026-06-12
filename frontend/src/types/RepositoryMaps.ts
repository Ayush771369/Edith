// ─── API Response Types ───────────────────────────────────────────────────────

export type EntityType = "class" | "function";

export interface ApiEntity {
  type: EntityType;
  name: string;
}

export interface ApiFile {
  path: string;
  language: string;
  entities: ApiEntity[];
}

export interface ApiRepositoryMap {
  repository_id: number;
  repository_name: string;
  files: ApiFile[];
}

// ─── Tree Node Types ──────────────────────────────────────────────────────────

export type TreeNodeType = "folder" | "file" | "entity";

export interface TreeNode {
  id: string;
  type: TreeNodeType;
  label: string;
  entityType?: EntityType;
  language?: string;
  children: TreeNode[];
}

// ─── Component Prop Types ─────────────────────────────────────────────────────

export interface TreeNodeProps {
  node: TreeNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export interface RepositoryExplorerProps {
  repositoryId: number;
  apiBaseUrl: string;
}
