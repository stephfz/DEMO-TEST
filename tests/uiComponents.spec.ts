import { expect, test } from '@playwright/test';
import { exec } from 'child_process';

test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
});

test.describe('Forms Layout Page', () => {
    test.beforeEach(async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        const usingGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name : "Email"})
        await usingGridEmailInput.fill("lala@mail.com")
        //await usingGridEmailInput.clear()

        const inputValue = await usingGridEmailInput.inputValue();
        expect(inputValue).toEqual('lala@mail.com')

        //locator assertion
        expect(usingGridEmailInput).toHaveValue('lala@mail.com')

    })

    test('radio buttons', async ({ page }) => {
        const usingGridEmailForm = page.locator('nb-card', {hasText: "Using the Grid"})
        await usingGridEmailForm.getByLabel('Option 1').check({force: true}) //it is hidden so will fail if not forced

        await usingGridEmailForm.getByRole('radio', {name: "Option 1"}).check({force:true})

        const rbStatus = usingGridEmailForm.getByRole('radio', {name: "Option 1"}).isChecked()
        expect(rbStatus).toBeTruthy()

        await expect(usingGridEmailForm.getByRole('radio', {name: "Option 1"})).toBeChecked()

    })



})


test('checkboxes', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr ').click()

    await page.getByRole('checkbox', {name : "Hide on click"}).uncheck({force:true})
    await page.getByRole('checkbox', {name : "Prevent arising of duplicate toast"}).check({force:true})

    //const allCheckboxes = page

})