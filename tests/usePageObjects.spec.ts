import { expect, test } from '@playwright/test';
import { NavigationPage } from '../page-objects/navigationPage';
import { FormLayoutsPage } from '../page-objects/formLayoutsPage';
import { DatePickerPage } from '../page-objects/datePickerPage';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
})

test('navigate to form page', async({page}) => {
    const navigateTo = new NavigationPage(page);
    await navigateTo.formLayoutsPage()
    await navigateTo.datePickerPage()
})


test('parametrized methods', async({page}) => {
    const navigateTo = new NavigationPage(page)
    const onFormsLayoutPage = new FormLayoutsPage(page)

    await navigateTo.formLayoutsPage()
    await onFormsLayoutPage.submitUsingTheGridFormWithCredentialsAndSelectionOption('steph@mail.com', '123', 'Option 1')

    await onFormsLayoutPage.submitInlineFormWithEmailAndCheckbox('Steph', 'steph@mail.com', true)

    const onDatePickerPage = new DatePickerPage(page)
    await navigateTo.datePickerPage()
    await onDatePickerPage.selectCommonDatePickerDateFromToday(1)
    await onDatePickerPage.selectDatepickerWithRangeFromToday(3,5)
})


