// utils/authUtils.js
export const verifyUser = async () => {
  try {
    const token = localStorage.getItem("userToken");
    if (!token) return null;

    const response = await axios.get(
      "https://3-d-backend-3pgu.vercel.app/api/users/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data.success) {
      return response.data.user;
    }
    return null;
  } catch (error) {
    console.error("User verification failed:", error);
    return null;
  }
};

export const logoutUser = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userData");
  window.location.href = "/"; // Redirect to home page
};
