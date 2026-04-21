import { postRemoteOrder } from "~/server/utils/stock-api-client";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);

  if (!body || typeof body !== "object") {
    throw createError({ statusCode: 400, message: "Corps de requête invalide" });
  }

  if (config.public.dataSource === "api" && config.stockApiBase) {
    const remote = await postRemoteOrder(event, body);
    if (remote !== null) {
      setResponseHeader(event, "x-order-source", "api");
      return remote;
    }
  }

  setResponseHeader(event, "x-order-source", "mock");
  return {
    ok: true,
    orderId: `local-${Date.now()}`,
    mock: true,
    message: "Commande enregistrée (mode démo — brancher l’API pour la persistance réelle).",
  };
});
