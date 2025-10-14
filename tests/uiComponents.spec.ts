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


test('Lists and dropdowns', async ({ page }) => {
    const dropdown = page.locator('ngx-header nb-select')
    await dropdown.click()

    page.getByRole('list')
    page.getByRole('listitem')

    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option')

    //assert
    await expect(optionList).toHaveText(['Light', 'Dark', 'Cosmic', 'Corporate'])
    await optionList.filter({hasText: 'Cosmic'}).click()

    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')
    
})

test('Tooltips', async ({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip ').click()

    const toolTipCard = page.locator('nb-card', {hasText: 'Tooltip Placements'})
    await toolTipCard.getByRole('button', {name: 'Top'}).hover()

    page.getByRole('tooltip') //as long as you have a role tooltip is created
    const tooltipText = await page.locator('nb-tooltip').textContent()
    expect(tooltipText).toEqual('This is a tooltip')

})

test('Dialogs Boxes', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //listener
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })
    //opens an alert (dialog from the browser)
    await page.getByRole('table').locator('tr', {hasText:'mdo@gmail.com'}).locator('.nb-trash').click();

    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com');
})


test('Web Tables', async ({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    //1 get row by any text in the row
    const targetRow = page.getByRole('row', {name : "twitter@outlook.com"});
    await targetRow.locator('.nb-edit').click();
    await page.locator('input-editor').getByPlaceholder('Age').clear();
    await page.locator('input-editor').getByPlaceholder('Age').fill('35');
    await page.locator('.nb-checkmark').click();

    //2 get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click();
    //locator for first cell
    const targetRowbyId = page.getByRole('row', {name : "11"}).filter({has: page.locator('td').nth(1).getByText('11')})
    await targetRowbyId.locator('.nb-edit').click()
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click();
    await expect(targetRowbyId.locator('td').nth(5)).toHaveText('test@test.com')

    //3 test filter for table
    const ages = ["20", "30", "40", "200"]

    for( let age of ages){
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)
        //hard wait
        await page.waitForTimeout(500)

        const ageRows = page.locator('tbody tr')
        for (let row of await ageRows.all()){
            const cellValue = await row.locator('td').last().textContent()
            if(age =="200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }else{
                expect(cellValue).toEqual(age)
            }
        }
    }
})

test('Date Pickers', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click();

    await page.locator('[class="day-cell ng-star-inserted"]').getByText('1',{exact:true}).click();

    await expect(calendarInputField).toHaveValue('Oct 1, 2025')

})

test('Date Picker 2', async ({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click();

    let date = new Date()
    date.setDate(date.getDate() + 20)
    const expectedDate = date.getDate().toString()

    //await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate,{exact:true}).click();

    const expectedMonthShort = date.toLocaleDateString('EN-US', {month:'short'})
     const expectedMonthLong = date.toLocaleDateString('EN-US', {month:'long'})
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    //to handle month change
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    expect(calendarMonthAndYear).toContain('October')
    const expectedMontAndYear = ` ${expectedMonthLong} ${expectedYear}`
    while(!calendarMonthAndYear?.includes(expectedMontAndYear)){
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }
   
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate,{exact:true}).click();
    await expect(calendarInputField).toHaveValue(dateToAssert)

})

test('Sliders', async ({ page }) => { 
    //Update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
   /*
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '122.90')
        node.setAttribute('cy', '10.12')
    })
    */
    await tempGauge.click()

    //Mouse movement
    const tempBox= page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded()

    const box = await tempBox.boundingBox()
    const x = box.x + box?.width / 2
    const y = box?.y + box?.height / 2
    await page.mouse.move(x,y)
    await page.mouse.down()
    await page.mouse.move(x + 100 , y)
    await page.mouse.move(x +100, y + 60)
    await page.mouse.up()
    await expect(tempBox).toContainText('28')
})


