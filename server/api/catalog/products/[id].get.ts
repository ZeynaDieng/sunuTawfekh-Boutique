import { resolveProductById } from "~/server/utils/catalog-resolver";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing id" });
  }

  const { product, fromApi, fallback } = await resolveProductById(event, id);

  if (!product) {
    throw createError({ statusCode: 404, message: "Product not found" });
  }

  const sourceTag = fallback
    ? "mock-fallback"
    : fromApi
      ? config.public.dataSource === "orion"
        ? "orion"
        : "api"
      : "mock";
  setResponseHeader(event, "x-catalog-source", sourceTag);
  if (config.public.showDemoBanner && fallback) {
    setResponseHeader(event, "x-demo-banner", "1");
  }

  return {
    product,
    source: sourceTag,
    fallback,
    demoMode: Boolean(config.public.showDemoBanner && fallback),
  };
});
