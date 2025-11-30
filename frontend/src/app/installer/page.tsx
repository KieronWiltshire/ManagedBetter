import { Installer } from "@/components/installer/installer";

export default function InstallPage() {
	return (
		<main className="flex min-h-screen w-full items-center justify-center p-4">
			<Installer lastKnownStep={1} />
		</main>
	);
}
