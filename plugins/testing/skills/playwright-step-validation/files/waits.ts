import { type Page, type Request, type Response } from "@playwright/test";

/** Matches a response by endpoint and method, ignoring status so a failing
 *  request still resolves the wait and can be asserted on explicitly. A
 *  predicate that also requires `ok()` turns a 500 into a timeout, which
 *  reports as "waiting for response" instead of "the API returned 500". */
export function onEndpoint(pattern: string, method: string = "GET") {
  return (response: Response): boolean =>
    response.url().includes(pattern) && response.request().method() === method;
}

/**
 * Network waits are events: the listener must be registered *before* the
 * action that triggers them. Awaiting the click first is the most common
 * cause of a timeout here — the response arrives while nothing is listening.
 *
 * `Promise.all` keeps the two in one atomic block, and the wait goes first:
 * the array's expressions are evaluated left to right, so an action listed
 * first would start before the listener exists.
 */
export async function responseFrom(
  page: Page,
  predicate: (response: Response) => boolean,
  trigger: () => Promise<void>,
): Promise<Response> {
  const [response] = await Promise.all([page.waitForResponse(predicate), trigger()]);
  return response;
}

/** For fire-and-forget calls (analytics, beacons) where only the request exists. */
export async function requestFrom(
  page: Page,
  predicate: (request: Request) => boolean,
  trigger: () => Promise<void>,
): Promise<Request> {
  const [request] = await Promise.all([page.waitForRequest(predicate), trigger()]);
  return request;
}
