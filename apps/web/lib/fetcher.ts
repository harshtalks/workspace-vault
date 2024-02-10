import * as z from "zod";
import ROUTES, { RouteBuilder, makeRoute } from "./routes";

type Empty = {};

export type EndPoint<
  Params extends z.ZodSchema,
  RequestBody extends z.ZodSchema,
  Response extends z.ZodSchema,
  SearchParams extends z.ZodSchema
> = {
  HttpMethod:
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE"
    | "PATCH"
    | "OPTIONS"
    | "HEAD"
    | "CONNECT"
    | "TRACE";
  path: RouteBuilder<Params, SearchParams>;
  params: Params;
  body?: RequestBody;
  response: Response;
};

export const BuildEndPoint = <
  Params extends z.ZodSchema,
  Body extends z.ZodSchema,
  Response extends z.ZodSchema,
  SearchParams extends z.ZodSchema
>(
  endPoint: EndPoint<Params, Body, Response, SearchParams>
) => {
  return async (
    params: z.input<Params>,
    body: z.input<Body>,
    headers?: Request["headers"]
  ) => {
    const parsedBody = endPoint.body && endPoint.body.parse(body);

    try {
      const response = await fetch(endPoint.path(params), {
        method: endPoint.HttpMethod,
        headers,
        body: JSON.stringify(parsedBody),
      });

      if (!response.ok) {
        throw new Error("Request failed: " + response.statusText);
      }

      const responseData = await response.json();
      const parsedResponseData = endPoint.response.parse(
        responseData
      ) as z.output<Response>;

      return parsedResponseData;
    } catch (err) {
      throw new Error("Server error");
    }
  };
};

export const APIS = {
  workspaces: {
    HttpMethod: "GET",
    path: ROUTES.workspace,
    params: z.object({
      workspaceId: z.string(),
    }),
    response: z.object({
      success: z.boolean(),
    }),
  },
} satisfies Record<string, EndPoint<any, any, any, any>>;

export const fetchWorkspaces = BuildEndPoint(APIS.workspaces);

const x = async () => {
  const data = await fetchWorkspaces(
    {
      workspaceId: "123",
    },
    {},
    {
      "Content-Type": "application/json",
    }
  );
};
