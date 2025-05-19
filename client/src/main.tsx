import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.ts";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          actionButtonStyle: {
            backgroundColor: "#f97316",
            color: "white",
            borderRadius: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: "500",
          },
        }}
      />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>,
);
