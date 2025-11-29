import { Module } from "@nestjs/common";
import { KyselyModule } from "nestjs-kysely";
import { BetterAuthService } from "./services/betterauth.service";

@Module({
	imports: [KyselyModule],
	providers: [BetterAuthService],
	exports: [BetterAuthService],
})
export class BetterAuthModule {}

