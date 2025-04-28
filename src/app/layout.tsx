import "./globals.css";
import ClientLayout from "@/components/layouts/ClientLayout";
import { Toaster } from "react-hot-toast"; // Import the toaster


export const metadata = {
  title: "Showtime",
  description: "Book your private cinematic experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientLayout>
          {/* ✅ Add Global Toast Notification here */}
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
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
