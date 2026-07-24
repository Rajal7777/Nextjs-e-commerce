import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import UpdateUserForm from './update-user-form';


export const metadata: Metadata = {
    title: 'User update page',
};

const AdminUserUpdatePage = async (props: {
    params: Promise<{ id: string; }>;
}) => {

    const { id } = await props.params;

    const user = await getUserById(id);
    console.log(user);
    if (!user) return notFound();
    return (
        <>
            <h2 className="h2-bold text-center">Update User</h2>
            <UpdateUserForm user={user} />
        </>
    );
};

export default AdminUserUpdatePage;