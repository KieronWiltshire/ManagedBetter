"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "./step-indicator";
import { ConfigureManagedBetter } from "./steps/configure-managed-better";
import { CreateAdminUser } from "./steps/create-admin-user";
import { CompletionMessage } from "./completion-message";
import { useState } from "react";

export type InstallerStep = {
	number: number;
	title: string;
	completed?: boolean;
};

interface InstallerProps {
	lastKnownStep: number;
}

const STEPS = [
	{ number: 1, title: "Configure ManagedBetter" },
	{ number: 2, title: "Create Admin User" },
] as InstallerStep[];

export function Installer({ 
	lastKnownStep
}: InstallerProps) {
	const [currentStep, setCurrentStep] = useState(STEPS.find(step => step.number === lastKnownStep));

	const handleStepComplete = () => {
		if (currentStep) {
			const index = STEPS.findIndex(step => step.number === currentStep.number);

			if (index !== -1) {
				STEPS[index].completed = true;
				setCurrentStep(STEPS[index + 1]);
			}
		}
	};

	return (
		<div className="w-full max-w-2xl">
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Installation Wizard</CardTitle>
				</CardHeader>
				<CardContent className="space-y-8">
					<StepIndicator steps={STEPS} currentStep={currentStep} />

					{currentStep?.number === 1 && <ConfigureManagedBetter onComplete={handleStepComplete} />}

					{currentStep?.number === 2 && <CreateAdminUser onComplete={handleStepComplete} />}

					{!currentStep && <CompletionMessage />}
				</CardContent>
			</Card>
		</div>
	);
}

