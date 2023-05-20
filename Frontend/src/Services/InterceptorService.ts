import axios from "axios";
import { authStore } from "../Redux/AuthState";

// ====================== Intercept request ======================
class InterceptorService {
  // Create interceptor:
  public create(): void {
    // Register to any request:
    axios.interceptors.request.use((requestObject) => {
      // If we have token:
      if (authStore.getState().token) {
        // Add authorization header with token:
        requestObject.headers["Authorization"] =
          "Bearer " + authStore.getState().token;
      }

      return requestObject;
    });
  }
}

const interceptorService = new InterceptorService();

export default interceptorService;
