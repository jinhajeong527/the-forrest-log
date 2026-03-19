"use server";

import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Prop } from "@/lib/generated/prisma/client";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const practiceLogSchema = z.object({
  date: z.string().refine((v) => !isNaN(Date.parse(v)), "Invalid date"),
  theme: z.string().optional(),
  peakPoseId: z.string().uuid().optional().or(z.literal("")),
  conditionBefore: z.coerce.number().int().min(1).max(5).optional(),
  conditionAfter: z.coerce.number().int().min(1).max(5).optional(),
  props: z.array(z.enum(Prop)).default([]),
  notes: z.string().optional(),
});

export type ActionState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user.id;
}

function parseFormData(formData: FormData) {
  return {
    date: formData.get("date") as string,
    theme: (formData.get("theme") as string) || undefined,
    peakPoseId: (formData.get("peakPoseId") as string) || undefined,
    conditionBefore: formData.get("conditionBefore") || undefined,
    conditionAfter: formData.get("conditionAfter") || undefined,
    props: formData.getAll("props"),
    notes: (formData.get("notes") as string) || undefined,
  };
}

function toNullableUuid(value?: string): string | null {
  return value && value.trim() !== "" ? value : null;
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function createPracticeLog(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getAuthenticatedUserId();

  const result = practiceLogSchema.safeParse(parseFormData(formData));
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  const { date, theme, peakPoseId, conditionBefore, conditionAfter, props, notes } =
    result.data;

  await prisma.practiceLog.create({
    data: {
      userId,
      date: new Date(date),
      theme: theme || null,
      peakPoseId: toNullableUuid(peakPoseId),
      conditionBefore: conditionBefore ?? null,
      conditionAfter: conditionAfter ?? null,
      props,
      notes: notes || null,
    },
  });

  return { success: true };
}

export async function updatePracticeLog(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const userId = await getAuthenticatedUserId();
  const id = formData.get("id") as string;

  const existing = await prisma.practiceLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) redirect("/log");

  const result = practiceLogSchema.safeParse(parseFormData(formData));
  if (!result.success) {
    return { errors: z.flattenError(result.error).fieldErrors };
  }

  const { date, theme, peakPoseId, conditionBefore, conditionAfter, props, notes } =
    result.data;

  await prisma.practiceLog.update({
    where: { id },
    data: {
      date: new Date(date),
      theme: theme || null,
      peakPoseId: toNullableUuid(peakPoseId),
      conditionBefore: conditionBefore ?? null,
      conditionAfter: conditionAfter ?? null,
      props,
      notes: notes || null,
    },
  });

  return { success: true };
}

export async function deletePracticeLog(id: string): Promise<void> {
  const userId = await getAuthenticatedUserId();

  const existing = await prisma.practiceLog.findUnique({ where: { id } });
  if (!existing || existing.userId !== userId) return;

  await prisma.practiceLog.delete({ where: { id } });
}
