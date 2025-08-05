export async function initMocks() {
  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV === "development") {
      const { createWorker } = await import("@/app/mocks/browser");
      const worker = createWorker();
      await worker.start();
    }
  }
}
