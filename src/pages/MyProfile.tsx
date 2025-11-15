import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, Shield, Camera, History } from 'lucide-react';
import { Label } from '@/components/ui/label';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useChangePasswordMutation, useUpdateMyProfileMutation, useUserInfoQuery } from '@/redux/freatures/auth/auth.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/Components/ui/form';
import { Badge } from '@/Components/ui/badge';
import { Input } from '@/Components/ui/input';
import Password from '@/Components/ui/password';
import { Skeleton } from '@/Components/ui/skeleton';

const profileSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
});

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, { message: 'Old password is required' }),
    newPassword: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const { data: userData, isLoading } = useUserInfoQuery(undefined);
  const user = userData?.data;
  const userRole = user?.role.charAt(0) + user?.role.slice(1).toLowerCase();
  const totalRides = user?.totalRidesRequested; 

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="h-28 w-28 border-4 border-primary/20">
                <AvatarImage src={'https://i.pravatar.cc/150?u=' + user?.email} alt={user?.name} />
                <AvatarFallback className="text-4xl">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white"
                // onClick={handleUploadClick}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <Badge className="mt-2">{userRole}</Badge>
          </div>

          <div className="border-t border-gray-200 pt-6 space-y-4">
            {user?.role === 'RIDER' && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className='flex items-center gap-2'>
                  <History className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-gray-700">Total Rides</span>
                </div>
                <span className="text-lg font-bold text-primary">{totalRides}</span>
              </div>
            )}
            <nav className="space-y-2">
              <ProfileNavButton
                label="Profile"
                icon={<User />}
                isActive={activeTab === 'profile'}
                onClick={() => setActiveTab('profile')}
              />
              <ProfileNavButton
                label="Password Management"
                icon={<Shield />}
                isActive={activeTab === 'password'}
                onClick={() => setActiveTab('password')}
              />
            </nav>
          </div>
        </div>
        <div className="lg:col-span-3">
          {activeTab === 'profile' && <EditProfileForm user={user} />}
          {activeTab === 'password' && <ChangePasswordForm />}
        </div>
      </div>
    </div>
  );
};

const EditProfileForm = ({ user }: { user: any }) => {
  const [updateMyProfile, { isLoading }] = useUpdateMyProfileMutation();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  const onProfileSubmit = async (values: z.infer<typeof profileSchema>) => {
    const toastId = toast.loading('Updating profile...');
    try {
      await updateMyProfile(values).unwrap();
      toast.success('Profile updated successfully!', { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Update failed', { id: toastId });
    }
  };
  useEffect(() => {
    if (user) {
      form.reset({ name: user.name });
    }
  }, [user, form]);

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
        <p className="text-sm text-gray-500 mt-1">Update your personal details here.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onProfileSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue={user?.email} readOnly disabled />
            </div>
          </div>
          <div className="text-right">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ChangePasswordForm = () => {
  const [changeMyPassword, { isLoading }] = useChangePasswordMutation();
  
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onPasswordSubmit = async (values: z.infer<typeof passwordSchema>) => {
    const toastId = toast.loading('Updating password...');
    try {
      const { oldPassword, newPassword } = values;
      await changeMyPassword({ oldPassword, newPassword }).unwrap();
      
      toast.success('Password updated successfully!', { id: toastId });
      form.reset();
    } catch (err: any)
    {
      toast.error(err?.data?.message || 'Update failed', { id: toastId });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b">
        <h3 className="text-xl font-bold text-gray-800">Password Management</h3>
        <p className="text-sm text-gray-500 mt-1">Ensure your account is secure.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onPasswordSubmit)} className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Password placeholder="Enter your current password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Password placeholder="Enter new password" {...field} />
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
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Password placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="text-right">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ProfileNavButton = ({ label, icon, isActive, onClick }: { label: string, icon: React.ReactElement, isActive: boolean, onClick: () => void }) => (
    <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 font-semibold ${isActive ? 'text-primary' : 'text-gray-600'}`}
        onClick={onClick}
    >
        {React.cloneElement(icon, { className: "h-5 w-5" } as any)}
        <span>{label}</span>
    </Button>
);

const ProfileSkeleton = () => (
  <div className="p-6 bg-slate-50 min-h-full animate-pulse">
    <Skeleton className="h-10 w-1/3 mb-6" />
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-28 w-28 rounded-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-5 w-1/3" />
        </div>
        <div className="border-t border-gray-200 pt-6 space-y-4">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b">
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="flex justify-end">
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default MyProfile;