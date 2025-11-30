"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function CompletionMessage() {
	return (
		<Alert className="bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300">
			<CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
			<AlertTitle className="text-green-800 dark:text-green-200">
				Installation Complete!
			</AlertTitle>
			<AlertDescription className="text-green-700 dark:text-green-300">
				Better Auth has been successfully installed. You can now proceed to the
				application.
			</AlertDescription>
		</Alert>
	);
}
