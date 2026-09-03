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
import { ArrowRight, ShieldCheck, MessageCircle, Zap, Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { messages } from "@/app/fake";
import Autoplay from "embla-carousel-autoplay";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { data, status } = useSession();
  const [mounted, setMounted] = useState(false);
  
  // Only show auth-dependent content after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const autoplay = Autoplay({ delay: 3000 });

  const renderAuthButton = () => {
    if (!mounted) {
      return (
        <Button variant="default" size="lg" className="min-w-35">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      );
    }

    if (status === "loading") {
      return (
        <Button variant="default" size="lg" className="min-w-35" disabled>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Loading...
        </Button>
      );
    }

    if (status === "authenticated") {
      return (
        <Button variant="default" size="lg" className="group min-w-35">
          Dashboard
          <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      );
    }

    return (
      <Button variant="default" size="lg" className="group min-w-35">
        Get Started
        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
     
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
            Anonymous Messaging Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Share Honestly,{" "}
            <span className="text-indigo-600">Stay Anonymous</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            A safe space to receive honest feedback and anonymous messages from 
            friends, followers, and peers — respond only when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={status === "authenticated" ? "/dashboard" : "/auth/signin"}>
              {renderAuthButton()}
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="min-w-35">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

     
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Anonymous?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to start receiving honest feedback from your community.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: MessageCircle,
                title: "Anonymous Messaging",
                description: "Receive honest feedback and fun messages without knowing who sent them.",
              },
              {
                icon: ShieldCheck,
                title: "Safe & Secure",
                description: "Full control over who can send messages with toggle settings anytime.",
              },
              {
                icon: Zap,
                title: "Instant Setup",
                description: "Get started in minutes — sign in, share your link, and collect messages.",
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <div className="p-3 bg-indigo-50 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Dashboard Preview
            </h2>
            <p className="text-gray-600">
              Manage all your messages in one clean, organized interface.
            </p>
          </div>
          <Card className="shadow-xl border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="h-72 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-indigo-400" />
                  <p className="text-lg font-medium">Dashboard Preview</p>
                  <p className="text-sm">Message management interface</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Real Messages From Users
            </h2>
            <p className="text-gray-600">
              See what people are saying anonymously.
            </p>
          </div>
          <Carousel
            plugins={[autoplay]}
            className="w-full max-w-md mx-auto"
            opts={{
              align: "center",
              loop: true,
            }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-2">
                    <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg text-gray-800">
                          {message.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center min-h-50 p-6">
                        <p className="text-xl text-gray-700 text-center leading-relaxed">
                          "{message.message}"
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-indigo-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users already collecting honest feedback anonymously.
          </p>
          <Link href={status === "authenticated" ? "/dashboard" : "/auth/signin"}>
            <Button 
              variant="secondary" 
              size="lg" 
              className="group bg-white text-indigo-600 hover:bg-gray-50 text-lg px-8"
            >
              Start Now
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}