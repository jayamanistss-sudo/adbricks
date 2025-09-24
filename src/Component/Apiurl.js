const BASE_URL = "https://demo.stss.in/admin/Config/router.php?router=";

const api = async (param, method = "GET", body = null, isFormData = false) => {
  try {
    const options = { method, headers: {} };

    if (body) {
      if (isFormData) {
        options.body = body;
      } else {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
      }
    }

    const response = await fetch(`${BASE_URL}${param}`, options);

    if (!response.ok) {
      const errorText = await response.text(); // get server error text
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
};

export default api;
