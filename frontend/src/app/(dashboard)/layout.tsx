import { auth } from '@/lib/better-auth-client'
import { redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function DashboardLayout({ children }: PropsWithChildren) {
    const session = await auth.getSession();

    if (!session || session?.error) {
        return redirect('/auth');
    }

    return children;
}
