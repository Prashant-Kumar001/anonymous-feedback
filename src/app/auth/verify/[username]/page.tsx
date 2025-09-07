"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

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
import VerifyC from "@/schemas/verify";

type VerifyValues = z.infer<typeof VerifyC>;

export default function VerifyPage() {
  const Params = useParams<{ username: string }>();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const form = useForm<VerifyValues>({
    resolver: zodResolver(VerifyC),
    defaultValues: { VCode: "", username: Params.username },
    mode: "onChange",
  });

  const onSubmit = async (data: VerifyValues) => {
    form.clearErrors("root");

    try {
      const res = await axios.post("/api/auth/verify", data);
      toast.success("Verification successful", {
        description: res.data.message,
      });
      router.push(
        "/auth/signin?message=" +
          encodeURIComponent(
            "Verification successful! Please sign in."
          )
      );
    } catch (err) {
      const error = err as AxiosError<resAPI>;
      console.log("Verification error:", err);
      const message = error.response?.data?.message || "Verification failed";
      form.setError("root", { message });
    }
  };

  const handleResend = async () => {
    setResending(true);
    form.clearErrors("root");
    try {
      const res = await axios.post("/api/auth/resend-code", {
        username: form.getValues("username"),
      });
      toast.success(res.data.message || "New code sent");
    } catch (err) {
      const error = err as AxiosError<resAPI>;
      const message = error.response?.data?.message || "Failed to resend code";
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verify Account
            </h1>
            <p className="text-gray-600 text-sm">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <Form {...form}>
            {message && (
              <Alert className="mb-6" variant={"default"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {form.formState.errors.root && (
              <Alert className="mb-6 w-full " variant="destructive">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="VCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input
                        maxLength={6}
                        type="text"
                        placeholder="Enter verification code"
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
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Verify"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Button variant="ghost" onClick={handleResend} disabled={resending}>
              {resending && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              Resend Code
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
