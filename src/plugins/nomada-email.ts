/**
 * NÓMADA email transport.
 *
 * System emails bypass `email:beforeSend`, so branding has to happen in the
 * exclusive `email:deliver` hook. This plugin recomposes every message with
 * the NÓMADA template and delegates delivery to the official Cloudflare
 * Email Sending handler (`send_email` binding).
 */
import { fileURLToPath } from "node:url";
import {
  type CloudflareEmailConfig,
  createCloudflareEmailDeliver,
} from "@emdash-cms/cloudflare/plugins/cloudflare-email";
import {
  definePlugin,
  type PluginDescriptor,
  type ResolvedPlugin,
} from "emdash";
import { type EmailBrand, renderNomadaEmail } from "./nomada-email-template";

export interface NomadaEmailConfig extends CloudflareEmailConfig {
  brand: EmailBrand;
}

const PLUGIN_ID = "nomada-email";
const PLUGIN_VERSION = "1.0.0";
const CAPABILITIES = ["hooks.email-transport:register"] as const;

/** Called by the generated `virtual:emdash/plugins` module at build time. */
export function createPlugin(config: NomadaEmailConfig): ResolvedPlugin {
  const { brand, ...transport } = config;
  const deliver = createCloudflareEmailDeliver(transport);

  return definePlugin({
    id: PLUGIN_ID,
    version: PLUGIN_VERSION,
    capabilities: [...CAPABILITIES],
    hooks: {
      "email:deliver": {
        exclusive: true,
        handler: (event, ctx) =>
          deliver(
            { ...event, message: renderNomadaEmail(event.message, brand) },
            ctx,
          ),
      },
    },
  });
}

/** Descriptor for the `plugins` array of the emdash() integration. */
export function nomadaEmail(
  config: NomadaEmailConfig,
): PluginDescriptor<NomadaEmailConfig> {
  return {
    id: PLUGIN_ID,
    version: PLUGIN_VERSION,
    // Absolute path with forward slashes so Vite can bundle it on Windows too.
    entrypoint: fileURLToPath(import.meta.url).replaceAll("\\", "/"),
    format: "native",
    options: config,
    capabilities: [...CAPABILITIES],
  };
}
