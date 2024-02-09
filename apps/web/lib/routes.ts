import {
  ReadonlyURLSearchParams,
  useParams as useNextParams,
  useSearchParams as useNextSearchParams,
} from "next/navigation";
import queryString from "query-string";
import * as z from "zod";

export type RouteBuilder<
  Params extends z.ZodSchema,
  Search extends z.ZodSchema
> = {
  (p?: z.input<Params>, options?: { search?: z.input<Search> }): string;
  useParams: () => z.output<Params>;
  useSearchParams: () => z.output<Search>;
  params: z.output<Params>;
};

export const makeRoute = <
  URLParams extends z.ZodSchema,
  SearchParams extends z.ZodSchema
>(
  fn: (params: z.input<URLParams>) => string,
  paramsSchema: URLParams = {} as URLParams,
  search: SearchParams = {} as SearchParams
): RouteBuilder<URLParams, SearchParams> => {
  const routeBuilder: RouteBuilder<URLParams, SearchParams> = (
    params,
    options
  ) => {
    const baseRoute = fn(params);

    const searchParams =
      options?.search && queryString.stringify(options.search);

    return [baseRoute, searchParams ? `?${searchParams}` : ""].join("");
  };

  routeBuilder.useParams = (): z.output<URLParams> => {
    const routeName =
      Object.entries(ROUTES).find(
        ([key, value]) => (value as unknown) === routeBuilder
      )?.[0] || "(unknown route)";

    const res = paramsSchema.safeParse(useNextParams());

    if (!res.success) {
      throw new Error(
        `Invalid route params for route ${routeName}: ${res.error.message}`
      );
    }
    return res.data;
  };

  routeBuilder.useSearchParams = (): z.output<SearchParams> => {
    const routeName =
      Object.entries(ROUTES).find(
        ([, route]) => (route as unknown) === routeBuilder
      )?.[0] || "(unknown route)";
    const res = search.safeParse(
      convertURLSearchParamsToObject(useNextSearchParams())
    );
    if (!res.success) {
      throw new Error(
        `Invalid search params for route ${routeName}: ${res.error.message}`
      );
    }
    return res.data;
  };

  // set the type
  routeBuilder.params = undefined as z.output<SearchParams>;
  // set the runtime getter
  Object.defineProperty(routeBuilder, "params", {
    get() {
      throw new Error(
        "Routes.[route].params is only for type usage, not runtime. Use it like `typeof Routes.[routes].params`"
      );
    },
  });

  return routeBuilder;
};

export function convertURLSearchParamsToObject(
  params: ReadonlyURLSearchParams | null
): Record<string, string | string[]> {
  if (!params) {
    return {};
  }

  const obj: Record<string, string | string[]> = {};
  // @ts-expect-error
  for (const [key, value] of params.entries()) {
    if (params.getAll(key).length > 1) {
      obj[key] = params.getAll(key);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

const ROUTES = {
  home: makeRoute(() => "/", z.object({})),
  webAuthRedirect: makeRoute(
    () => "/get-started/authenticate",
    z.object({}),
    z.object({
      callbackMFA: z.string().min(1).url(),
    })
  ),
  getStarted: makeRoute(() => "/get-started", z.object({})),
};

export default ROUTES;
