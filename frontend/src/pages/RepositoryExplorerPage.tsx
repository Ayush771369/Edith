import { useAppStore } from "@/contexts/store";
import { RepositoryExplorer } from "@/components/RepositoryExplorer";

export const RepositoryExplorerPage = () => {
  const currentRepository = useAppStore(
    (s) => s.currentRepository
  );

  if (!currentRepository) {
    return <div>No repository selected</div>;
  }

  return (
    <RepositoryExplorer
      repositoryId={currentRepository.repository_id}
      apiBaseUrl="http://localhost:8000"
    />
  );
};