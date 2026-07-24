import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";


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
        <>uodatepage</>
    );
};

export default AdminUserUpdatePage;