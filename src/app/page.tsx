

import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import "./globals.css"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold text-5xl">Where every life moment becomes an experience</h2>
        <h3 className="font-bold text-xl py-5">
          Book your personal movie theatre for celebrating your life events and much more...
        </h3>
      </section>
      
      {/* Carousel Section */}
      <section className="w-full max-w-4xl mx-auto relative">
        <Carousel className="h-96" opts={{ loop: true }}>
          <CarouselContent>
            {[5, 14, 3, 4, 13].map((index) => (
              <CarouselItem key={index} className="relative h-96">
                <Image
                  src={`/Images/${index}.webp`}
                  alt={`Carousel Image ${index}`}
                  layout="fill"
                  objectFit="cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="left-4 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="right-4 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </section>

      {/* Book Now Button */}
      <section className=" flex mt-4 justify-end">
        <Button className="bg-red-600 text-white py-2 px-4 rounded-full ">
          Book Now
        </Button>
      </section>
    </main>
  )
}
