---
title: Database Backups
description: Scheduled, verified Postgres backups to Cloudflare R2 or S3 — with test restores, safe restores, download links and Telegram alerts.
---

`graft db <name> backup` backs up **one database** to an S3-compatible bucket (Cloudflare R2, AWS S3, MinIO, ...), keeps it for as long as you choose, and lets you prove a backup works before you need it.

```bash
graft db myapp backup set        # configure bucket, retention and schedule
graft db myapp backup now        # back up right now
graft db myapp backup list       # every backup, newest first
graft db myapp backup test       # prove a backup restores, in a throwaway database
graft db myapp backup restore    # restore over the live database (verified first)
```

The name is the database name, the same one used by `graft db <name> init`. Every command also works at host and registry scope:

```bash
graft host db myapp backup list
graft -r azure db myapp backup list
```

:::note
Backups are snapshots taken on a schedule, so the most data you can lose is one interval (for example, 1 hour with hourly backups). They are not point-in-time recovery. If you need near-zero loss, use a continuous WAL archiving tool such as pgBackRest in addition.
:::

## Commands

| Command | What it does |
|---|---|
| `set` | Configure the bucket, retention and schedule, then install the cron job. |
| `now` | Back up immediately, then prune old backups. |
| `list` | Show every backup with its id, date, age, size and status. |
| `test [--inspect]` | Restore a backup into a throwaway database, run the checks, delete it. |
| `restore` | Replace the live database with a backup. Always verified first. |
| `download [-expires 24h]` | Print a temporary download link for a backup. |
| `prune` | Delete backups older than the retention period. |
| `prune <id>` | Keep only that backup and delete every other one. |
| `alert` | Set up Telegram alerts. |
| `log [lines]` | Show the log of every backup and verification step. |

## Setting up: `backup set`

```bash
graft db myapp backup set
```

You are asked for:

1. **Endpoint** — blank for AWS. For R2 use `https://<account-id>.r2.cloudflarestorage.com`.
2. **Region** — `auto` for R2.
3. **Bucket**, **access key ID** and **secret access key** (the secret is not echoed).
4. **Days to keep** — default 7.
5. **Time zone** — an IANA name such as `Asia/Dhaka` or `UTC`.
6. **First backup time** — `HH:MM`, 24-hour, in that time zone.
7. **Repeat every** — 1, 2, 3, 4, 6, 8, 12 or 24 hours (it must divide the day evenly).

For example, first backup `02:00`, every 12 hours, time zone `Asia/Dhaka` gives backups at 02:00 and 14:00 Dhaka time. Schedules follow the time zone, so daylight-saving changes are handled.

Before anything is scheduled, Graft checks that the bucket can be **read, written and deleted from**. If the check fails, nothing is changed on the server. You are then offered Telegram alerts and a first backup to confirm everything works. Run `set` again at any time to change the settings; existing values are shown as defaults.

:::note
The server needs `cron` (`crontab`), `flock`, Docker and passwordless `sudo` for Docker. The R2/S3 upload runs in the `amazon/aws-cli` container, so nothing else has to be installed.
:::

## What a backup does

Each run:

1. Dumps the database with `pg_dump` (custom format, already compressed).
2. Reads the archive's table of contents to confirm it is intact.
3. Uploads it to `backups/<name>/<name>_<UTC timestamp>.dump`.
4. Asks the bucket for the object's size and checks it matches.
5. Prunes backups older than the retention period.

If any step fails, the run fails, nothing is deleted, and the failure is logged (and sent to Telegram if alerts are on). A failed dump is never uploaded.

## Choosing a backup: `list`

```bash
graft db myapp backup list
```

```
Database:  myapp
Bucket:    s3://my-bucket/backups/myapp/
Retention: 7 days
Schedule:  hours 2,14 at minute 0 (Asia/Dhaka)
Last run:  2026-10-07T08:00:04Z OK myapp_20261007T080000Z.dump 3491200

  #    ID        TAKEN              AGE              SIZE  STATUS
  1    a3f9c1d2  2026-10-07 14:00   2h ago         3.3 MB  uploaded  ← latest
  2    0f0f0f0f  2026-10-07 02:00   14h ago        3.3 MB  ✔ restore-tested 2026-10-07
  3    9bb21c07  2026-10-06 14:00   1d ago         3.2 MB  uploaded
```

Times are shown in your local time zone. **ID** is a short, stable code for each backup. `test`, `restore` and `download` show this same table and ask which backup you want — press Enter for the latest, or pass the id (or file name) directly:

```bash
graft db myapp backup test 0f0f0f0f
graft db myapp backup download a3f9c1d2
```

## Testing a backup: `test`

```bash
graft db myapp backup test
graft db myapp backup test --inspect     # open psql on the restored copy
```

A test restores the backup into a **throwaway Postgres container** (same image, no network, deleted afterwards) and runs seven checks. Every check is printed and written to the log.

| # | Check |
|---|---|
| 1 | The download's size matches the bucket's. |
| 2 | The file has the PostgreSQL archive signature and a readable table of contents. |
| 3 | A strict `pg_restore` into the throwaway database finishes with zero errors. |
| 4 | The restored tables are compared with the live database. |
| 5 | Row counts per table, backup vs live — showing rows written since the backup. |
| 6 | Freshness: how old the backup is, whether newer ones exist, and the newest `created_at`/`updated_at` per table. |
| 7 | Every index is valid and `ANALYZE` runs cleanly. |

Any failure marks the backup **not safe** and nothing is recorded. Warnings (for example "24 rows were written after this backup") are shown but do not fail the test. A backup that passes is marked `✔ restore-tested` in `list`.

With `--inspect`, a psql session opens on the restored copy so you can look around; the test database is deleted when you quit.

:::tip
Run `test` regularly, for example weekly. A backup that has never been restored is only a hope.
:::

## Restoring: `restore`

```bash
graft db myapp backup restore
```

1. Choose a backup from the table.
2. Graft **verifies it first** with the seven checks above — unless it passed a test in the last 30 minutes. If verification fails, the live database is not touched.
3. You review the result and type the database name to confirm.
4. A **safety backup** of the current data is taken and uploaded.
5. The backup is restored in a **single transaction**: if anything fails, everything rolls back and the live database is unchanged.
6. The live row counts are compared with the verified copy.

:::caution
A restore **replaces** the live database. Rows written after the backup are lost (the warnings in step 2 tell you how many). Stop services that write to the database first, or their writes may block or be lost. The safety backup in step 4 lets you undo the restore.
:::

## Download links: `download`

```bash
graft db myapp backup download                  # link valid for 1 hour
graft db myapp backup download -expires 24h
graft db myapp backup download a3f9c1d2 -expires 7d
```

Prints a signed R2/S3 link you can open in a browser or use with `curl -o backup.dump "<link>"`. Links last from 1 minute to 7 days. Anyone with the link can download that file until it expires, so treat it like a password.

Restore a downloaded file on your own machine with:

```bash
pg_restore -d <local-db> --no-owner myapp_20261007T080000Z.dump
```

## Pruning: `prune`

```bash
graft db myapp backup prune          # delete backups older than the retention period
graft db myapp backup prune a3f9c1d2 # keep ONLY this one
```

- **`prune`** removes backups older than the retention period (7 days by default). It never deletes the last remaining backup. It also runs automatically after every successful backup, so you do not have to run it yourself. If backups start failing, pruning stops too, so old backups are kept rather than deleted.
- **`prune <id>`** keeps the backup you name and deletes **every other backup, however recent**. Use it once you have tested a version and trust it. It only works on a backup that has passed `test`, shows exactly what will be kept and deleted, and asks you to type the id to confirm.

:::note
`prune <id>` does not protect the backup you keep. Once it is older than the retention period, a regular `prune` removes it like any other. Download it first if you need to keep it longer.
:::

## Alerts: `alert`

```bash
graft db myapp backup alert
```

1. In Telegram, message **@BotFather**, send `/newbot` and paste the token it gives you.
2. Send your new bot any message (for a group, add the bot first).
3. Graft finds your chat id from that message and sends a test message.

You are alerted when:

- a scheduled backup fails,
- no backup has succeeded for more than two intervals (checked every hour; at most one alert a day), which catches cron stopping or keys expiring,
- a restore or `prune <id>` runs.

Leave the token blank in `alert` to turn alerts off. The server needs `curl` and access to `api.telegram.org`.

## Where things live

On the server, in `/opt/graft/infra/backup/`:

| File | Purpose |
|---|---|
| `graft-backup.sh` | The script cron and the commands run. Re-uploaded by every command. |
| `<name>.env` | Bucket, keys, retention and schedule (mode 600). |
| `<name>.telegram` | Telegram bot token and chat id (mode 600), kept apart from the R2 keys. |
| `<name>.log` | The log shown by `backup log`. |
| `<name>.status` | The result of the last backup, shown by `list`. |
| `backup.log` | Raw output of the cron job. |

In the bucket: `backups/<name>/<name>_<UTC timestamp>.dump`.

## Storage cost

Every backup is a full copy, so storage is roughly **backups per day × retention days × size of one backup**. Hourly backups kept for 7 days is 168 files; every 12 hours is 14. Backup size is typically about a quarter of the database's size on disk. R2 charges for storage but not for download bandwidth, and the request volume of a backup schedule is negligible.

To keep costs down, back up less often, keep fewer days, or move old audit and log data out of the database.

## Related

- [Shared Postgres/Redis](/commands/infrastructure/) — `graft db <name> init` and `serve`
- [Psql Passthrough](/commands/psql/)
