const { test, expect } = require("@playwright/test"); //importing annotation from jars
const { Console } = require("console");
const { loginAndNavigate } = require('./loginHelper');
const exp = require("constants");


test ('check-in dashboard', async function({browser})
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    
    await expect(page.locator('//*[@id="root"]/div/div/div/div[2]/div[2]/div[1]/div[1]/div/div[2]')).toHaveText('Siddhant QA');
    console.log(await page.locator('//*[@id="root"]/div/div/div/div[2]/div[2]/div[1]/div[1]/div/div[2]').textContent());
    
    await expect(page.locator('//*[@id="main_container"]/div[1]/div[1]/p')).toHaveText('Day Check-In');
    console.log(await page.locator('//*[@id="main_container"]/div[1]/div[1]/p').textContent());

    await expect(page.locator('//*[@id="main_container"]/div[2]/span[1]/a/div/div[1]/p')).toHaveText('Total students');
    console.log(await page.locator('//*[@id="main_container"]/div[2]/span[1]/a/div/div[1]/p').textContent());

    await expect(page.locator('//*[@id="main_container"]/div[2]/span[2]/a/div/div[1]/p[1]')).toHaveText('checked-In');
    console.log(await page.locator('//*[@id="main_container"]/div[2]/span[2]/a/div/div[1]/p[1]').textContent());

    await expect(page.locator('//*[@id="main_container"]/div[2]/span[3]/a/div/div[1]/p[1]')).toHaveText('Not Checked-In');
    console.log(await page.locator('//*[@id="main_container"]/div[2]/span[3]/a/div/div[1]/p[1]').textContent());

    await expect(page.locator('//*[@id="main_container"]/div[2]/span[4]/a/div/div[1]/p[1]')).toHaveText('Late Arrivals');
    console.log(await page.locator('//*[@id="main_container"]/div[2]/span[4]/a/div/div[1]/p[1]').textContent());
     
    await page.getByRole('button', { name: 'Manual Check In' }).isVisible();
    await page.getByRole('button', { name: 'Send Notification' }).isVisible();

    await expect (page.locator("[type='checkbox']")).toBeEditable();
    await expect (page.locator("[type='checkbox']")).toBeVisible();

    await expect (page.locator("[placeholder='  Search']")).toBeEditable();
    await expect (page.locator("[placeholder='  Search']")).toBeVisible();


    

});

test ('Manual check-in from check-in dashboard ', async function({browser})
{
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);

    await page.getByRole('button', { name: 'Manually Check In' }).click();
    
    expect (await page.locator('[role="dialog"]').isVisible());
    expect (page.locator('[class="flex v-center"]')).toHaveText("Manual Check-In");

    await page.locator('[placeholder="Student Name "]').fill('j');
    await page.waitForSelector('xpath=/html/body/div[2]/div[3]/div/div[1]/div/div[1]/div/div[2]');
    let studentSuggestion = await page.locator('xpath=/html/body/div[2]/div[3]/div/div[1]/div/div[1]/div/div[2]').allTextContents();
   
    const studentIndex = 0; // Change this index as needed
    if (studentSuggestion.length > studentIndex) {
        
        const studentToSelect = page.locator('xpath=/html/body/div[2]/div[3]/div/div[1]/div/div[1]/div/div[2]').nth(studentIndex);

        await studentToSelect.click();
        console.log(`Selected student: ${studentSuggestion[studentIndex]}`);

        await page.locator('[placeholder*="hh:mm (a|p)m"]').fill("05:30 am");
        await page.getByRole('button', { name: 'Check-In' }).click();
        const alertMessage = await page.locator('[role*="alert"]').textContent();
        console.log(alertMessage);
        console.log(`Checked in student: ${studentSuggestion[studentIndex]}`);
    } 
    else
    {
        console.log('No student available to select at the given index.');
    }   

});


test ('Manual check-in from student profile', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByText('Not Checked-In').click();

    try {
        await page.waitForSelector('[class*="MuiTypography-root MuiTypography-body1 css-9l3uo3"]', { timeout: 5000 });
    } catch (e) {
        console.log('No students are currently available for check-in.');
        return;  // Exit the test early if no students are found
    }

    let studentList = await page.locator('[class*="MuiTypography-root MuiTypography-body1 css-9l3uo3"]').allTextContents();

    let studentIndex = 0;
    if (studentList.length > studentIndex) {
        const studentToSelect = page.locator('[class*="MuiTypography-root MuiTypography-body1 css-9l3uo3"]').nth(studentIndex);
        await studentToSelect.click();
        console.log(`Selected student: ${studentList[studentIndex]}`);

        await page.getByRole('button', { name: 'Check-In' }).click();
        await page.locator('[placeholder*="hh:mm (a|p)m"]').fill("05:30 am");
        await page.getByRole('button', { name: 'Check-In' }).click();
        const alertMessage = await page.locator('[role*="alert"]').textContent();
        console.log(alertMessage);
        console.log(`Checked in student: ${studentList[studentIndex]}`);
    } else {
        console.log('No student available to select at the given index.');
    }
});


test('Checking-in already checked-in', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);

    try {
        await page.waitForSelector('xpath=//*[@id="main_container"]/div[3]/div/div[2]/div/div[2]/div/a/span/div[2]/div[1]/p[1]', 
            { timeout: 5000 });
    } catch (e) {
        console.log('No students are currently available for check-in.');
        return;  // Exit the test early if no students are found
    }

    let checkedinStudents = await page.locator('xpath=//*[@id="main_container"]/div[3]/div/div[2]/div/div[2]/div/a/span/div[2]/div[1]/p[1]')
    .allTextContents();
  
    const studentIndex = 0; // Change this index as needed
    if (checkedinStudents.length > studentIndex) {
        
        const studentToSelect = page.locator('xpath=//*[@id="main_container"]/div[3]/div/div[2]/div/div[2]/div/a/span/div[2]/div[1]/p[1]').nth(studentIndex);

        await studentToSelect.click();
        console.log(`Selected student: ${checkedinStudents[studentIndex]}`);
        await page.getByRole('button', { name: 'Check-In' }).click();
        await page.locator('[placeholder*="hh:mm (a|p)m"]').fill("05:30 am");
        await page.getByRole('button', { name: 'Check-In' }).click();
        const alertMessage = await page.locator('[role*="alert"]').textContent();
        console.log(`Checked in student: ${checkedinStudents[studentIndex]}`);
        console.log(alertMessage);
    } 
    else
    {
        console.log('No student available to select at the given index.');
    }   
 

});


// test.only('Check-in mode', async function({ browser }) {
//     const context = await browser.newContext();
//     const page = await context.newPage();
//     await loginAndNavigate(page);

//     await page.locator('li').first().click();
//     await page.locator('.sidebar_icon').nth(2).click();

//     await page.waitForSelector('//*[@id="root"]/div/div/div/div[2]/div[2]/div[2]/div/div/div[2]/div/table/tbody/tr/td[3]/div');
//     let cardIds = await page.locator('//*[@id="root"]/div/div/div/div[2]/div[2]/div[2]/div/div/div[2]/div/table/tbody/tr/td[3]/div').allTextContents();
//     const cardIdIndex = 0;
//     let cardIdToSelect = '';
//     if (cardIds.length > cardIdIndex) {
//         // Get the text content from the locator
//         cardIdToSelect = await page.locator('//*[@id="root"]/div/div/div/div[2]/div[2]/div[2]/div/div/div[2]/div/table/tbody/tr/td[3]/div').nth(cardIdIndex).textContent();
        
//     } 
//     await page.locator('li').first().click();
//     await page.getByText('Check In').click();
//     await page.locator('[value*="Check-In Mode"]').click();
//     await expect(page.locator('#responsive-dialog-title')).toHaveText('Enable Check-In Mode');
//     console.log(await page.locator('xpath=/html/body/div[2]/div[3]/div/div[1]/p/p[2]').textContent());
//     await page.getByRole('button', { name: 'Yes' }).click();


//     await page.locator('#input').fill(cardIdToSelect);
//     const alertMessage = await page.locator('[role*="alert"]').textContent();
//     console.log(`Selected cardId: ${cardIds[cardIdIndex]}`);
//     console.log(alertMessage);
// });



test.only('Check-in mode', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);

    await page.locator('li').first().click();
    await page.locator('.sidebar_icon').nth(2).click();

    await page.waitForSelector('//*[@id="root"]/div/div/div/div[2]/div[2]/div[2]/div/div/div[2]/div/table/tbody/tr/td[3]/div');
    let cardIds = await page.locator('//*[@id="root"]/div/div/div/div[2]/div[2]/div[2]/div/div/div[2]/div/table/tbody/tr/td[3]/div').allTextContents();

    let cardIdIndex = 0;
    let checkInSuccess = false;

    while (!checkInSuccess && cardIdIndex < cardIds.length) {
        let cardIdToSelect = cardIds[cardIdIndex]; // Get the card ID from the array

        if (cardIdToSelect) {
            await page.locator('li').first().click();

            // More specific selector using getByRole for the button
            await page.getByText('Check In' ).click(); 

            await page.locator('[value*="Check-In Mode"]').click();
            await expect(page.locator('#responsive-dialog-title')).toHaveText('Enable Check-In Mode');
            console.log(await page.locator('xpath=/html/body/div[2]/div[3]/div/div[1]/p/p[2]').textContent());
            await page.getByRole('button', { name: 'Yes' }).click();

            // Ensure the input is visible and available before interacting with it
            const inputLocator = page.locator('#input');
            await inputLocator.waitFor({ state: 'visible' });

            // Attempt to fill the card ID and check-in
            await inputLocator.fill(cardIdToSelect.trim());
            const alertMessage = await page.locator('[role*="alert"]').textContent();

            console.log(`Selected cardId: ${cardIdToSelect}`);
            console.log(alertMessage);

            if (alertMessage.includes('Student already checked in')) {
                // Increment index to try the next student
                cardIdIndex++;
            } else {
                // If check-in is successful, break the loop
                checkInSuccess = true;
            }
        } else {
            console.log('Card ID is undefined or null. Skipping to the next index.');
            cardIdIndex++;
        }
    }

    if (!checkInSuccess) {
        console.log('No students were successfully checked in.');
    } else {
        console.log('Check-in successful.');
    }
});


