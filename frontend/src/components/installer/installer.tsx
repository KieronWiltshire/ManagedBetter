"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "./step-indicator";
import { RunMigrations } from "./steps/run-migrations";
import { SetupBetterAuth } from "./steps/setup-better-auth";
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
	{ number: 1, title: "Run Database Migrations" },
	{ number: 2, title: "Setup Better Auth" },
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

					{currentStep?.number === 1 && <RunMigrations onComplete={handleStepComplete} />}

					{currentStep?.number === 2 && <SetupBetterAuth onComplete={handleStepComplete} />}

					{!currentStep && <CompletionMessage />}
				</CardContent>
			</Card>
		</div>
	);
}

