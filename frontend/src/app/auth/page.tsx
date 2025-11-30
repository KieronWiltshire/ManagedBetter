import { checkInstallationStatus } from "@/actions/installer.action";
import { auth } from "@/lib/better-auth-client";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AuthPage({ children }: PropsWithChildren) {
	const status = await checkInstallationStatus();

	if(!status.installed) {
		return redirect('/install');
	}

	const session = await auth.getSession();

	if(session) {
		return redirect('/');
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="z-10 max-w-md w-full space-y-8">
				<div>
					<h1 className="text-4xl font-bold text-center mb-2">
						Welcome to ManagedBetter
					</h1>
					<p className="text-center text-gray-600">
						Please sign in to continue
					</p>
				</div>
				<div className="mt-8">
					<p className="text-center text-sm text-gray-500">
						Authentication page - Sign in form will be implemented here
					</p>
				</div>
			</div>
		</main>
	);
}


