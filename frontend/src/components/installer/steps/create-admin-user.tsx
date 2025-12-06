"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createAdminUser, CreateAdminUserData } from "@/actions/installer.action";

interface CreateAdminUserProps {
	onComplete: () => void;
}

export function CreateAdminUser({ onComplete }: CreateAdminUserProps) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formData, setFormData] = useState<CreateAdminUserData>({
		email: "",
		password: "",
		name: "",
	});

	const handleCreateAdmin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const result = await createAdminUser(formData);
			if (result.adminUserCreated) {
				onComplete();
			} else {
				setError("Failed to create admin user");
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
				<h3 className="text-lg font-semibold">Step 2: Create Admin User</h3>
				<p className="text-sm text-muted-foreground">
					Create your first admin account to complete the Better Auth setup.
				</p>
			</div>
			<form onSubmit={handleCreateAdmin} className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">Full Name</Label>
					<Input
						id="name"
						type="text"
						required
						value={formData.name}
						onChange={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
						placeholder="John Doe"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						required
						value={formData.email}
						onChange={(e) =>
							setFormData({ ...formData, email: e.target.value })
						}
						placeholder="admin@example.com"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type="password"
						required
						value={formData.password}
						onChange={(e) =>
							setFormData({ ...formData, password: e.target.value })
						}
						placeholder="••••••••"
						minLength={8}
					/>
				</div>

				{error && (
					<Alert variant="destructive">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				<Button type="submit" disabled={loading} className="w-full">
					{loading ? "Creating..." : "Create Admin User"}
				</Button>
			</form>
		</div>
	);
}

