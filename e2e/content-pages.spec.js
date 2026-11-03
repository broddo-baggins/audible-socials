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

/** A button or link in <main>: a string matches its whole name, a RegExp as given. */
const control = (page, name) => {
  const main = page.locator('main');
  const opts = typeof name === 'string' ? { name, exact: true } : { name };
  return main.getByRole('button', opts).or(main.getByRole('link', opts)).first();
};

const expectNavigates = async (page, path, name, url) => {
  await freshStart(page, path);
  await control(page, name).click();
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
    await expect(main.getByRole('searchbox', { name: 'Search for help' })).toHaveValue('payment problems');
    await expect(main.getByText('How do I update my payment method?')).toBeVisible();
    await expect(main.getByText('Why is my audiobook not playing?')).toBeHidden();

    await main.getByRole('searchbox', { name: 'Search for help' }).fill('zzzz');
    await expect(main.getByText('No answers match that yet')).toBeVisible();
    await main.getByRole('searchbox', { name: 'Search for help' }).fill('');

    const social = main.getByRole('button', { name: 'Social features' });
    await social.click();
    await expect(social).toHaveAttribute('aria-pressed', 'true');
    await expect(main.getByText('How do I join a book club?')).toBeVisible();
    await expect(main.getByText('How do I update my payment method?')).toBeHidden();
    await expectAccessible(page);
  });

  for (const [name, url] of [
    ['View all FAQs', /\/faq$/],
    ['Start chat', /\/contact$/],
    ['Send email', /\/contact$/],
    [/Browse guide$/, /\/faq$/],
    [/Join discussion$/, /\/clubs$/],
  ]) {
    test(`${name} navigates`, async ({ page }) => {
      await expectNavigates(page, '/support', name, url);
    });
  }

  for (const [name, text] of [
    ['Call now', 'Phone support is not available'],
    [/Watch videos$/, 'Video tutorials are not available'],
    [/View status$/, 'All systems operational'],
  ]) {
    test(`${name} shows a notice`, async ({ page }) => {
      await freshStart(page, '/support');
      await control(page, name).click();
      await expect(page.locator('main').getByRole('status').filter({ hasText: text })).toBeVisible();
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

    await main.getByRole('searchbox', { name: 'Search FAQs' }).fill('zzzz');
    await expect(main.getByText('Nothing matches "zzzz"')).toBeVisible();
    // The field's clear icon and the outline button share the name; either clears.
    await main.getByRole('button', { name: 'Clear search', exact: true }).last().click();
    await expect(main.getByRole('searchbox', { name: 'Search FAQs' })).toHaveValue('');
    await expectAccessible(page);
  });

  test('Contact support navigates', async ({ page }) => {
    await expectNavigates(page, '/faq', 'Contact support', /\/contact$/);
  });

  test('Visit support center navigates', async ({ page }) => {
    await expectNavigates(page, '/faq', 'Visit support center', /\/support$/);
  });
});

test.describe('/accessibility', () => {
  for (const [name, url] of [
    [/^Accessibility settings/, /\/settings$/],
    [/^Contact the accessibility team/, /\/contact$/],
    ['Contact the team', /\/contact$/],
  ]) {
    test(`${name} navigates`, async ({ page }) => {
      await expectNavigates(page, '/accessibility', name, url);
    });
  }

  for (const [name, target] of [
    [/^Supported assistive technologies/, '#accessibility-features'],
    [/^Keyboard shortcuts/, '#player'],
  ]) {
    test(`${name} scrolls to ${target}`, async ({ page }) => {
      await freshStart(page, '/accessibility');
      await expectScrollsTo(control(page, name), page.locator(target));
    });
  }
});

test.describe('/careers', () => {
  test('View positions shows the department openings', async ({ page }) => {
    await freshStart(page, '/careers');
    const main = page.locator('main');
    for (const [dept, openings] of [['Engineering', 12], ['Product', 8], ['Design', 6], ['Marketing', 10], ['Content', 15], ['Operations', 7]]) {
      await main.getByRole('button', { name: `View positions: ${dept}` }).click();
      await expect(main.getByRole('status')).toContainText(`${dept}: ${openings} openings`);
    }
    await expectAccessible(page);
  });

  for (const name of ['View all openings', 'See open roles']) {
    test(`${name} scrolls to the departments`, async ({ page }) => {
      await freshStart(page, '/careers');
      await expectScrollsTo(control(page, name), page.locator('#open-positions'));
    });
  }

  test('About us navigates', async ({ page }) => {
    await expectNavigates(page, '/careers', 'About us', /\/about$/);
  });
});

test.describe('/blog', () => {
  test('articles expand and collapse', async ({ page }) => {
    await freshStart(page, '/blog');
    const main = page.locator('main');
    const featured = main.getByRole('button', { name: 'Read full article' });
    await featured.click();
    const less = main.getByRole('button', { name: 'Show less', exact: true });
    await expect(less).toHaveAttribute('aria-expanded', 'true');
    await expect(main.locator('#featured-article-body')).toBeVisible();
    await less.click();
    await expect(main.locator('#featured-article-body')).toBeHidden();

    const titles = [
      'Building communities through shared listening',
      'The science of perfect audio production',
      'Diversity in storytelling: voices that matter',
      'Accessibility innovation in audio technology',
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
    await page.locator('main').getByRole('button', { name: 'View all posts' }).click();
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
    const releases = main.getByRole('button', { name: /^Read (full )?release:/ });
    await expect(releases).toHaveCount(4);
    for (let index = 0; index < 4; index += 1) {
      await releases.nth(index).click();
      await expect(main.locator(`#release-body-${index}`)).toBeVisible();
    }

    await main.getByRole('button', { name: 'View all press releases' }).click();
    await expect(main.getByRole('status').filter({ hasText: 'All 4 press releases' })).toBeVisible();

    for (const item of ['Company logo (high resolution)', 'Brand guidelines', 'Product screenshots', 'Executive photos', 'Press release template']) {
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
  { path: '/apps/ios', platform: 'iOS', download: 'Download on the App Store' },
  { path: '/apps/android', platform: 'Android', download: 'Get it on Google Play' },
];

for (const { path, platform, download } of APP_PAGES) {
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

    test('System requirements scrolls to the requirements', async ({ page }) => {
      await freshStart(page, path);
      await expectScrollsTo(control(page, 'System requirements'), page.locator('#system-requirements'));
    });
  });
}

test('/apps/ios View full privacy policy navigates', async ({ page }) => {
  await expectNavigates(page, '/apps/ios', 'View full privacy policy', /\/privacy$/);
});

test.describe('/apps/desktop', () => {
  test('every download button explains the demo', async ({ page }) => {
    await freshStart(page, '/apps/desktop');
    const main = page.locator('main');
    for (const platform of ['Windows', 'macOS', 'Linux']) {
      await main.getByRole('tab', { name: platform, exact: true }).click();
      await main.getByRole('tabpanel').getByRole('button', { name: `Download for ${platform}` }).click();
      await expect(main.getByRole('status').filter({ hasText: `no ${platform} app to download` })).toHaveCount(1);
    }
    // The closing block offers the selected platform too.
    await main.getByRole('button', { name: 'Download for Linux' }).last().click();
    await expect(main.getByRole('status').filter({ hasText: 'no Linux app to download' })).toHaveCount(2);
    await expectAccessible(page);
  });

  test('Full system requirements scrolls to the table', async ({ page }) => {
    await freshStart(page, '/apps/desktop');
    await expectScrollsTo(control(page, 'Full system requirements'), page.locator('#system-requirements'));
  });

  test('View All Platforms scrolls to the platforms', async ({ page }) => {
    await freshStart(page, '/apps/desktop');
    const button = page.locator('main').getByRole('button', { name: 'View all platforms' });
    await expectScrollsTo(button, page.locator('#platforms'));
  });
});
