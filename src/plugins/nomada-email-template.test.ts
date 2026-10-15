import { describe, expect, it } from "vitest";
import {
  classifyEmail,
  type EmailMessageInput,
  extractExpiry,
  renderNomadaEmail,
} from "./nomada-email-template";

const brand = {
  siteName: "NÓMADA",
  siteUrl: "https://nomadarestaurantectg.com",
  logoUrl: "https://nomadarestaurantectg.com/images/email-logo.png",
  location: "Cartagena de Indias, Colombia",
};

const BASE = "https://nomadarestaurantectg.com";

// Bodies copied from @emdash-cms/auth (magic-link, invite, signup) and the settings test route.
const magicLink: EmailMessageInput = {
  to: "a@b.co",
  subject: "Sign in to NÓMADA",
  text: `Click this link to sign in to NÓMADA:\n\n${BASE}/_emdash/api/auth/magic-link/verify?token=abc&redirect=%2F_emdash%2Fadmin\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
  html: '<h1>Sign in to NÓMADA</h1><a style="background-color: #0066cc">Sign in</a>',
};

const invite: EmailMessageInput = {
  to: "a@b.co",
  subject: "You've been invited to NÓMADA",
  text: `You've been invited to join NÓMADA.\n\nClick this link to create your account:\n${BASE}/_emdash/admin/invite/accept?token=xyz\n\nThis link expires in 7 days.`,
  html: "<p>light</p>",
};

const signup: EmailMessageInput = {
  to: "a@b.co",
  subject: "Verify your email for NÓMADA",
  text: `Click this link to verify your email and create your account:\n\n${BASE}/_emdash/admin/signup?token=t1\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, you can safely ignore this email.`,
  html: "<p>light</p>",
};

const testEmail: EmailMessageInput = {
  to: "a@b.co",
  subject: "Test email from NÓMADA",
  text: "This is a test email from NÓMADA.\n\nIf you received this, your email provider is working correctly.",
};

describe("classifyEmail", () => {
  it("classifies by link path", () => {
    expect(classifyEmail(magicLink)).toBe("sign-in");
    expect(classifyEmail(invite)).toBe("invite");
    expect(classifyEmail(signup)).toBe("signup");
    expect(classifyEmail(testEmail)).toBe("test");
  });

  it("does not depend on the copy language", () => {
    const localized = {
      ...magicLink,
      subject: "Inicia sesión",
      text: magicLink.text.replace("Click this link", "Haz clic"),
    };
    expect(classifyEmail(localized)).toBe("sign-in");
  });

  it("falls back for unknown messages", () => {
    expect(
      classifyEmail({ to: "a@b.co", subject: "Hola", text: "Sin enlace" }),
    ).toBe("other");
  });
});

describe("extractExpiry", () => {
  it("reads English and Spanish durations", () => {
    expect(extractExpiry("This link expires in 15 minutes.")).toBe(
      "15 minutos",
    );
    expect(extractExpiry("This link expires in 7 days.")).toBe("7 días");
    expect(extractExpiry("El enlace vence en 1 hora.")).toBe("1 hora");
    expect(extractExpiry("no expiry")).toBeUndefined();
  });
});

describe("renderNomadaEmail", () => {
  it("never embeds the incoming EmDash HTML", () => {
    const out = renderNomadaEmail(magicLink, brand);
    expect(out.html).not.toContain("#0066cc");
    expect(out.html).not.toContain("Sign in");
    expect(out.html.match(/<h1/g)).toHaveLength(1);
  });

  it("renders Spanish sign-in copy with one button and a fallback link", () => {
    const out = renderNomadaEmail(magicLink, brand);
    expect(out.subject).toBe("Inicia sesión en NÓMADA");
    expect(out.html).toContain("Iniciar sesión");
    expect(out.html).toContain("El enlace vence en 15 minutos.");
    expect(out.html).toContain(
      "verify?token=abc&amp;redirect=%2F_emdash%2Fadmin",
    );
    expect(out.html.match(/>Iniciar sesión<\/a>/g)).toHaveLength(1);
    expect(out.text).toContain(
      `${BASE}/_emdash/api/auth/magic-link/verify?token=abc&redirect=%2F_emdash%2Fadmin`,
    );
    expect(out.text).not.toMatch(/Click|expires/);
  });

  it("renders invite, signup and test copy", () => {
    expect(renderNomadaEmail(invite, brand).subject).toBe(
      "Te invitaron a NÓMADA",
    );
    expect(renderNomadaEmail(invite, brand).html).toContain(
      "El enlace vence en 7 días.",
    );
    expect(renderNomadaEmail(signup, brand).subject).toBe(
      "Confirma tu correo en NÓMADA",
    );
    const test = renderNomadaEmail(testEmail, brand);
    expect(test.subject).toBe("Correo de prueba de NÓMADA");
    expect(test.html).not.toContain('<a href="undefined"');
  });

  it("keeps recipients and escapes fallback content", () => {
    const out = renderNomadaEmail(
      {
        to: "x@y.co",
        replyTo: "r@y.co",
        subject: "<b>Aviso</b>",
        text: "Hola <script>\n\nVer https://example.com/a?b=1&c=2",
      },
      brand,
    );
    expect(out.to).toBe("x@y.co");
    expect(out.replyTo).toBe("r@y.co");
    expect(out.html).not.toContain("<script>");
    expect(out.html).toContain("&lt;b&gt;Aviso&lt;/b&gt;");
    expect(out.html).toContain('href="https://example.com/a?b=1&amp;c=2"');
  });

  it("uses the opaque PNG logo and brand colors", () => {
    const out = renderNomadaEmail(magicLink, brand);
    expect(out.html).toContain(brand.logoUrl);
    expect(out.html).toContain("#c9a84c");
    expect(out.html).toContain('lang="es"');
  });
});
