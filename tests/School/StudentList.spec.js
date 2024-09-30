const { test, expect, firefox } = require("@playwright/test"); //importing annotation from jars
const { Console } = require("console");
const { loginAndNavigate } = require('./loginHelper');
const exp = require("constants");
const fs = require('fs');
const { waitForDebugger } = require("inspector");
const { ADDRGETNETWORKPARAMS } = require("dns");
const path = require("path");

test ('Checking-in inactive student', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();    
    await page.locator('[data-testid*="ArrowDropDownIcon"]').click();
    await page.waitForSelector('.name_container');
    await page.locator('.name_container').first().click();
    await page.getByRole('button', { name: 'Check-In' }).click();  
    await page.getByRole('button', { name: 'Check-In' }).click();  
    const alertMessage = await page.locator('[role*="alert"]').textContent();
    console.log(alertMessage);
});


const studentData = JSON.parse(fs.readFileSync('TestData/CreateStudentData.json'));
test.describe('add student with valid data', () => {
  studentData.forEach((data) => {
      
        test  (`Add Student: ${data.student1}`, async function({ browser }) {
            const context = await browser.newContext();
            const page = await context.newPage();
            await loginAndNavigate(page);
            await page.getByRole('button', { name: 'open Students' }).click();  
            await page.getByRole('button', { name: 'Add Student' }).click();

            // Primary details of student 
            await page.locator ('input[type="file"]').setInputFiles('TestData/StudentProfileImage.png');
            await page.locator ('[name*="primaryDetails.firstName"]').fill(data.firstName);
            await page.locator ('[name*="primaryDetails.lastName"]').fill(data.lastName);
            await page.locator('[name*="primaryDetails.contact"]').fill(" ");
            await page.locator('[name*="primaryDetails.contact"]').fill(data.Contact);
            await page.locator('[name*="primaryDetails.email"]').fill(data.Email);
            await page.locator('[name*="primaryDetails.grade"]').fill(data.Grade);
            await page.locator('[name*="primaryDetails.cardId"]').fill(data.CardId);
            await page.locator('[name*="primaryContact.name"]').fill(data.PCName);
            await page.locator('[name*="primaryContact.phone"]').fill(" ");
            await page.locator('[name*="primaryContact.phone"]').fill(data.Pcontact);
            await page.getByRole('button', { name: 'Create' }).click();  
            const alertMessage = await page.locator('[role*="alert"]').textContent();
            console.log(alertMessage); 

            if (alertMessage.includes('A student with this cardId already exists')) {
                await page.getByRole('button', { name: 'Close' }).nth(1).click();
                await page.waitForTimeout(1000); 
              }
            await page.waitForSelector('[placeholder*=" Search"]');
            await expect( page.locator('[placeholder*=" Search"]')).toBeEditable();
            await page.locator('[placeholder*=" Search"]').fill(data.firstName);
            console.log (await page.locator('[class*="text_transform black_font"]').first().textContent());
            await expect(page.locator('[class*="text_transform black_font"]').first()).toHaveText(data.firstName + ' ' + data.lastName);

      });
    });
  });

// const testData2 = JSON.parse(fs.readFileSync('TestData/CreateStudentInvalidData.json'));
// test.describe('add student with invalid data', () => {
//   testData2.forEach((data) => {
      
//         test (`Add Student: ${data.student2}`, async function({ browser }) {
//             const context = await browser.newContext();
//             const page = await context.newPage();
//             await loginAndNavigate(page);
//             await page.getByRole('button', { name: 'open Students' }).click();  
//             await page.getByRole('button', { name: 'Add Student' }).click();

//             // Primary details of student 
//             await page.locator ('[name*="primaryDetails.firstName"]').fill(data.firstName);
//             await page.locator ('[name*="primaryDetails.lastName"]').fill(data.lastName);
//             await page.locator('[name*="primaryDetails.contact"]').fill(" ");
//             await page.locator('[name*="primaryDetails.contact"]').fill(data.Contact);
//             await page.locator('[name*="primaryDetails.email"]').fill(data.Email);
//             await page.locator('[name*="primaryDetails.grade"]').fill(data.Grade);
//             await page.locator('[name*="primaryDetails.cardId"]').fill(data.CardId);
//             await page.locator('[name*="primaryContact.name"]').fill(data.PCName);
//             await page.locator('[name*="primaryContact.phone"]').fill(" ");
//             await page.locator('[name*="primaryContact.phone"]').fill(data.Pcontact);
//             await page.getByRole('button', { name: 'Create' }).click();  
//             const alertMessage = await page.locator('[role*="alert"]').textContent();
//             console.log(alertMessage);

//       });
//     });
//   });

test ('Bulk Upload with valid data', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();  
    await page.getByRole('button', { name: 'Bulk Upload' }).click();
    await page.getByRole('button', { name: ' Upload' }).setInputFiles('TestData/Bulk Upload Test File.xlsx')
    await page.getByRole('button', { name: ' Create' }).click();
    await page.waitForTimeout(2000);
    console.log (await page.locator('[class*="MuiBox-root css-70qvj9"]').first().textContent());
    console.log (await page.locator('[class*="MuiBox-root css-70qvj9"]').nth(1).textContent());
    console.log (await page.locator('[class*="MuiBox-root css-70qvj9"]').last().textContent());
    const alertMessage = await page.locator('[role*="alert"]').textContent();
    console.log(alertMessage);
});


test ('Bulk Upload invalid data', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();  
    await page.getByRole('button', { name: 'Bulk Upload' }).click();
    // await page.getByRole('button', { name: ' Upload' }).click();
    await page.getByRole('button', { name: ' Upload' }).setInputFiles('TestData/Bulk Upload invalid data.xlsx')
    await page.getByRole('button', { name: ' Create' }).click();
    console.log (await page.locator('[class*="MuiBox-root css-70qvj9"]').first().textContent());
    console.log (await page.locator('[class*="MuiBox-root css-70qvj9"]').nth(1).textContent());
    console.log (await page.locator('[class*="MuiBox-root css-70qvj9"]').last().textContent());
    // const alertMessage = await page.locator('[role*="alert"]').textContent();
    // console.log(alertMessage);
});

test ('Students List change status', async function ({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByText('Students', { exact: true }).click();
    const changeStudentStatus = async (status) => {
        // Selecting first 5 student in the list 
        for (let i = 1; i <= 5; i++) {
            const checkbox = page.locator('.cursor-pointer').nth(i);
            await checkbox.check();
            expect(checkbox).toBeChecked();
        }

        await page.locator('[aria-haspopup*="listbox"]').click();
        await page.locator(`[data-value="${status}"]`).click();
        await page.getByRole('button', { name: 'Confirm' }).click(); // Click the confirm button
        let alertMessage = await page.locator('[role*="alert"]').textContent();
        console.log(alertMessage);
    };

    // Change status to inactive
    await changeStudentStatus('inactive');

    // Change status to active
    await changeStudentStatus('active');
});


test ('Students List navigating b/w pages', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page); 
    await page.getByRole('button', { name: 'open Students' }).click();
   
    // Navigating through page index number < 1 2 ....5 >
    await page.waitForSelector('[aria-label*="page 2"]');
    expect (page.locator('[aria-label*="page 2"]')).toBeInViewport();
    await page.locator('[aria-label*="page 2"]').click();
    expect (page.locator('[aria-label*="page 2"]')).toBeEnabled();

    expect (page.locator('[aria-label*="page 1"]')).toBeInViewport();
    await page.waitForSelector('[aria-label*="page 1"]');
    await page.locator('[aria-label*="page 1"]').click();
    expect (page.locator('[aria-label*="page 2"]')).toBeEnabled();

    //Navigating through arrows < ....... >
    await page.waitForSelector('[aria-label*="Go to next page"]');
    expect (page.locator('[aria-label*="Go to next page"]')).toBeInViewport();
    await page.locator('[aria-label*="Go to next page"]').click();
    expect (page.locator('[aria-label*="Go to next page"]')).toBeEnabled();
    
    
    expect (page.locator('[aria-label*="Go to previous page"]')).toBeInViewport();
    await page.waitForSelector('[aria-label*="Go to previous page"]');
    await page.locator('[aria-label*="Go to previous page"]').click();
    expect (page.locator('[aria-label*="Go to previous page"]')).toBeDisabled();
});

test ('Action button Download QR Code ', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();
    

    //Action - Download QR Code
    const downloadQRCodeButton = page.locator('[aria-label*="Download QR Code"]').first();
    await downloadQRCodeButton.waitFor({ state: 'visible' });
    await expect(downloadQRCodeButton).toBeInViewport();
    await expect(downloadQRCodeButton).toBeEnabled();
    await downloadQRCodeButton.click();
});

test ('Action button Edit Student', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();
    
    //Action - Edit Student
    const editStudentButton = page.locator('xpath=//tbody/tr/td[7]/div[1]/div[2]/img[1]').first();
    await  editStudentButton .waitFor({ state: 'visible' });
    await expect(editStudentButton).toBeInViewport();
    await expect(editStudentButton).toBeEnabled();
    await  editStudentButton.click();
    await page.locator('[name*="primaryDetails.lastName"]').fill(" ");
    await page.locator('[name*="primaryDetails.lastName"]').fill("Gytworkz");
    await page.getByRole('button', { name: 'Update' }).click();
    let alertMessage = await page.locator('[role*="alert"]').textContent();
    console.log(alertMessage);
   
   //Closing edit student form
    await  editStudentButton.click();
    // await page.getByRole('button', { name: 'Close' }).first().click();
    // await  editStudentButton.click();
    await page.getByRole('button', { name: 'Close' }).last().click();  
});


test ('Action button  Delete Student', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();
    
    //Action - Delete Student
    const deleteStudentButton = page.locator('xpath=//tbody/tr/td[7]/div[1]/div[3]/img[1]').first();
    await  deleteStudentButton .waitFor({ state: 'visible' });
    await expect(deleteStudentButton).toBeInViewport();
    await expect(deleteStudentButton).toBeEnabled();
    await  deleteStudentButton.click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    let deleteAlertMessage = await page.locator('[role*="alert"]').textContent();
    console.log(deleteAlertMessage);
    let alertMessage = await page.locator('[role*="alert"]').textContent();
    console.log(alertMessage);

    //Closing delete student dialog box
    await  deleteStudentButton.click();
    await page.getByRole('button', { name: 'Close' }).last().click(); 
});

const emailData = JSON.parse(fs.readFileSync('TestData/EmailSubject&Body.json'));
test.describe('add student with valid data', () => {
emailData.forEach((data) => {
    test('Send Email', async function({ browser }) {
        const context = await browser.newContext();
        const page = await context.newPage();
        await loginAndNavigate(page);
        await page.getByRole('button', { name: 'open Students' }).click();

        const sendEmail = async (status) => {
            // Change status of first 5 students
            for (let i = 0; i < 5; i++) { // Change <= to <
                const checkbox = page.locator('xpath=//tbody/tr/td[1]/div[1]/input[1]').nth(i);
                await checkbox.waitFor(); // Ensure the checkbox is available
                await checkbox.check();
                expect(await checkbox.isChecked()).toBe(true); // Use isChecked to confirm
            }
            await page.getByRole('button', { name: 'Email' }).click();
            page.waitForSelector('[name*="subject"]');
            await page.locator('[name*="subject"]').fill(data.Subject);
            await page.locator('[name*="body"]').fill(data.Body); 
            page.waitForSelector('button', { name: 'Send' });
            expect (page.getByRole('button', { name: 'Send' })).toBeEnabled();
            await page.getByRole('button', { name: 'Send' }).click();
            let alertMessage = await page.locator('[role*="alert"]').textContent();
            console.log(alertMessage);
        };
        await sendEmail(); // Don't forget to call the sendEmail function
        await page.pause();
            });
        });    
    });

const broadcastMessage = JSON.parse(fs.readFileSync('TestData/broadcastMessage.json'));
test.describe('add student with valid data', () => {
broadcastMessage.forEach((data) => {
    test ('Broadcast SMS', async function({ browser }) {
        const context = await browser.newContext();
        const page = await context.newPage();
        await loginAndNavigate(page);
        await page.getByRole('button', { name: 'open Students' }).click();    
        const sendBroadcastSMS = async (status) => {
                // Change status of first 5 students
                for (let i = 0; i < 5; i++) { // Change <= to <
                    const checkbox = page.locator('xpath=//tbody/tr/td[1]/div[1]/input[1]').nth(i);
                    await checkbox.waitFor(); // Ensure the checkbox is available
                    await checkbox.check();
                    expect(await checkbox.isChecked()).toBe(true); // Use isChecked to confirm
                }

                await page.getByRole('button', { name: 'Broadcast SMS' }).click();
                await page.locator('[name*="message"]').fill(data.Message);
                expect (page.getByRole('button', { name: 'Send' })).toBeEnabled();
                await page.getByRole('button', { name: 'Send' }).click();
                let alertMessage = await page.locator('[role*="alert"]').textContent();
                console.log(alertMessage);
                
            };
            await sendBroadcastSMS(); // Don't forget to call the sendEmail function
            await page.pause();
                });
            });    
        });

test ('Delete Student', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();
    
    for (let i = 0; i < 2; i++) { // Change <= to <
        const checkbox = page.locator('xpath=//tbody/tr/td[1]/div[1]/input[1]').nth(i);
        await checkbox.waitFor(); // Ensure the checkbox is available
        await checkbox.check();
        expect(await checkbox.isChecked()).toBe(true); // Use isChecked to confirm
    }

    page.waitForSelector('button', { name: 'Delete' });
    expect (page.getByRole('button', { name: 'Delete' })).toBeInViewport();
    expect (page.getByRole('button', { name: 'Delete' })).toBeEnabled();
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    let alertMessage = await page.locator('[role*="alert"]').textContent();
    console.log(alertMessage);
});

test ('Long Button - Generate QR', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();
    let alertMessage = page.locator('[role*="alert"]');

    for (let i = 0; i < 2; i++) { // Change <= to <
        const checkbox = page.locator('xpath=//tbody/tr/td[1]/div[1]/input[1]').nth(i);
        await checkbox.waitFor(); // Ensure the checkbox is available
        await checkbox.check();
        expect(await checkbox.isChecked()).toBe(true); // Use isChecked to confirm
    }
    await page.locator('#long-button').click();

    // QR Generate
    await page.locator('[role="menuitem"]').first().waitFor();
    expect (page.locator('[role="menuitem"]').first()).toBeVisible();
    expect (page.locator('[role="menuitem"]').first()).toBeEnabled();
    page.locator('[role="menuitem"]').first().click();
    await page.getByRole('button', { name: 'Generate' }).click();
    const generateQR = await alertMessage.textContent();
    console.log(generateQR);

});

test ('Grade filter', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();
    
    await page.waitForSelector('[data-testid*="FilterAltIcon"]');
    await page.locator('[data-testid*="FilterAltIcon"]').click();
    await page.waitForSelector('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]');
    await page.locator('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]').click();
    await page.pause();
    //Select Grade manually and click on resume button in playwright inspector 
    await page.getByRole('button', { name: 'Apply' }).click();
    page.waitForSelector('xpath=//tbody/tr/td[5]');
    console.log (await page.locator('xpath=//tbody/tr/td[5]').first().textContent());
    console.log (await page.locator('xpath=//tbody/tr/td[5]').last().textContent());

    //Clearing applied grade filter
    await page.waitForSelector('[data-testid*="FilterAltIcon"]');
    await page.locator('[data-testid*="FilterAltIcon"]').click();
    await page.waitForSelector('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]', { state: 'visible', timeout: 10000 });
    await page.locator('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]').click();
    await page.pause();
    await page.getByRole('button', { name: 'Apply' }).click();

});



test ('Long Button Edit Grades', async function({ browser }) {
const context = await browser.newContext();
const page = await context.newPage();
await loginAndNavigate(page);
await page.getByRole('button', { name: 'open Students' }).click();

await page.waitForSelector('[data-testid*="FilterAltIcon"]');
await page.locator('[data-testid*="FilterAltIcon"]').click();
await page.waitForSelector('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]');
await page.locator('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]').click();
await page.pause();
//Select Grade manually and click on resume button in playwright inspector 
await page.getByRole('button', { name: 'Apply' }).click();
page.waitForSelector('xpath=//tbody/tr/td[5]');
console.log (await page.locator('xpath=//tbody/tr/td[5]').first().textContent());
console.log (await page.locator('xpath=//tbody/tr/td[5]').last().textContent());

for (let i = 0; i < 2; i++) { 
    const checkbox = page.locator('xpath=//tbody/tr/td[1]/div[1]/input[1]').nth(i);
    await checkbox.waitFor();
    await checkbox.check();
    expect(await checkbox.isChecked()).toBe(true); // Use isChecked to confirm
}

await page.locator('#long-button').click();

await page.locator('[role="menuitem"]').nth(1).waitFor();
expect (page.locator('[role="menuitem"]').nth(1)).toBeVisible();
expect (page.locator('[role="menuitem"]').nth(1)).toBeEnabled();
await page.locator('[role="menuitem"]').nth(1).click();
await page.waitForSelector('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]');
await page.locator('xpath=//body/div[2]/div[3]/div[1]/div[1]/div[1]/div[1]/div[1]').click();
await page.pause();
await page.getByRole('button', { name: 'Update' }).click();
page.waitForSelector('xpath=//tbody/tr/td[5]');
console.log (await page.locator('xpath=//tbody/tr/td[5]').first().textContent());
console.log (await page.locator('xpath=//tbody/tr/td[5]').last().textContent());
page.waitForSelector('[role*="alert"]');
let alertMessage = await page.locator('[role*="alert"]').textContent();
console.log(alertMessage);
});