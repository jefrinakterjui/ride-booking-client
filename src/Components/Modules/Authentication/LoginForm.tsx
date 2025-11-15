/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import Password from "@/Components/ui/password";
import { cn } from "@/lib/utils";
import { useLoginMutation } from "@/redux/freatures/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"; 
import { toast } from "sonner";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Password is too short" }),
});

interface ILoginResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      email: string;
      role: "ADMIN" | "DRIVER" | "RIDER";
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    const toastId = toast.loading("Logging in...");

    try {
      const res = (await login(data).unwrap()) as ILoginResponse;

      const user = res?.data?.user;

      if (res.success && user) {
        toast.success("Logged in successfully", { id: toastId });
        switch (user.role) {
          case "ADMIN":
            navigate("/admin/analytics");
            break;
          case "DRIVER":
            navigate("/driver/analytics"); 
            break;
          case "RIDER":
            navigate("/rider/analytics");
            break;
          default:
            navigate("/");
        }
      }
    } catch (err: any) {
      console.error(err);

      const errorMessage =
        err?.data?.message || "Login failed. Please try again.";
      
      if (errorMessage === "Password does not match") {
        toast.error("Invalid credentials", { id: toastId });
      } else {
        toast.error(errorMessage, { id: toastId });
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 relative overflow-hidden p-6 border rounded-2xl",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className=" w-[250px] h-[250px] rounded-full bg-primary/50 absolute -z-10 -bottom-[20%] -left-[20%] blur-2xl "></div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@company.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Password {...field} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" replace className="underline underline-offset-4">
          Register
        </Link>
      </div>
    </div>
  );
}