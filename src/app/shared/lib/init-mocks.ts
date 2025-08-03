export async function initMocks() {
  if (typeof window !== "undefined") {
    if (process.env.NODE_ENV === "development") {
      const { worker } = await import("@/app/mocks/browser");
      return worker.start();
    }
  } else {
    if (process.env.NODE_ENV === "development") {
      const { server } = await import("@/app/mocks/server");
      server.listen();
    }
  }
}
