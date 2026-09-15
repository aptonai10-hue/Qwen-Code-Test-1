export type OwnerNotification = { title: string; content: string };

export async function notifyOwner(notification: OwnerNotification): Promise<boolean> {
  const forgeApiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const forgeApiKey = process.env.BUILT_IN_FORGE_API_KEY;
  if (!forgeApiUrl || !forgeApiKey || !notification.title.trim() || !notification.content.trim()) return false;

  const endpoint = new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    forgeApiUrl.endsWith("/") ? forgeApiUrl : `${forgeApiUrl}/`,
  ).toString();
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1",
      },
      body: JSON.stringify(notification),
    });
    return response.ok;
  } catch (error) {
    console.warn("[module2-validation] Owner notification request failed", error);
    return false;
  }
}

