import { readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

test("reuses the pose query across the library and practice log", async ({ page }, testInfo) => {
  const logPath = testInfo.config.metadata.poseCacheLog as string;
  const queryCount = () =>
    readFileSync(logPath, "utf8").split("[poses] DB query").length - 1;

  await page.goto("/poses");
  await expect(page.getByText("Child Pose", { exact: true })).toBeVisible();
  expect(queryCount()).toBe(1);

  await page.goto("/log");
  await page.getByRole("button", { name: "+ New Log", exact: true }).click();
  await page.getByRole("button", { name: "Select peak pose", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Select Child Pose", exact: true }),
  ).toBeVisible();
  expect(queryCount()).toBe(1);
});
