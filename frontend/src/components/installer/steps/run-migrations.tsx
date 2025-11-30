"use client";

import { useState } from "react";
import { runMigrations, type InstallerStatus } from "@/actions/installer.action";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RunMigrationsProps {
	onComplete: () => void;
}

export function RunMigrations({ onComplete }: RunMigrationsProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const handleRunMigrations = async () => {
		setLoading(true);
		setError(null);
		setSuccessMessage(null);

		try {
			const result: InstallerStatus = await runMigrations();
			if (result.migrations) {
				setSuccessMessage("Migrations completed successfully");
				onComplete();
			} else {
				setError("Migration failed");
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
				<h3 className="text-lg font-semibold">Step 1: Run Database Migrations</h3>
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
				onClick={handleRunMigrations}
				disabled={loading || !!successMessage}
				className="w-full"
			>
				{loading ? "Running migrations..." : successMessage ? "Migrations Complete" : "Run Migrations"}
			</Button>
		</div>
	);
}

