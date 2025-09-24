import { expect, test } from '@playwright/test'


test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/');
    await page.getByText('Forms').click();
    await page.getByText('Form Layouts').click();
});


test('user facing locator', async ({ page }) => {
  await page.getByRole('textbox', {name:"Email"}).first().click();

  await page.getByRole('button', {name: "Sign in"}).first().click();

  await  page.getByLabel('Email').first().click();

});

test('locating child elements', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click();
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click();
})

test('locating by parent elements', async ({ page }) => {
    await page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name:"Email"}).click();
    await page.locator('nb-card', { has: page.locator("#inputEmail1")}).getByRole('textbox', {name : "Email"}).click();

    //Using Filter
    await page.locator('nb-card').filter( {hasText: "Basic form"}).getByRole('textbox', {name:"Email"}).click();
    await page.locator('nb-card').filter( { has: page.locator('.status-danger')}).getByRole('textbox', {name:"Password"}).click();

    //Chained Filter
    await page.locator('nb-card').filter( { has: page.locator('nb-checkbox')}).filter({ hasText: "Sign in"})
    .getByRole('textbox', {name:"Email"}).click();

    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox' , {name: "Email"}).click();
});

test('reusing locators', async ({ page }) => {

    /*
     await page.locator('nb-card').filter( {hasText: "Basic form"}).getByRole('textbox', {name:"Email"}).fill('test@mail.com')
     await page.locator('nb-card').filter( {hasText: "Basic form"}).getByRole('textbox', {name:"Password"}).fill('password112')
     await page.locator('nb-card').filter( {hasText: "Basic form"}).getByRole('button').click()

    */
     //reusing
     const basicForm = page.locator('nb-card').filter( {hasText: "Basic form"})
     await basicForm.getByRole('textbox', {name:"Email"}).fill('test@mail.com')
     await basicForm.getByRole('textbox', {name:"Password"}).fill('pass')
     await basicForm.getByRole('button').click()

})

test('extracting values', async ({ page }) => {
    const basicForm = page.locator('nb-card').filter( {hasText: "Basic form"})
    const buttonText = await basicForm.locator('button').textContent()
    expect(buttonText).toEqual('Submit')

    //all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents();
    expect(allRadioButtonsLabels).toContain("Option 1")

    //from input value
    const emailField = basicForm.getByRole('textbox', {name:"Email"})
    await emailField.fill("test@mimi.com")
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@mimi.com')
})

test('assertions', async ({ page }) => { 
    //Locator assertion
    const basicFormButton = page.locator('nb-card').filter( {hasText: "Basic form"}).locator('button')
   await expect(basicFormButton).toHaveText('Submit')

   //soft assertion: doest not stop test
   await expect.soft(basicFormButton).toHaveText('Submit')
   await basicFormButton.click();

})

