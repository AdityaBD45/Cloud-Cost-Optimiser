const BASE_URL = "https://cloudcost-optimizer-api.onrender.com";

async function postCsv(endpoint, file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Request failed");
  }

  return response.json();
}

export const predictCost = (file) =>
  postCsv("/predict-cost", file);

export const detectWaste = (file) =>
  postCsv("/detect-waste", file);
