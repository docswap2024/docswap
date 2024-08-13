ALTER TABLE "files" ADD COLUMN "is_favourite" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "storage" varchar(20);