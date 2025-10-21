import { Locator, Page } from "@playwright/test";


export class FormLayoutsPage{
    private readonly page: Page
    constructor(page :Page)
    {
        this.page= page
    }

   async submitUsingTheGridFormWithCredentialsAndSelectionOption(email: string, password: string, optionText: string ){
        const usingGridEmailForm = this.page.locator('nb-card', {hasText: "Using the Grid"})
        await usingGridEmailForm.getByRole('textbox', {name : "Email"}).fill(email)
        await usingGridEmailForm.getByRole('textbox', {name : "Password"}).fill(password)
        await usingGridEmailForm.getByRole('radio', {name: optionText}).check({force:true})
        await usingGridEmailForm.getByRole('button').click()


   }

   /** This method is doing this: bla bla bla 
    * @param name
    * @param email
    * @param remember
    */
   async submitInlineFormWithEmailAndCheckbox(name: string, email :string, rememberme : boolean){
        const inlineForm = this.page.locator('nb-card', {hasText: "Inline form"})
        await inlineForm.getByRole('textbox', {name : "Jane Doe"}).fill(name)
        await inlineForm.getByRole('textbox', {name : "Email"}).fill(email)
        if (rememberme){
            await inlineForm.getByRole('checkbox').check({force:true})

        }
        await inlineForm.getByRole('button').click()
   }
}