import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";

export type Module2AttemptRecord = {
  taskUid: string;
  status: string;
  success: boolean;
  lineItemCount: number;
  flashcardReviewReady: boolean;
  pdfHandoffReady: boolean;
  detail: string;
};

type StateRow = RowDataPacket & {
  firstSuccessAt: Date | null;
  ownerNotifiedAt: Date | null;
};

let pool: Pool | undefined;

function databasePool(): Pool {
  if (pool) return pool;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured for scheduled validation logging.");
  pool = mysql.createPool({ uri: databaseUrl, connectionLimit: 3, enableKeepAlive: true });
  return pool;
}

export async function recordModule2Attempt(record: Module2AttemptRecord): Promise<{ firstSuccess: boolean; ownerNeedsNotification: boolean }> {
  const connection = await databasePool().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.query<StateRow[]>(
      "SELECT first_success_at AS firstSuccessAt, owner_notified_at AS ownerNotifiedAt FROM module2_validation_state WHERE task_uid = ? FOR UPDATE",
      [record.taskUid],
    );
    const previous = rows[0];
    const firstSuccess = record.success && !previous?.firstSuccessAt;
    const ownerNeedsNotification = record.success && !previous?.ownerNotifiedAt;

    await connection.query(
      "INSERT INTO module2_validation_runs (task_uid, status, success, line_item_count, flashcard_review_ready, pdf_handoff_ready, detail) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [record.taskUid, record.status, record.success ? 1 : 0, record.lineItemCount, record.flashcardReviewReady ? 1 : 0, record.pdfHandoffReady ? 1 : 0, record.detail],
    );

    if (previous) {
      await connection.query(
        "UPDATE module2_validation_state SET first_success_at = CASE WHEN ? = 1 AND first_success_at IS NULL THEN NOW() ELSE first_success_at END, last_run_at = NOW(), last_outcome = ? WHERE task_uid = ?",
        [record.success ? 1 : 0, record.status, record.taskUid],
      );
    } else {
      await connection.query(
        "INSERT INTO module2_validation_state (task_uid, first_success_at, last_run_at, last_outcome) VALUES (?, CASE WHEN ? = 1 THEN NOW() ELSE NULL END, NOW(), ?)",
        [record.taskUid, record.success ? 1 : 0, record.status],
      );
    }

    await connection.commit();
    return { firstSuccess, ownerNeedsNotification };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function markModule2OwnerNotified(taskUid: string): Promise<void> {
  await databasePool().query("UPDATE module2_validation_state SET owner_notified_at = NOW() WHERE task_uid = ?", [taskUid]);
}

