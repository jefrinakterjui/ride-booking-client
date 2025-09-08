import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Password from '@/components/ui/password';
import { User, Shield, Camera } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const MyProfile = () => {
    // Shudhu UI-er jonno state
    const [activeTab, setActiveTab] = useState('profile');
    const [profileImage, setProfileImage] = useState<string | null>('https://i.pravatar.cc/150?u=admin-professional');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Chobi poribortoner jonno placeholder function
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="p-6 bg-slate-50 min-h-full">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                {/* Left Sidebar: Profile Card and Navigation */}
                <div className="lg:col-span-1 bg-white rounded-xl  border border-gray-200 p-6 space-y-6">
                    {/* Profile Picture and Basic Info */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-4">
                            <Avatar className="h-28 w-28 border-4 border-primary/20">
                                <AvatarImage src={profileImage || undefined} alt="Admin Profile" />
                                <AvatarFallback className="text-4xl">A</AvatarFallback>
                            </Avatar>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white"
                                onClick={handleUploadClick}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                             <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">Admin User</h2>
                        <p className="text-sm text-gray-500">admin@gofwift.com</p>
                        <Badge className="mt-2">Administrator</Badge>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
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

                {/* Right Content: Forms */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && <EditProfileForm />}
                    {activeTab === 'password' && <ChangePasswordForm />}
                </div>

            </div>
        </div>
    );
};

// Sub-component for Edit Profile Form
const EditProfileForm = () => (
    <div className="bg-white rounded-xl -md border border-gray-200">
        <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">Personal Information</h3>
            <p className="text-sm text-gray-500 mt-1">Update your personal details here.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" placeholder="Your full name" defaultValue="Admin User" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="your.email@example.com" defaultValue="admin@gofwift.com" readOnly disabled />
                 </div>
             </div>
             <div className="text-right">
                <Button type="submit">Save Changes</Button>
             </div>
        </form>
    </div>
);

// Sub-component for Change Password Form
const ChangePasswordForm = () => (
    <div className="bg-white rounded-xl -md border border-gray-200">
        <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">Password Management</h3>
            <p className="text-sm text-gray-500 mt-1">Ensure your account is secure with a strong password.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
            <div className="space-y-2">
                <Label>Old Password</Label>
                <Password placeholder="Enter your current password"/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label>New Password</Label>
                    <Password placeholder="Enter new password"/>
                 </div>
                 <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Password placeholder="Confirm new password"/>
                 </div>
            </div>
             <div className="flex justify-between items-center">
                 <Button variant="link" className="p-0 h-auto">Forgot Password?</Button>
                <Button type="submit">Update Password</Button>
             </div>
        </form>
    </div>
);


// Reusable Navigation Button
const ProfileNavButton = ({ label, icon, isActive, onClick }: { label: string, icon: React.ReactElement, isActive: boolean, onClick: () => void }) => (
    <Button
        variant={isActive ? "secondary" : "ghost"}
        className={`w-full justify-start gap-3 font-semibold ${isActive ? 'text-primary' : 'text-gray-600'}`}
        onClick={onClick}
    >
        {React.cloneElement(icon, { className: "h-5 w-5" })}
        <span>{label}</span>
    </Button>
);

export default MyProfile;

