const { expect } = require('@playwright/test');

async function loginAndNavigate(page) {
    await page.goto("https://automationschoolcheckin.reframeuat.com/calendar/auth/home");
    console.log(await page.title());
    await expect(page).toHaveTitle("Reframe Engage");

    await page.locator("[name='email']").fill("school.checkIn@gytworkz.com");
    await page.locator("[name='password']").fill("Admin@123");
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.locator("xpath=//*[@id='root']/div/div/div/div[2]/div[1]/div/div[2]/div[3]/div[1]/input[1]").fill("1");
    await page.locator("xpath=//*[@id='root']/div/div/div/div[2]/div[1]/div/div[2]/div[3]/div[1]/input[2]").fill("2");
    await page.locator("xpath=//*[@id='root']/div/div/div/div[2]/div[1]/div/div[2]/div[3]/div[1]/input[3]").fill("3");
    await page.locator("xpath=//*[@id='root']/div/div/div/div[2]/div[1]/div/div[2]/div[3]/div[1]/input[4]").fill("4");
    await page.locator("xpath=//*[@id='root']/div/div/div/div[2]/div[1]/div/div[2]/div[3]/div[1]/input[5]").fill("5");
    await page.locator("xpath=//*[@id='root']/div/div/div/div[2]/div[1]/div/div[2]/div[3]/div[1]/input[6]").fill("6");
    await page.locator("//span[contains(text(),'Sign In')]").click();

    await page.getByLabel('close', { exact: true }).click();

    await page.locator('li').first().click();
    await page.getByText('Check In').click();
}

module.exports = { loginAndNavigate };
