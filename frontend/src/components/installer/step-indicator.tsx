"use client";

import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InstallerStep } from "./installer";

interface StepIndicatorProps {
	steps: InstallerStep[];
	currentStep: InstallerStep | undefined;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
	return (
		<div className="space-y-4">
			{steps.map((step) => {
				const isCurrent = currentStep?.number === step.number;
				const isCompleted = currentStep?.completed;

				return (
					<div key={step.number} className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<Badge
								variant={isCurrent || isCompleted ? "default" : "outline"}
								className={cn(
									"w-8 h-8 rounded-full flex items-center justify-center p-0",
									isCurrent && "bg-primary text-primary-foreground",
									isCompleted &&
										!isCurrent &&
										"bg-green-600 text-white border-green-600",
									!isCompleted &&
										!isCurrent &&
										"bg-muted text-muted-foreground",
								)}
							>
								{isCompleted ? (
									<CheckCircle2 className="w-5 h-5" />
								) : (
									step.number
								)}
							</Badge>
							<span className="font-medium">{step.title}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
}
