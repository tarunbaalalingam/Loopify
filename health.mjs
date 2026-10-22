import { neon } from "@neondatabase/serverless";

export default async () => {
  try {
    const databaseUrl = Netlify.env.get("DATABASE_URL");
    if (!databaseUrl) {
      return Response.json(
        { ok: false, error: "DATABASE_URL is not configured in Netlify environment variables." },
        { status: 500 }
      );
    }
    const sql = neon(databaseUrl);
    const rows = await sql`SELECT NOW() AS database_time`;
    return Response.json({
      ok: true,
      message: "Loopify can connect to Neon.",
      databaseTime: rows[0].database_time
    });
  } catch (error) {
    console.error("Neon health check failed:", error);
    return Response.json(
      { ok: false, error: "Database connection failed. Check function logs and DATABASE_URL." },
      { status: 500 }
    );
  }
};