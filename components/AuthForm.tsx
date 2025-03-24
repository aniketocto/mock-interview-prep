"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

type FormType = "sign-in" | "sign-up";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up"
        ? z
            .string()
            .min(3, "Name must be at least 3 characters")
            .max(50, "Name cannot exceed 50 characters")
            .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
        : z.string().optional(),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email cannot exceed 100 characters")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email format"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password cannot exceed 100 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  // Define form with proper typing
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Simulate a slight delay to allow toast to show before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (type === "sign-up") {
        toast.success("Account created successfully, Please Sign in");
        // Push to sign-in page after signup
        router.push("/sign-in");
      } else {
        toast.success("Signed in successfully");
        // Push to home or dashboard after signin
        router.push("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error(
        `There was an error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src="/logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">AceBot</h2>
        </div>
        <h3>Practice Job Interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                label="Name"
                name="name"
                placeholder="Name"
              />
            )}
            <FormField
              control={form.control}
              label="Email Address"
              name="email"
              type="email"
              placeholder="Email Address"
            />
            <FormField
              control={form.control}
              label="Password"
              name="password"
              placeholder="Enter Password"
              type="password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-user-primary ml-1"
          >
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
