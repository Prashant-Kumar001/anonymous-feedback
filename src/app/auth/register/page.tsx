"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, User } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import signUP from "@/schemas/signup";
import { toast } from "sonner";
import { resAPI } from "@/types/res.API";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

type FormValues = z.infer<typeof signUP>;

export default function Register() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(signUP),
    defaultValues: { username: "", email: "", password: "" },
    mode: "onChange",
  });





  const onSubmit = async (data: FormValues) => {
    form.clearErrors("root");
    try {
      const res = await axios.post("/api/auth/signup", data);

      toast.success("Registered successfully", {
        description: res.data.message,
      });

      router.push(
        `/auth/verify/${data.username}?message=` +
        encodeURIComponent(
          "Registration successful! Please check your email."
        )
      );
    } catch (err) {
      const error = err as AxiosError<resAPI>;
      const message = error.response?.data?.message || "Registration failed";
      form.setError("root", { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={30} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm">
              Join us today and get started
            </p>
          </div>

          <Form {...form}>
            {form.formState.errors.root && (
              <Alert className="mb-2 w-full" variant="destructive">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
                variant="secondary"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 size={22} className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
