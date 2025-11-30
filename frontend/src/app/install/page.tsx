"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkInstallationStatus } from "@/actions/installer.action";

export default function InstallPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="z-10 max-w-2xl w-full space-y-8">
				<div>
					<h1 className="text-4xl font-bold text-center mb-2">
						Installation Required
					</h1>
					<p className="text-center text-gray-600">
						ManagedBetter needs to be installed before you can use it.
					</p>
				</div>
				<div className="mt-8">
					<p className="text-center text-sm text-gray-500">
						Installation form will be implemented here
					</p>
				</div>
			</div>
		</main>
	);
}


