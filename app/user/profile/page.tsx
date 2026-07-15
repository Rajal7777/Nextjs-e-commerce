import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from 'next-auth/react';
import ProfileForm from "./profile-form";

export const metadata: Metadata = {
    title: 'Form for user info'
};

const UserProfile = async () => {
    const session = await auth();

    //SessionProvider is required to pass session to client component
    return (
        <SessionProvider session={session}>
            <div className="max-w-md mx-auto space-y-4">
                <h2 className="h2-bold">Profile</h2>
                    <ProfileForm />
            </div>
        </SessionProvider>
    );
};

export default UserProfile;