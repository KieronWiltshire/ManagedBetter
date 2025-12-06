"use client";

import { useState } from "react";
import { configureManagedBetter, type InstallerStatus } from "@/actions/installer.action";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConfigureManagedBetterProps {
	onComplete: () => void;
}

export function ConfigureManagedBetter({ onComplete }: ConfigureManagedBetterProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleConfigureManagedBetter = async () => {
		setLoading(true);
		setError(null);
		setSuccessMessage(null);

		try {
			const result: InstallerStatus = await configureManagedBetter();
			if (result.betterAuthConfigured) {
				setSuccessMessage("ManagedBetter configured successfully");
				onComplete();
			} else {
				setError("Configuration failed");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "An error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div>
				<h3 className="text-lg font-semibold">Step 1: Configure ManagedBetter</h3>
				<p className="text-sm text-muted-foreground">
					Before configuring Better Auth, you must first migrate the database tables.
					This will create all necessary database structures.
				</p>
			</div>

			{successMessage && (
				<Alert>
					<AlertDescription>{successMessage}</AlertDescription>
				</Alert>
			)}

			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<Button
				onClick={handleConfigureManagedBetter}
				disabled={loading || !!successMessage}
				className="w-full"
			>
				{loading ? "Configuring..." : successMessage ? "Configuration Complete" : "Configure ManagedBetter"}
			</Button>
		</div>
	);
}

