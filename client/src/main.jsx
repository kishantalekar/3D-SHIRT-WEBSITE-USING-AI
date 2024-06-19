import React from "react";
import ReactDOM from "react-dom/client";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import App from "./App.jsx";
import "./index.css";

const clerkFrontendApi = "your-clerk-frontend-api-key"; // Replace with your actual Clerk frontend API key

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      frontendApi={"sk_test_SMhZl7HS1tT1hiuDBdAON7sRs5bQAVQyz80EYxxrlM"}
      publishableKey={"pk_test_Z3Jvd2luZy10dW5hLTM0LmNsZXJrLmFjY291bnRzLmRldiQ"}
    >
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>
);
