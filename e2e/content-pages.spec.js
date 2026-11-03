import { test, expect, expectAccessible, freshStart } from './fixtures.js';

// Every button on the content and app pages does something visible.

const topOf = (locator) => locator.evaluate((el) => el.getBoundingClientRect().top);

const nearTop = (top) => top > -10 && top < 300;

/** Click `button` and expect the page to scroll so `target` sits near the top. */
const expectScrollsTo = async (button, target) => {
  // Start where the target is out of place: for a target above the button, put
  // the button at the top of the viewport; for one below it, park it just below the fold.
  const targetHandle = await target.elementHandle();
  await button.evaluate((el, t) => {
    const targetIsAbove = el.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING;
    if (targetIsAbove) el.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, window.scrollY + t.getBoundingClientRect().top - window.innerHeight + 1);
  }, targetHandle);
  expect(nearTop(await topOf(target)), 'target starts away from the top').toBe(false);
  await button.click();
  await expect.poll(async () => nearTop(await topOf(target)), { timeout: 5_000 }).toBe(true);
};

const expectNavigates = async (page, path, name, url) => {
  await freshStart(page, path);
  await page.locator('main').getByRole('button', { name, exact: true }).first().click();
  await expect(page).toHaveURL(url);
};

const expectSubscribe = async (page) => {
  const main = page.locator('main');
  const email = main.getByRole('textbox', { name: 'Email address' });
  const subscribe = main.getByRole('button', { name: 'Subscribe', exact: true });
  await email.fill('not-an-email');
  await subscribe.click();
  await expect(main.getByRole('status').filter({ hasText: 'valid email' })).toBeVisible();
  await email.fill('reader@example.com');
  await subscribe.click();
  await expect(main.getByRole('status').filter({ hasText: 'reader@example.com is subscribed' })).toBeVisible();
  await expect(email).toHaveValue('');
};

test.describe('/support', () => {
  test('search chips and categories filter the answers', async ({ page }) => {
    await freshStart(page, '/support');
    const main = page.locator('main');
    await main.getByRole('button', { name: 'payment problems' }).click();
    await expect(main.getByRole('textbox', { name: 'Search for help' })).toHaveValue('payment problems');
    await expect(main.getByText('How do I update my payment method?')).toBeVisible();
    await expect(main.getByText('Why is my audiobook not playing?')).toBeHidden();

    await main.getByRole('textbox', { name: 'Search for help' }).fill('zzzz');
    await expect(main.getByText('No answers match your search')).toBeVisible();
    await main.getByRole('textbox', { name: 'Search for help' }).fill('');

    const social = main.getByRole('button', { name: 'Social Features' });
    await social.click();
    await expect(social).toHaveAttribute('aria-pressed', 'true');
    await expect(main.getByText('How do I join a book club?')).toBeVisible();
    await expect(main.getByText('How do I update my payment method?')).toBeHidden();
    await expectAccessible(page);
  });

  for (const [name, url] of [
    ['View All FAQs', /\/faq$/],
    ['Start Chat', /\/contact$/],
    ['Send Email', /\/contact$/],
    ['Browse Guide', /\/faq$/],
    ['Join Discussion', /\/clubs$/],
  ]) {
    test(`${name} navigates`, async ({ page }) => {
      await expectNavigates(page, '/support', name, url);
    });
  }

  for (const [name, text] of [
    ['Call Now', 'Phone support is not available'],
    ['Watch Videos', 'Video tutorials are not available'],
    ['View Status', 'All systems operational'],
  ]) {
    test(`${name} shows a notice`, async ({ page }) => {
      await freshStart(page, '/support');
      await page.locator('main').getByRole('button', { name, exact: true }).click();
      await expect(page.locator('main').getByRole('status')).toContainText(text);
    });
  }
});

test.describe('/faq', () => {
  test('questions expand, search has an empty state and can be cleared', async ({ page }) => {
    await freshStart(page, '/faq');
    const main = page.locator('main');
    const question = main.getByRole('button', { name: 'What is Audible?' });
    await expect(question).toHaveAttribute('aria-expanded', 'false');
    await question.click();
    await expect(question).toHaveAttribute('aria-expanded', 'true');
    await expect(main.getByText('world\'s largest audio entertainment service')).toBeVisible();

    await main.getByRole('textbox', { name: 'Search FAQs' }).fill('zzzz');
    await expect(main.getByText('No FAQs match "zzzz"')).toBeVisible();
    await main.getByRole('button', { name: 'Clear Search' }).click();
    await expect(main.getByRole('textbox', { name: 'Search FAQs' })).toHaveValue('');
    await expectAccessible(page);
  });

  test('Contact Support navigates', async ({ page }) => {
    await expectNavigates(page, '/faq', 'Contact Support', /\/contact$/);
  });

  test('Visit Support Center navigates', async ({ page }) => {
    await expectNavigates(page, '/faq', 'Visit Support Center', /\/support$/);
  });
});

test.describe('/accessibility', () => {
  for (const [name, url] of [
    ['Learn more: Accessibility Settings', /\/settings$/],
    ['Learn more: Contact Accessibility Team', /\/contact$/],
    ['Contact Accessibility Team', /\/contact$/],
  ]) {
    test(`${name} navigates`, async ({ page }) => {
      await expectNavigates(page, '/accessibility', name, url);
    });
  }

  for (const name of ['Learn more: Supported Assistive Technologies', 'Learn more: Keyboard Shortcuts']) {
    test(`${name} scrolls to the features`, async ({ page }) => {
      await freshStart(page, '/accessibility');
      const button = page.locator('main').getByRole('button', { name, exact: true });
      await expectScrollsTo(button, page.locator('#accessibility-features'));
    });
  }

  test('Accessibility Resources scrolls to the resources', async ({ page }) => {
    await freshStart(page, '/accessibility');
    const button = page.locator('main').getByRole('button', { name: 'Accessibility Resources', exact: true });
    await expectScrollsTo(button, page.locator('#accessibility-resources'));
  });
});

test.describe('/careers', () => {
  test('View Positions shows the department openings', async ({ page }) => {
    await freshStart(page, '/careers');
    const main = page.locator('main');
    for (const [dept, openings] of [['Engineering', 12], ['Product', 8], ['Design', 6], ['Marketing', 10], ['Content', 15], ['Operations', 7]]) {
      await main.getByRole('button', { name: `View Positions: ${dept}` }).click();
      await expect(main.getByRole('status')).toContainText(`${dept}: ${openings} openings`);
    }
    await expectAccessible(page);
  });

  test('View All Openings scrolls to the departments', async ({ page }) => {
    await freshStart(page, '/careers');
    const button = page.locator('main').getByRole('button', { name: 'View All Openings' });
    await expectScrollsTo(button, page.locator('#open-positions'));
  });

  test('Learn More About Us navigates', async ({ page }) => {
    await expectNavigates(page, '/careers', 'Learn More About Us', /\/about$/);
  });
});

test.describe('/blog', () => {
  test('articles expand and collapse', async ({ page }) => {
    await freshStart(page, '/blog');
    const main = page.locator('main');
    const featured = main.getByRole('button', { name: 'Read Full Article' });
    await featured.click();
    const less = main.getByRole('button', { name: 'Show Less', exact: true });
    await expect(less).toHaveAttribute('aria-expanded', 'true');
    await expect(main.locator('#featured-article-body')).toBeVisible();
    await less.click();
    await expect(main.locator('#featured-article-body')).toBeHidden();

    const titles = [
      'Building Communities Through Shared Listening',
      'The Science of Perfect Audio Production',
      'Diversity in Storytelling: Voices That Matter',
      'Accessibility Innovation in Audio Technology',
    ];
    for (const [index, title] of titles.entries()) {
      await main.getByRole('button', { name: `Read more: ${title}` }).click();
      await expect(main.locator(`#post-body-${index}`)).toBeVisible();
      await expect(main.getByRole('button', { name: `Show less: ${title}` })).toHaveAttribute('aria-expanded', 'true');
    }
    await expectAccessible(page);
  });

  test('View All Posts shows a notice', async ({ page }) => {
    await freshStart(page, '/blog');
    await page.locator('main').getByRole('button', { name: 'View All Posts' }).click();
    await expect(page.locator('main').getByRole('status').filter({ hasText: 'All 4 recent posts' })).toBeVisible();
  });

  test('newsletter validates and confirms', async ({ page }) => {
    await freshStart(page, '/blog');
    await expectSubscribe(page);
  });
});

test.describe('/press', () => {
  test('releases expand and media kit downloads explain the demo', async ({ page }) => {
    await freshStart(page, '/press');
    const main = page.locator('main');
    const releases = main.getByRole('button', { name: /^Read full release:/ });
    await expect(releases).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) {
      await releases.nth(index).click();
      await expect(main.locator(`#release-body-${index}`)).toBeVisible();
    }

    await main.getByRole('button', { name: 'View All Press Releases' }).click();
    await expect(main.getByRole('status').filter({ hasText: 'All 4 press releases' })).toBeVisible();

    for (const item of ['Company Logo (High Resolution)', 'Brand Guidelines', 'Product Screenshots', 'Executive Photos', 'Press Release Template']) {
      await main.getByRole('button', { name: `Download ${item}` }).click();
      await expect(main.getByRole('status').filter({ hasText: `${item} is not available` })).toBeVisible();
    }
    await expectAccessible(page);
  });

  test('newsletter validates and confirms', async ({ page }) => {
    await freshStart(page, '/press');
    await expectSubscribe(page);
  });
});

const APP_PAGES = [
  { path: '/apps/ios', platform: 'iOS', download: 'Download on the App Store', requirements: 'View System Requirements' },
  { path: '/apps/android', platform: 'Android', download: 'Get it on Google Play', requirements: 'System Requirements' },
];

for (const { path, platform, download, requirements } of APP_PAGES) {
  test.describe(path, () => {
    test('both download buttons explain the demo', async ({ page }) => {
      await freshStart(page, path);
      const main = page.locator('main');
      const notices = main.getByRole('status').filter({ hasText: `no ${platform} app to download` });
      const buttons = main.getByRole('button', { name: download, exact: true });
      await expect(buttons).toHaveCount(2);
      await buttons.first().click();
      await expect(notices).toHaveCount(1);
      await buttons.last().click();
      await expect(notices).toHaveCount(2);
      await expectAccessible(page);
    });

    test('Learn More scrolls to the features', async ({ page }) => {
      await freshStart(page, path);
      await expectScrollsTo(page.locator('main').getByRole('button', { name: 'Learn More', exact: true }), page.locator('#app-features'));
    });

    test(`${requirements} scrolls to the requirements`, async ({ page }) => {
      await freshStart(page, path);
      const button = page.locator('main').getByRole('button', { name: requirements, exact: true });
      await expectScrollsTo(button, page.locator('#system-requirements'));
    });
  });
}

test('/apps/ios View Full Privacy Policy navigates', async ({ page }) => {
  await expectNavigates(page, '/apps/ios', 'View Full Privacy Policy', /\/privacy$/);
});

test.describe('/apps/desktop', () => {
  test('every download button explains the demo', async ({ page }) => {
    await freshStart(page, '/apps/desktop');
    const main = page.locator('main');
    await main.getByRole('button', { name: 'Download for Your Platform' }).click();
    await expect(main.getByRole('status').filter({ hasText: 'no desktop app to download' })).toHaveCount(1);
    for (const platform of ['Windows', 'macOS', 'Linux']) {
      await main.getByRole('button', { name: `Download for ${platform}` }).click();
      await expect(main.getByRole('status').filter({ hasText: `no ${platform} app to download` })).toBeVisible();
    }
    await main.getByRole('button', { name: 'Download Now' }).click();
    await expect(main.getByRole('status').filter({ hasText: 'no desktop app to download' })).toHaveCount(2);
    await expectAccessible(page);
  });

  test('System Requirements scrolls to the table', async ({ page }) => {
    await freshStart(page, '/apps/desktop');
    await expectScrollsTo(page.locator('main').getByRole('button', { name: 'System Requirements', exact: true }), page.locator('#system-requirements'));
  });

  test('View All Platforms scrolls to the platforms', async ({ page }) => {
    await freshStart(page, '/apps/desktop');
    const button = page.locator('main').getByRole('button', { name: 'View All Platforms' });
    await expectScrollsTo(button, page.locator('#platforms'));
  });
});
