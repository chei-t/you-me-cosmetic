POST /api/delivery/quote
Body: { zoneId: string }           // preferred
   or { town: string, county: string }   // fallback lookup
Response 200: {
  zoneId: string,
  zoneName: string,
  feeKes: number,
  estimatedDaysMin: number,
  estimatedDaysMax: number,
  freeThresholdKes: number | null,
  freeEligible: boolean,           // true if subtotal >= threshold (client passes subtotal)
}
Response 400: { error: "Unknown delivery zone" }