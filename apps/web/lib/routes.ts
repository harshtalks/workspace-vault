import { createRoute } from "safe-fetchttp";
import * as z from "zod";

const ROUTES = {
  home: createRoute({
    fn: () => "/",
    paramsSchema: z.object({}),
    name: "home",
    options: {
      internal: true,
    },
  }),
  webAuthRedirect: createRoute({
    fn: () => "/get-started/authenticate",
    paramsSchema: z.object({}),
    searchParamsSchema: z.object({
      callbackMFA: z.string().url().optional(),
    }),
    name: "webAuthRedirect",
    options: {
      internal: true,
    },
  }),
  getStarted: createRoute({
    fn: () => "/get-started",
    paramsSchema: z.object({}),
    name: "getStarted",
    options: {
      internal: true,
    },
  }),
  workspaceTab: createRoute({
    fn: ({ workspaceId, tab }) => `/workspaces/${workspaceId}/${tab}`,
    paramsSchema: z.object({
      workspaceId: z.string().min(1),
      tab: z.enum(["overview", "add-new-file", "files", "settings"]),
    }),
    name: "workspaceOverview",
    options: {
      internal: true,
    },
  }),
  workspaces: createRoute({
    fn: () => "/get-started/workspaces",
    paramsSchema: z.object({}),
    name: "workspaces",
    options: {
      internal: true,
    },
  }),
};

export default ROUTES;
