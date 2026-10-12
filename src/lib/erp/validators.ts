import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable()
  .optional();

const centsSchema = z.coerce
  .number()
  .int()
  .min(0)
  .nullable()
  .optional()
  .transform((v) => (v === undefined ? undefined : v));

export const customerStatusSchema = z.enum(["active", "inactive", "archived"]);
export const assetKindSchema = z.enum(["domain", "server", "hosting", "other"]);
export const billingStatusSchema = z.enum(["unbilled", "billed", "paid"]);
export const paymentMethodSchema = z.enum(["bank", "cash", "card", "paypal", "other"]);

export const customerInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  phone: optionalText,
  vatNumber: optionalText,
  notes: optionalText,
  status: customerStatusSchema.default("active"),
  defaultHourlyRateCents: centsSchema,
  currency: z.string().trim().min(3).max(3).default("EUR"),
});

export const assetInputSchema = z.object({
  customerId: z.string().uuid(),
  kind: assetKindSchema,
  label: z.string().trim().min(1).max(300),
  provider: optionalText,
  expiresOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : null)),
  renewalPriceCents: centsSchema,
  autoRenew: z.coerce.boolean().default(false),
  notes: optionalText,
});

export const timeEntryInputSchema = z
  .object({
    customerId: z.string().uuid(),
    workDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    hours: z.coerce.number().min(0).nullable().optional(),
    amountCents: centsSchema,
    description: optionalText,
    billingStatus: billingStatusSchema.default("unbilled"),
  })
  .refine(
    (data) =>
      (data.hours !== null && data.hours !== undefined) ||
      (data.amountCents !== null && data.amountCents !== undefined),
    { message: "Provide hours, amount, or both." },
  );

export const paymentInputSchema = z.object({
  customerId: z.string().uuid(),
  amountCents: z.coerce.number().int().min(0),
  currency: z.string().trim().min(3).max(3).default("EUR"),
  paidOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  method: paymentMethodSchema.nullable().optional(),
  reference: optionalText,
  note: optionalText,
});

export const uuidSchema = z.string().uuid();
