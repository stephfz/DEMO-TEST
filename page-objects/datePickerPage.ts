import { expect, Locator, Page } from "@playwright/test";

export class DatePickerPage{
    private readonly page: Page;

    constructor(page:Page){
        this.page=  page
    }

    async selectCommonDatePickerDateFromToday(numbersOfDaysFromToday: number){

        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click();
               
        const dateToAssert = await this.selectDateInTheCalendar(numbersOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    private async selectDateInTheCalendar(numbersOfDaysFromToday: number){

                    let date = new Date()
            date.setDate(date.getDate() + numbersOfDaysFromToday)
            const expectedDate = date.getDate().toString()
        
            //await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate,{exact:true}).click();
        
            const expectedMonthShort = date.toLocaleDateString('EN-US', {month:'short'})
             const expectedMonthLong = date.toLocaleDateString('EN-US', {month:'long'})
            const expectedYear = date.getFullYear()
            const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
        
            //to handle month change
            let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
            expect(calendarMonthAndYear).toContain('October')
            const expectedMontAndYear = ` ${expectedMonthLong} ${expectedYear}`
            while(!calendarMonthAndYear?.includes(expectedMontAndYear)){
                await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
                calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
            }
           
            await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate,{exact:true}).click();
            return dateToAssert;

    }

    async selectDatepickerWithRangeFromToday(startDate: number, endDate: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click();

        const dateToAssertStart = await this.selectDateInTheCalendar(startDate)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDate)

        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }
}