import type { CodegenConfig } from "@graphql-codegen/cli";
const config: CodegenConfig = {
  schema: "src/graphql/schema.graphql",
  documents: ["src/**/*.graphql"],
  generates: {
    "src/graphql/generated/graphql.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: {
          func: "@/app/shared/lib/fetcher#fetchData",
          isReactHook: false,
        },
        exposeQueryKeys: true,
        exposeFetcher: true,
        addInfiniteQuery: true,
        reactQueryVersion: 5,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;
