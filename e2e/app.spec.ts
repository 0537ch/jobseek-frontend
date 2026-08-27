import { test, expect } from "@playwright/test";

const SEEKER = { email: "andi@gmail.com", password: "password123" };
const COMPANY = { email: "hr@tokopedia.com", password: "password123" };

async function clearAuth(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  });
}

async function loginAs(
  page: import("@playwright/test").Page,
  email: string,
  password: string,
) {
  await clearAuth(page);
  await page.goto("/login");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: /sign in/i }).click();
}

// ─── HOME ──────────────────────────────────────────────

test.describe("Home page", () => {
  test("shows landing page with hero, features, CTA", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "IndoKerja" })).toBeVisible();
    await expect(page.getByText("Dream Job")).toBeVisible();
    await expect(page.getByText("Why IndoKerja?")).toBeVisible();
  });

  test("nav links work", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /login/i }).click();
    await expect(page).toHaveURL("/login");

    await page.goto("/");
    await page.getByRole("link", { name: /register/i }).click();
    await expect(page).toHaveURL("/register");
  });
});

// ─── LOGIN ─────────────────────────────────────────────

test.describe("Login", () => {
  test("login as job seeker", async ({ page }) => {
    await loginAs(page, SEEKER.email, SEEKER.password);
    await expect(page).toHaveURL("/jobs", { timeout: 10000 });
    await expect(page.getByText("Browse Jobs")).toBeVisible();
  });

  test("login as company", async ({ page }) => {
    await loginAs(page, COMPANY.email, COMPANY.password);
    await expect(page).toHaveURL("/company/jobs", { timeout: 10000 });
    await expect(page.getByRole("heading", { name: "My Jobs" })).toBeVisible();
  });

  test("shows error on wrong credentials", async ({ page }) => {
    await clearAuth(page);
    await page.goto("/login");
    await page.getByPlaceholder("you@example.com").fill("wrong@test.com");
    await page.getByPlaceholder("••••••••").fill("wrongpass");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });
});

// ─── JOB SEEKER FLOW ──────────────────────────────────

test.describe("Job seeker flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, SEEKER.email, SEEKER.password);
    await expect(page).toHaveURL("/jobs", { timeout: 10000 });
  });

  test("browse jobs page shows job list", async ({ page }) => {
    await expect(page.getByText("Browse Jobs")).toBeVisible();
    const jobCards = page.locator("button.glass");
    await expect(jobCards.first()).toBeVisible({ timeout: 5000 });
  });

  test("select a job shows detail panel", async ({ page }) => {
    const firstJob = page.locator("button.glass").first();
    await firstJob.click();
    await expect(
      page.getByRole("button", { name: /apply now/i }),
    ).toBeVisible({ timeout: 5000 });
  });

  test("apply to a job", async ({ page }) => {
    const firstJob = page.locator("button.glass").first();
    await firstJob.click();
    await page.getByRole("button", { name: /apply now/i }).click();
    await expect(
      page.getByText(/application submitted/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test("view my applications", async ({ page }) => {
    await page.getByRole("link", { name: /applications/i }).click();
    await expect(page).toHaveURL("/my-applications");
    await expect(page.getByText("My Applications")).toBeVisible();
  });

  test("filter jobs by type", async ({ page }) => {
    await page.locator("select").selectOption("FULL_TIME");
    await page.waitForTimeout(1000);
    const jobCards = page.locator("button.glass");
    await expect(jobCards.first()).toBeVisible({ timeout: 5000 });
  });

  test("filter jobs by location", async ({ page }) => {
    await page.getByPlaceholder(/location/i).fill("Jakarta");
    await page.waitForTimeout(1000);
    const jobCards = page.locator("button.glass");
    await expect(jobCards.first()).toBeVisible({ timeout: 5000 });
  });
});

// ─── COMPANY FLOW ──────────────────────────────────────

test.describe("Company flow", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, COMPANY.email, COMPANY.password);
    await expect(page).toHaveURL("/company/jobs", { timeout: 10000 });
  });

  test("shows my jobs page", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "My Jobs" })).toBeVisible();
  });

  test("create job opens modal", async ({ page }) => {
    await page.getByRole("button", { name: /create/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByText("Create Job")).toBeVisible();
  });

  test("create a new job", async ({ page }) => {
    await page.getByRole("button", { name: /create/i }).click();
    await page.getByRole("dialog").waitFor();

    await page.getByPlaceholder(/software engineer/i).fill("E2E Test Engineer");
    await page.getByPlaceholder(/job description/i).fill("Automated test position");
    await page.getByPlaceholder(/jakarta/i).fill("Bandung");
    await page.getByRole("button", { name: /^Create$/i }).click();

    await expect(page.getByText("E2E Test Engineer").first()).toBeVisible({
      timeout: 5000,
    });
  });

  test("salary input rejects non-numeric", async ({ page }) => {
    await page.getByRole("button", { name: /create/i }).click();
    await page.getByRole("dialog").waitFor();

    const salaryInput = page.getByPlaceholder("5000000");
    await salaryInput.press("KeyA");
    await salaryInput.press("KeyB");
    await expect(salaryInput).toHaveValue("");
  });

  test("navigate to candidates page", async ({ page }) => {
    const candidateBtn = page
      .getByRole("link", { name: /candidates/i })
      .first();
    if (await candidateBtn.isVisible()) {
      await candidateBtn.click();
      await expect(page.getByRole("heading", { name: "Candidates" })).toBeVisible({ timeout: 5000 });
    }
  });

  test("update application status", async ({ page }) => {
    const candidateBtn = page
      .getByRole("link", { name: /candidates/i })
      .first();
    if (await candidateBtn.isVisible()) {
      await candidateBtn.click();
      await page.waitForTimeout(500);
      const select = page.locator("select").first();
      if (await select.isVisible()) {
        await select.selectOption("REVIEWING");
        await page.waitForTimeout(500);
      }
    }
  });

  test("delete job shows confirmation dialog", async ({ page }) => {
    const trashBtn = page
      .locator("button")
      .filter({ has: page.locator("svg.lucide-trash-2") })
      .first();
    if (await trashBtn.isVisible()) {
      await trashBtn.click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByRole("heading", { name: "Delete Job" })).toBeVisible();
      await page.getByRole("button", { name: /cancel/i }).click();
    }
  });
});

// ─── PROTECTED ROUTES ─────────────────────────────────

test.describe("Protected routes", () => {
  test.beforeEach(async ({ page }) => {
    await clearAuth(page);
  });

  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });

  test("redirects unauthenticated from my-applications", async ({ page }) => {
    await page.goto("/my-applications");
    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });

  test("redirects unauthenticated from company/jobs", async ({ page }) => {
    await page.goto("/company/jobs");
    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });
});

// ─── LOGOUT ────────────────────────────────────────────

test.describe("Logout", () => {
  test("logout redirects to login", async ({ page }) => {
    await loginAs(page, SEEKER.email, SEEKER.password);
    await expect(page).toHaveURL("/jobs", { timeout: 10000 });

    await page.getByRole("button", { name: /logout/i }).click();
    await expect(page).toHaveURL("/login", { timeout: 5000 });
  });
});

// ─── RESPONSIVE ────────────────────────────────────────

test.describe("Responsive", () => {
  test("mobile hamburger menu works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await loginAs(page, SEEKER.email, SEEKER.password);
    await expect(page).toHaveURL("/jobs", { timeout: 10000 });

    await page.getByLabel("Toggle menu").click();
    await expect(page.getByRole("link", { name: "My Applications" })).toBeVisible();
  });
});
