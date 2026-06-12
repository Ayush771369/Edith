import type { ApiRepositoryMap, TreeNode } from "../components/RepositoryExplorer/types";

/**
 * Strips the leading repository prefix from a file path.
 * e.g. "repositories/Krishna-AI/backend/app.py" → "backend/app.py"
 */
function stripRepoPrefix(filePath: string, repoName: string): string {
  const prefix = `repositories/${repoName}/`;
  return filePath.startsWith(prefix) ? filePath.slice(prefix.length) : filePath;
}

/**
 * Splits a cleaned path into folder segments + filename.
 * e.g. "backend/app.py" → ["backend", "app.py"]
 */
function splitPath(cleanPath: string): string[] {
  return cleanPath.split("/").filter((segment) => segment.length > 0);
}

/**
 * Inserts a file node (and any intermediate folder nodes) into the tree.
 * Uses a Map to deduplicate folder nodes across multiple file paths.
 */
function insertFile(
  roots: Map<string, TreeNode>,
  segments: string[],
  fileNode: TreeNode
): void {
  if (segments.length === 1) {
    // File lives at the root level
    roots.set(fileNode.id, fileNode);
    return;
  }

  const [folderName, ...rest] = segments;
  const folderId = folderName;

  if (!roots.has(folderId)) {
    roots.set(folderId, {
      id: folderId,
      type: "folder",
      label: folderName,
      children: [],
    });
  }

  const folderNode = roots.get(folderId)!;
  insertFileIntoFolder(folderNode, rest, fileNode, folderId);
}

/**
 * Recursively descends through folder nodes, creating intermediate folders
 * as needed, and places the file node at the correct depth.
 */
function insertFileIntoFolder(
  parentFolder: TreeNode,
  remainingSegments: string[],
  fileNode: TreeNode,
  parentId: string
): void {
  if (remainingSegments.length === 1) {
    parentFolder.children.push(fileNode);
    return;
  }

  const [folderName, ...rest] = remainingSegments;
  const folderId = `${parentId}/${folderName}`;

  let childFolder = parentFolder.children.find(
    (child): child is TreeNode =>
      child.type === "folder" && child.id === folderId
  );

  if (!childFolder) {
    childFolder = {
      id: folderId,
      type: "folder",
      label: folderName,
      children: [],
    };
    parentFolder.children.push(childFolder);
  }

  insertFileIntoFolder(childFolder, rest, fileNode, folderId);
}

/**
 * Transforms an API repository map response into a nested TreeNode array.
 * Folders are deduplicated. Entity IDs include the file path to prevent
 * collisions when multiple files define identically named symbols.
 */
export function buildTree(data: ApiRepositoryMap): TreeNode[] {
  const roots = new Map<string, TreeNode>();

  for (const file of data.files) {
    const cleanPath = stripRepoPrefix(file.path, data.repository_name);
    const segments = splitPath(cleanPath);

    if (segments.length === 0) continue;

    const fileName = segments[segments.length - 1];
    const fileId = cleanPath;

    const entityNodes: TreeNode[] = file.entities.map((entity) => ({
      id: `${fileId}::${entity.name}`,
      type: "entity" as const,
      label: entity.name,
      entityType: entity.type,
      children: [],
    }));

    const fileNode: TreeNode = {
      id: fileId,
      type: "file",
      label: fileName,
      language: file.language,
      children: entityNodes,
    };

    insertFile(roots, segments, fileNode);
  }

  return Array.from(roots.values());
}
