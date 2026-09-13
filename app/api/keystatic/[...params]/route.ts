import { makeRouteHandler } from "@keystatic/next/route-handler";

import keystaticConfig, { showAdminUI } from "@/keystatic.config";

function notFoundHandler() {
  return new Response(null, { status: 404 });
}

const handlers = showAdminUI
  ? makeRouteHandler({ config: keystaticConfig })
  : { GET: notFoundHandler, POST: notFoundHandler };

export const { GET, POST } = handlers;
