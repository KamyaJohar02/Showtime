import React from "react";

interface LoginProps{
    children: React.ReactNode
}

export default function Login({ children }: LoginProps){
    return (
    <div>
    <section>
    {children}
    </section>
    </div>
    );
}

