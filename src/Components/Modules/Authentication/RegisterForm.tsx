/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/freatures/auth/auth.api";
import React from "react";
import shild from "@/assets/images/shield.png";
import profit from "@/assets/images/profit.png";
import check from "@/assets/images/check.png";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";
import Password from "@/Components/ui/password";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters" })
      .max(50),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 uppercase letter.",
      })
      .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1 special character.",
      })
      .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
      }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm Password must be at least 8 characters" }),
    role: z.enum(["RIDER", "DRIVER"], {
      message: "Please select a role.",
    }),
    vehicleInfo: z
      .object({
        vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
        model: z.string().min(1, { message: "Model is required" }),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .superRefine((data, ctx) => {
    if (data.role === "DRIVER" && !data.vehicleInfo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Vehicle type is required for drivers",
        path: ["vehicleInfo.vehicleType"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Model is required for drivers",
        path: ["vehicleInfo.model"],
      });
    }
  });

export function RegisterForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    const userInfo: any = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    };

    if (data.role === "DRIVER") {
      userInfo.vehicleInfo = data.vehicleInfo;
    }

    const toastId = toast.loading("Creating account...");

    try {
      const result = await register(userInfo).unwrap();
      toast.success("User created successfully 🎉", { id: toastId });
      console.log(result);
      form.reset();
      navigate("/login");
    } catch (error: any) {
      console.error(error); 
      let errorMessage = "Registration failed. Please try again."; 

      if (
        error?.data?.errorSource &&
        Array.isArray(error.data.errorSource) &&
        error.data.errorSource.length > 0
      ) {
        errorMessage = error.data.errorSource[0].message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="flex md:flex-row flex-col items-center justify-center  gap-20 mx-auto">
      <div
        className={cn(
          "flex flex-col gap-3 relative overflow-hidden p-6 border rounded-2xl",
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Register your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to create an account
          </p>
        </div>
        <div className=" w-[250px] h-[250px] rounded-full bg-primary/50 absolute -z-10 -bottom-[20%] -left-[20%] blur-2xl "></div>
        <div className="grid gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your Role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="RIDER">Rider</SelectItem>
                            <SelectItem value="DRIVER">Driver</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {selectedRole === "DRIVER" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="vehicleInfo.vehicleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Car, Bike" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleInfo.model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Toyota Corolla"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Password {...field} /> 
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
      <div className=" h-[350px] hidden md:flex  border-r-primary border "></div>
      <div className="flex flex-col justify-center gap-8 p-6 max-w-sm">
        <div className="flex items-start gap-4">
          <div className="text-red-500 text-2xl">
            <img src={shild} alt="shild" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Your Ride is Secured</h3>
            <p className="text-sm text-muted-foreground text-justify">
              GoSwift cares about your safety. And to keep you safe, we are
              providing you safety coverage."
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-red-500 text-2xl">
            <img src={profit} alt="profit" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Earn More with Bonus</h3>
            <p className="text-sm text-muted-foreground text-justify">
              With GoSwift’s daily quests and attractive special offers, you can
              earn extra regularly.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-red-500 text-2xl">
            <img src={check} alt="check" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Get Your Payment on Time</h3>
            <p className="text-sm text-muted-foreground text-justify">
              With GoSwift, you will never face a delay in payment. Get paid in
              the shortest time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}