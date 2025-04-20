import "./globals.css";

export const metadata = {
  title: "Showtime",
  description: "Book your private cinematic experience",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
