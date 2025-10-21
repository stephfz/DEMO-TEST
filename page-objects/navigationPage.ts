import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{
    readonly formLayoutMenuItem: Locator
    readonly datePickerMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly smartTableMenuItem: Locator

    constructor(page :Page){
        super(page)
        this.formLayoutMenuItem = page.getByText('Form Layouts');
        this.datePickerMenuItem = page.getByText('Datepicker');
        this.smartTableMenuItem = page.getByText('Smart Table');
        this.toastrMenuItem = page.getByText('Toastr');
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutMenuItem.click()  
    }

    async datePickerPage(){
        await this.selectGroupMenuItem('Forms')
        //await this.page.waitForTimeout(1000)
        await this.waitForNumberOfSeconds(4)
        await this.datePickerMenuItem.click()

    }

    async smartTablePage(){
       await this.selectGroupMenuItem('Tables & Data')
        await this.smartTableMenuItem.click()

    }

    async toastrPage(){
       await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()

    }

    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenutItem = this.page.getByTitle(groupItemTitle);
        const expandedState = await groupMenutItem.getAttribute('aria-expanded')
        if (expandedState == "false"){
            await groupMenutItem.click()
        }
    }

}