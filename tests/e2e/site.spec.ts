import { expect, test } from '@playwright/test';

const ROUTES = [
  '/',
  '/puppies',
  '/gone-home',
  '/happy-families',
  '/how-it-works',
  '/faq',
  '/contact',
  '/puppies/maltipoo-max-male',
  '/puppies/maltipoo-mia-girl',
];

for (const route of ROUTES)
  test(`${route} renders cleanly without sideways scroll`, async ({ page }) => {
    const problems: string[] = [];
    page.on('console', (m) => m.type() === 'error' && problems.push(m.text()));
    page.on('pageerror', (e) => problems.push(e.message));
    const response = await page.goto(route, { waitUntil: 'networkidle' });
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    expect(problems).toEqual([]);
  });

test('unknown pages and puppies are 404s', async ({ request }) => {
  expect((await request.get('/nope')).status()).toBe(404);
  expect((await request.get('/puppies/nope')).status()).toBe(404);
});

test('navigates through the page curtain', async ({ page, isMobile }) => {
  await page.goto('/');
  if (isMobile) {
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'FAQ' }).click();
  } else await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'FAQ' }).click();
  await expect(page).toHaveURL('/faq');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Questions & answers');
  await expect(page.locator('.tp-curtain')).toHaveAttribute('data-state', 'idle');
  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect(page.locator('.tp-curtain')).toHaveAttribute('data-state', 'idle');
});

test('footer delivery link lands on its section', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'Delivery' }).click();
  await expect(page).toHaveURL('/how-it-works#delivery');
  await expect(page.locator('#delivery-title')).toBeInViewport();
});

test('filters puppies and keeps them in the URL', async ({ page }) => {
  await page.goto('/puppies');
  await page.getByRole('button', { name: 'Shih Tzu' }).click();
  await expect(page).toHaveURL('/puppies?breed=shih-tzu');
  await expect(page.getByText('2 puppies match')).toBeVisible();
  await page.reload();
  await expect(page.locator('.tp-sketches > li')).toHaveCount(2);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.tp-sketches > li')).toHaveCount(15);
});

test('offers help when nothing matches', async ({ page }) => {
  await page.goto('/puppies?origin=local');
  await page.getByRole('button', { name: 'Show all puppies' }).click();
  await expect(page.locator('.tp-sketches > li')).toHaveCount(15);
});

test('opens a profile and turns the gallery', async ({ page }) => {
  await page.goto('/puppies');
  await page.getByRole('link', { name: /^Max, Maltipoo/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Max');
  await page.getByRole('button', { name: 'Next photo' }).click();
  await expect(page.locator('.tp-storypage video')).toBeVisible();
  await page.getByRole('button', { name: 'Open Max, video 2 of 2 full screen' }).click();
  await expect(page.getByRole('dialog', { name: 'Max photos' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Max photos' })).toBeHidden();
});

test('photo wall opens, moves and closes', async ({ page }) => {
  await page.goto('/happy-families');
  await page.getByRole('button', { name: 'Open photo 1 of 64' }).click();
  const viewer = page.getByRole('dialog', { name: 'Photo viewer' });
  await expect(viewer.getByText(/^1 \/ 64/)).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(viewer.getByText(/^2 \/ 64/)).toBeVisible();
  await viewer.getByRole('button', { name: 'Previous' }).click();
  await viewer.getByRole('button', { name: 'Previous' }).click();
  await expect(viewer.getByText(/^64 \/ 64/)).toBeVisible();
  await viewer.getByRole('button', { name: 'Close' }).click();
  await expect(viewer).toBeHidden();
});

test('FAQ notes unfold and can be searched', async ({ page }) => {
  await page.goto('/faq');
  const question = page.getByRole('button', { name: 'Do you deliver?' });
  await question.click();
  await expect(question).toHaveAttribute('aria-expanded', 'true');
  await page.getByLabel('sniff out a question').fill('vaccinated');
  await expect(page.getByText('1 note found')).toBeVisible();
  await expect(page.locator('mark').first()).toBeVisible();
  await page.getByLabel('sniff out a question').fill('zebra');
  await expect(page.getByText('No note about “zebra” yet.')).toBeVisible();
});

test('journey tabs work with mouse and keyboard', async ({ page }) => {
  await page.goto('/how-it-works');
  await page.getByRole('tab', { name: /Imported/ }).click();
  await expect(page.getByRole('heading', { name: 'Order upon request' })).toBeVisible();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('heading', { name: 'Meet your puppy in person' })).toBeVisible();
});

test('letter form validates, then posts', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Post my letter' }).click();
  await expect(page.locator('.tp-letterform__alert')).toContainText('Please tell us your name.');
  await expect(page.getByLabel('Your name (required)')).toBeFocused();
  await page.getByLabel('Your name (required)').fill('Aisha');
  await page.getByLabel(/Phone or WhatsApp/).fill('+971 50 123 4567');
  await page.getByRole('button', { name: 'Post my letter' }).click();
  await expect(page.getByText('Message received!')).toBeVisible({ timeout: 8000 });
});

test('profile enquiry keeps what was typed when validation fails', async ({ page }) => {
  await page.goto('/puppies/maltipoo-max-male');
  const form = page.locator('form');
  await form.getByLabel(/Your name/).fill('Aisha');
  await form.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(form.getByText(/Please add a phone number/)).toBeVisible();
  await expect(form.getByLabel(/Your name/)).toHaveValue('Aisha');
  await form.getByLabel(/Phone or WhatsApp/).fill('+971501234567');
  await form.getByRole('button', { name: 'Send enquiry' }).click();
  await expect(page.getByText('Message received!')).toBeVisible();
});

test('Teddy travels from the quilt to the basket', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const actor = page.locator('.pup-actor');
  await expect(actor).toBeVisible();
  const before = await actor.getAttribute('style');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1500);
  expect(await actor.getAttribute('style')).not.toBe(before);
  await expect(page.locator('.pup-actor__body svg')).toBeInViewport();
});

test('reduced motion shows everything without the travelling Teddy', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.pup-layer')).toBeHidden();
  await expect(page.locator('.tp-hero__teddy svg')).toBeVisible();
  await expect(page.locator('.tp-door[data-open="false"]')).toHaveCount(0);
});
