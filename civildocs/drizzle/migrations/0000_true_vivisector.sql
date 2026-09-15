CREATE TABLE `module2_validation_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`task_uid` varchar(65) NOT NULL,
	`attempted_at` timestamp NOT NULL DEFAULT (now()),
	`status` varchar(48) NOT NULL,
	`success` int NOT NULL DEFAULT 0,
	`line_item_count` int NOT NULL DEFAULT 0,
	`flashcard_review_ready` int NOT NULL DEFAULT 0,
	`pdf_handoff_ready` int NOT NULL DEFAULT 0,
	`detail` text,
	CONSTRAINT `module2_validation_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `module2_validation_state` (
	`task_uid` varchar(65) NOT NULL,
	`first_success_at` timestamp,
	`owner_notified_at` timestamp,
	`last_run_at` timestamp NOT NULL DEFAULT (now()),
	`last_outcome` varchar(48) NOT NULL DEFAULT 'pending',
	CONSTRAINT `module2_validation_state_task_uid` PRIMARY KEY(`task_uid`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);

