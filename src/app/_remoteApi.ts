const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

/**
 * Mocks syncing local data to a remote server
 * This is for when we already have a stable local API and want to extend for remote syncing.
 */
export const remoteApi = {
    async syncTasks(tasks: any[]): Promise<{ success: boolean; message: string }> {
        console.log('Syncing tasks to remote server...', tasks);
        await sleep(1500); // Simulate network latency

        // Simulate a successful sync
        return { success: true, message: 'Sync complete' };

        // Simulate a failed sync
        // return { success: false, message: "Network error" };
    },
};
