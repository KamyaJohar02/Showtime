import React from "react";

interface myBookingsProps{
    children: React.ReactNode
}

export default function myBookings({ children }: myBookingsProps){
    return (
    <div>
    <section>
    {children}
    </section>
    </div>
    );
}
