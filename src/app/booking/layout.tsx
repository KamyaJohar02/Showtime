import React from "react";

interface BookingProps{
    children: React.ReactNode
}

export default function Booking({ children }: BookingProps){
    return (
    <div>
    <section>
    {children}
    </section>
    </div>
    );
}

