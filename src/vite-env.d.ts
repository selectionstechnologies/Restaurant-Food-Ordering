/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CURRENCY?: string;
  readonly VITE_LOCALE?: string;
  readonly VITE_DELIVERY_FEE?: string;
  readonly VITE_FREE_DELIVERY_THRESHOLD?: string;
  readonly VITE_TAX_RATE?: string;
  readonly VITE_ONLINE_PAYMENT_ENABLED?: string;
  readonly VITE_ONLINE_PAYMENT_LABEL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
