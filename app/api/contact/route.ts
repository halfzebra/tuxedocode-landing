import { checkBotId } from "botid/server";
import { NextRequest, NextResponse } from "next/server";

import { mailer, CONTACT_MAILBOX } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: unknown;
  company?: unknown;
  email?: unknown;
  message?: unknown;
};

function validate(body: ContactBody) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || name.length > 200) {
    return { error: "Please enter your name." };
  }
  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!message || message.length > 5000) {
    return { error: "Please enter a message (up to 5000 characters)." };
  }
  if (company.length > 200) {
    return { error: "Company name is too long." };
  }

  return { data: { name, company, email, message } };
}

export async function POST(request: NextRequest) {
  const verification = await checkBotId();

  if (verification.isBot) {
    return NextResponse.json({ error: "Access denied." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as ContactBody | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = validate(body);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const { name, company, email, message } = result.data;

  try {
    await mailer.sendMail({
      from: `Tuxedo Code Website <${CONTACT_MAILBOX}>`,
      to: CONTACT_MAILBOX,
      replyTo: email,
      subject: `New message from ${name}${company ? ` (${company})` : ""}`,
      text: [
        `Name: ${name}`,
        company ? `Company: ${company}` : null,
        `Email: ${email}`,
        "",
        message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
  } catch {
    return NextResponse.json(
      { error: "Could not send your message. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
