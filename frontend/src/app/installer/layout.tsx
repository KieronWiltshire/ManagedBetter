import { checkInstallationStatus } from '@/actions/installer.action';
import { notFound, redirect } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default async function InstallLayout({ children }: PropsWithChildren) {
    const status = await checkInstallationStatus();

	if(!status.installed) {
		return children;
	}

    return notFound();
}
