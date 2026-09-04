import { getUserById } from "@/lib/actions/user/user-actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateUserForm from './update-user-form';
import { requireAdmin } from "@/lib/actions/auth-guard";


export const metadata: Metadata = {
    title: "Update User | Admin",
};

const AdminUserUpdatePage = async (props: {
    params: Promise<{ id: string; }>;
}) => {
    //safe guard
    await requireAdmin();

    const { id } = await props.params;

    const user = await getUserById(id);

    if (!user) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-lg mx-auto py-4">
            <div className="flex flex-col gap-1 text-center">
                <h2 className="text-2xl font-bold tracking-tight">Update User</h2>
                <p className="text-sm text-muted-foreground">
                    Modify details and role permissions for {user.name || "user"}.
                </p>
            </div>

            <UpdateUserForm user={user} />
        </div>
    );
};

export default AdminUserUpdatePage;