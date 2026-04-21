import { postRemoteCartValidate } from "~/server/utils/stock-api-client";
import { resolveAllProductsForValidation } from "~/server/utils/catalog-resolver";

interface LineInput {
  productId: string;
  quantity: number;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody<{ items?: LineInput[] }>(event);
  const lines = Array.isArray(body?.items) ? body.items : [];

  if (config.public.dataSource === "api" && config.stockApiBase) {
    const remote = await postRemoteCartValidate(event, { items: lines });
    if (remote && typeof remote === "object") {
      setResponseHeader(event, "x-cart-validate", "remote");
      return remote;
    }
  }

  const { products, fallback } = await resolveAllProductsForValidation(event);
  const issues: string[] = [];
  const resolved = lines.map((line) => {
    const p = products.find((x) => x.id === line.productId);
    if (!p) {
      issues.push(`Produit inconnu : ${line.productId}`);
      return {
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: 0,
        name: "",
        inStock: false,
        lineTotal: 0,
        ok: false,
      };
    }
    if (!p.inStock) issues.push(`${p.name} : rupture de stock`);
    const qty = Math.max(0, Number(line.quantity) || 0);
    return {
      productId: p.id,
      quantity: qty,
      unitPrice: p.price,
      name: p.name,
      inStock: p.inStock,
      lineTotal: p.price * qty,
      ok: p.inStock && qty > 0,
    };
  });

  const ok = issues.length === 0 && resolved.every((r) => r.ok);
  setResponseHeader(event, "x-cart-validate", fallback ? "mock-fallback" : "mock");

  return {
    lines: resolved,
    issues,
    ok,
    fallback,
  };
});
