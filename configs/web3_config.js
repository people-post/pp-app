export const WEB3 = {
  "guest_idol_id" :
      "k51qzi5uqu5dged5qgsvt2mvkdsmfxnvdrr1o1h6ak1fbcpsqsbyj45bhn66yb"
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.C = window.C || {};
  window.C.WEB3 = WEB3;
}
