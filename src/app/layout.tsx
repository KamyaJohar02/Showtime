import "./globals.css";
import ClientLayout from "@/components/layouts/ClientLayout";

export const metadata = {
  title: "Showtime",
  description: "Book your private cinematic experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
