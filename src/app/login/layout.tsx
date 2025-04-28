import React from "react";
import { Toaster } from "react-hot-toast"; // Import the toaster

interface LoginProps {
  children: React.ReactNode;
}

export default function Login({ children }: LoginProps) {
  return (
    <div>
      {/* Global Toast Notification */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            fontSize: "16px",
          },
        }}
      />

      {/* Page Content */}
      <section>
        {children}
      </section>
    </div>
  );
}
