"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, ShieldCheck, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";
import { messages } from "@/app/fake";
import Autoplay from "embla-carousel-autoplay";

export default function LandingPage() {

  const autoplay = Autoplay({ delay: 3000 });

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-indigo-50 to-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Share Honestly, Stay Anonymous
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl">
          A safe place to receive anonymous messages from friends, fans, or
          anyone — and reply only when you want to.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signin">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto grid gap-10 md:grid-cols-3 text-center">
        <div className="flex flex-col items-center">
          <MessageCircle className="h-10 w-10 text-indigo-600 mb-4" />
          <h3 className="text-lg font-semibold">Anonymous Messaging</h3>
          <p className="text-sm text-gray-500 mt-2">
            Get honest feedback and fun messages without revealing identities.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldCheck className="h-10 w-10 text-indigo-600 mb-4" />
          <h3 className="text-lg font-semibold">Safe & Secure</h3>
          <p className="text-sm text-gray-500 mt-2">
            Control who can send messages and toggle settings anytime.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <Zap className="h-10 w-10 text-indigo-600 mb-4" />
          <h3 className="text-lg font-semibold">Instant Setup</h3>
          <p className="text-sm text-gray-500 mt-2">
            Sign in, share your link, and start receiving messages right away.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            What Your Dashboard Looks Like
          </h2>
          <Card className="shadow-xl border rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="h-64 flex items-center justify-center bg-gray-100 text-gray-400">
                <p>🖼 Dashboard Preview (Insert Screenshot)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to see what people think?
        </h2>
        <div className="max-w-4x mx-auto">
          <Carousel
            plugins={[autoplay]}
            className="mb-5 w-full max-w-xs mx-auto"
          >
            <CarouselContent>
              {messages?.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-xl font-semibold">
                          {message.message}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
