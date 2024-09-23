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


test  ('Manual check-in from student profile', async function({ browser }) {
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


test ('Enable/Disable Check-in mode toggle button ', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);

    expect(page.locator('[value*="Check-In Mode"]')).not.toBeChecked()    
    await page.locator('[value*="Check-In Mode"]').click();
    await page.waitForSelector('#responsive-dialog-title');
    await expect(page.locator('#responsive-dialog-title')).toHaveText('Enable Check-In Mode');
    // console.log(await page.locator('xpath=/html/body/div[2]/div[3]/div/div[1]/p/p[2]').textContent());
    await page.getByRole('button', { name: 'Yes' }).click();
    await expect(page.locator('[value*="Check-In Mode"]')).toBeChecked();
    await page.waitForSelector('[value*="Check-In Mode"]');

    await page.locator('[value*="Check-In Mode"]').click();
    await expect(page.locator('[value*="Check-In Mode"]')).not.toBeChecked();

});

test ('Send Notification', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'Send Notification' }).click();
    await page.getByRole('button', { name: 'Send Notification' }).click();
    const alertMessage = await page.locator('[role*="alert"]').textContent();
    console.log(alertMessage);
    
});

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

test.only('Add Student', async function({ browser }) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await loginAndNavigate(page);
    await page.getByRole('button', { name: 'open Students' }).click();  
    await page.getByRole('button', { name: 'Add Student' }).click();

    //Primary details of students 
    await page.locator('[name*="primaryDetails.firstName"]').fill("Tester at");
    await page.locator('[name*="primaryDetails.lastName"]').fill("Gytworkz");
    await page.locator('[name*="primaryDetails.contact"]').fill(" ");
    await page.locator('[name*="primaryDetails.contact"]').fill("+91 7020785937");
    await page.locator('[name*="primaryDetails.email"]').fill("testeratGytworkz@gytworkz.com");
    await page.locator('[name*="primaryDetails.grade"]').fill("1");
    await page.locator('[name*="primaryDetails.cardId"]').fill("123456789000");
    // await page.locator('').fill("");

});





