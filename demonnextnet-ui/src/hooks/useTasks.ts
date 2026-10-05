import { useCallback, useState } from 'react';
import { toggleTask as toggleTaskApi } from '@/lib/api';
import type { TaskItem } from '@/types';

export function useTasks() {
  const [error, setError] = useState<string | null>(null);

  const toggleTask = useCallback(
    async (id: number): Promise<TaskItem | null> => {
      setError(null);

      try {
        return await toggleTaskApi(id);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : `Failed to toggle task ${id}`
        );
        return null;
      }
    },
    []
  );

  return { error, toggleTask };
}
