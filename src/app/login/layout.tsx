import React from "react";

interface LoginProps {
  children: React.ReactNode;
}

export default function Login({ children }: LoginProps) {
  return (
    <div>

      {/* Page Content */}
      <section>
        {children}
      </section>
    </div>
  );
}
