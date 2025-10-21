import { expect, test } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
})

test('navigate to form page', async({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datePickerPage()
})


test('parametrized methods', async({page}) => {
    const pm = new PageManager(page)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormsLayoutPage().submitUsingTheGridFormWithCredentialsAndSelectionOption('steph@mail.com', '123', 'Option 1')
    await pm.onFormsLayoutPage().submitInlineFormWithEmailAndCheckbox('Steph', 'steph@mail.com', true)

    await pm.navigateTo().datePickerPage()
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(1)
    await pm.onDatePickerPage().selectDatepickerWithRangeFromToday(3,5)
})


