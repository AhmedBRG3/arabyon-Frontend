/**
 * Sends a form submission to the endpoint set in VITE_FORM_ENDPOINT
 * (e.g. a Formspree / Web3Forms / Make / Zapier webhook URL).
 * With no endpoint configured it resolves as `delivered: false` (demo mode),
 * so the UI can say so instead of pretending the request was received.
 */
export async function submitForm(
  type: 'trial' | 'contact',
  data: Record<string, FormDataEntryValue>,
): Promise<{ delivered: boolean }> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined
  if (!endpoint) return { delivered: false }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ type, submittedAt: new Date().toISOString(), ...data }),
  })
  if (!res.ok) throw new Error(`Form endpoint responded ${res.status}`)
  return { delivered: true }
}
