const Web3Forms = {
  ACCESS_KEY: "be2c8975-1aec-4673-8afe-825a629c035c",
  async submit(fields) {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: Web3Forms.ACCESS_KEY, ...fields }),
    });
    return res.json();
  },
};
