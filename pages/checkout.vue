<script setup lang="ts">
import { formatPrice } from "~/utils/data";

definePageMeta({
  middleware: ["checkout-empty"],
});

const { items, totalPrice, clearCart } = useCart();
const { close: closeCartDrawer } = useCartDrawer();

onMounted(() => {
  closeCartDrawer();
});
const { toast } = useToast();

const form = reactive({
  nom: "",
  telephone: "",
  adresse: "",
  ville: "Dakar",
  notes: "",
});

const payment = ref<"livraison" | "whatsapp">("livraison");
const submitting = ref(false);

async function handleSubmit(e: Event) {
  e.preventDefault();
  if (!form.nom || !form.telephone || !form.adresse) {
    toast({ title: "Veuillez remplir tous les champs obligatoires", variant: "destructive" });
    return;
  }

  submitting.value = true;
  try {
    const validation = await $fetch<{
      ok: boolean;
      issues?: string[];
    }>("/api/cart/validate", {
      method: "POST",
      body: {
        items: items.value.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      },
    });

    if (!validation.ok && validation.issues?.length) {
      toast({
        title: "Panier à vérifier",
        description: validation.issues.join(". "),
        variant: "destructive",
      });
      return;
    }

    if (payment.value === "whatsapp") {
      const msg = encodeURIComponent(
        `\u{1F6CD}\uFE0F Nouvelle commande\n\nNom: ${form.nom}\nTél: ${form.telephone}\nAdresse: ${form.adresse}, ${form.ville}\n\nProduits:\n${items.value.map((i) => `- ${i.product.name} x${i.quantity} = ${formatPrice(i.product.price * i.quantity)}`).join("\n")}\n\nTotal: ${formatPrice(totalPrice.value)}\n\nNotes: ${form.notes || "Aucune"}`,
      );
      window.open(`https://wa.me/221770000000?text=${msg}`, "_blank");
    }

    const orderPayload = {
      customer: {
        name: form.nom,
        phone: form.telephone,
        address: form.adresse,
        city: form.ville,
        notes: form.notes,
      },
      payment: payment.value,
      lines: items.value.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        unitPrice: i.product.price,
      })),
    };

    await $fetch("/api/orders", { method: "POST", body: orderPayload });

    toast({ title: "Commande confirmée !", description: "Vous recevrez une confirmation sous peu." });
    clearCart();
    await navigateTo("/");
  } catch {
    toast({
      title: "Erreur",
      description: "Impossible de finaliser la commande. Réessayez.",
      variant: "destructive",
    });
  } finally {
    submitting.value = false;
  }
}

useSeoMeta({
  title: "Checkout — Sunu Tawfekh",
  description: "Finalisez votre commande Sunu Tawfekh.",
});
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Navbar />
    <div class="pt-with-fixed-nav pb-12">
      <div class="mx-auto max-w-container-max px-6 md:px-12 xl:px-margin-x">
        <div class="mx-auto max-w-2xl">
        <h2 class="luxe-title mb-8 text-center text-3xl font-semibold md:text-4xl">Finaliser la commande</h2>

        <form class="space-y-6" @submit="handleSubmit">
          <div class="premium-light-panel space-y-2 p-4">
            <h3 class="mb-3 text-sm font-semibold">Récapitulatif</h3>
            <div v-for="i in items" :key="i.product.id" class="flex justify-between text-sm">
              <span>{{ i.product.name }} × {{ i.quantity }}</span>
              <span>{{ formatPrice(i.product.price * i.quantity) }}</span>
            </div>
            <div class="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{{ formatPrice(totalPrice) }}</span>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-semibold">Informations de livraison</h3>
            <Input v-model="form.nom" placeholder="Nom complet *" />
            <Input v-model="form.telephone" placeholder="Téléphone *" />
            <Input v-model="form.adresse" placeholder="Adresse complète *" />
            <Input v-model="form.ville" placeholder="Ville" />
            <Input v-model="form.notes" placeholder="Notes (optionnel)" />
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-semibold">Mode de paiement</h3>
            <div class="flex flex-col gap-2">
              <button
                type="button"
                :class="[
                  'premium-light-surface text-left p-4 transition-all duration-luxury ease-luxury hover:border-primary/50',
                  payment === 'livraison' ? 'border-primary ring-1 ring-primary/20' : 'border-border',
                ]"
                @click="payment = 'livraison'"
              >
                <p class="text-sm font-medium">Paiement à la livraison</p>
                <p class="text-sm text-muted-foreground">Payez en espèces à réception</p>
              </button>
              <button
                type="button"
                :class="[
                  'premium-light-surface text-left p-4 transition-all duration-luxury ease-luxury hover:border-primary/50',
                  payment === 'whatsapp' ? 'border-primary ring-1 ring-primary/20' : 'border-border',
                ]"
                @click="payment = 'whatsapp'"
              >
                <p class="text-sm font-medium">Commander via WhatsApp</p>
                <p class="text-sm text-muted-foreground">Envoyez votre commande directement par WhatsApp</p>
              </button>
            </div>
          </div>

          <Button type="submit" variant="hero" size="xl" class="w-full" :disabled="submitting">
            {{ submitting ? "Envoi…" : "Confirmer la commande" }}
          </Button>
        </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
