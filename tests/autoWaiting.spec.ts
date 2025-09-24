import { expect, test } from '@playwright/test'


test.beforeEach(async ({ page }) => {
    await page.goto('http://uitestingplayground.com/ajax');
});

test('alternative waits', async ({ page }) => { 
    //needs to change timeout on config
    await page.waitForResponse('http://uitestingplayground.com/ajaxdata')
})

test('timeouts', async ({ page }) => {
    test.slow()
    const successButton = page.locator('.bg-success')
    await successButton.click()
})