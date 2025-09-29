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

    const contentType = response.headers.get("content-type");
    let result;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }
    return result; 

  } catch (err) {
    console.error("API Error:", err);
    return { status: 500, ok: false, data: err.message };
  }
};

export default api;
