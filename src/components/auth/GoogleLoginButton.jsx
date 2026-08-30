import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function GoogleLoginButton() {
  const navigate = useNavigate();
  const { refetchUser } = useAuth();
  const { showToast } = useToast();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await googleLogin(credentialResponse.credential);
      const { user, accessToken, refreshToken } = res.data.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(user));
      await refetchUser();
      navigate("/dashboard");
    } catch (err) {
      showToast(err.response?.data?.message || "Google login failed", "error");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => showToast("Google login failed", "error")}
        theme="outline"
        size="large"
        shape="rectangular"
        width="320"
      />
    </div>
  );
}

export default GoogleLoginButton;
