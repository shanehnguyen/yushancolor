const ACCESS_KEY = "be2c8975-1aec-4673-8afe-825a629c035c";

export async function submitWeb3Form(fields: Record<string, string>) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ access_key: ACCESS_KEY, ...fields }),
  });
  return res.json() as Promise<{ success: boolean; message?: string }>;
}
