import { type Download, type Page } from "@playwright/test";

/**
 * Downloads, popups and file choosers all arrive as events, and the listener
 * must be registered *before* the action that triggers them. Awaiting the
 * trigger first is the single most common mistake — the event fires while
 * nothing is listening and the test times out.
 */
export async function downloadFrom(page: Page, trigger: () => Promise<void>): Promise<Download> {
  const downloadPromise = page.waitForEvent("download");
  await trigger();
  return downloadPromise;
}

export async function popupFrom(page: Page, trigger: () => Promise<void>): Promise<Page> {
  const popupPromise = page.waitForEvent("popup");
  await trigger();
  const popup = await popupPromise;
  await popup.waitForLoadState();
  return popup;
}

/** Read a downloaded text file without writing it to disk. */
export async function readDownloadedText(download: Download): Promise<string> {
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf-8");
}
