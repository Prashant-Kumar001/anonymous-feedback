"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Key } from "lucide-react";

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

import { resAPI } from "@/types/res.API";
import signIN from "@/schemas/signin";
import { signIn } from "next-auth/react";

type SignInValues = z.infer<typeof signIN>;

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const message = searchParams.get("message");

  const form = useForm<SignInValues>({
    resolver: zodResolver(signIN),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: SignInValues) => {
    console.log(data);
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      console.log(result);

      if (result?.error) {
        form.setError("root", { message: result.error });
        toast.error(result.error);
      }

      if (result?.ok) {
        router.push("/dashboard");
      }

      router.push("/dashboard");
    } catch (err) {
      const error = err as resAPI;
      const message = error.message || "Sign-in failed";
      form.setError("root", { message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h1>
            <p className="text-gray-600 text-sm">
              Welcome back! Please login to your account
            </p>
          </div>

          <Form {...form}>
            {message && (
              <Alert className="mb-6" variant={"default"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {form.formState.errors.root && (
              <Alert className="mb-2" variant="destructive">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
                        placeholder="Enter your password"
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
                className="w-full"
                disabled={form.formState.isSubmitting}
                variant={"secondary"}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
