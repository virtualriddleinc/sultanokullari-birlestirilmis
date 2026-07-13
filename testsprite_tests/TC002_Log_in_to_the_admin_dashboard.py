import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5001/admin")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Navigate to the admin login page (http://localhost:5001/admin/login) so the login form can be filled.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the 'Email' field with admin@admin.com, fill the 'Password' field with admin123, then click the 'Login' button.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill the 'Email' field with admin@admin.com, fill the 'Password' field with admin123, then click the 'Login' button.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill the 'Email' field with admin@admin.com, fill the 'Password' field with admin123, then click the 'Login' button.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the admin dashboard is displayed
        await page.locator("xpath=/html/body/div[2]/div[2]/div/header/div[2]/div/div/div[1]/nav/span[2]/div/div").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Dashboard' label is visible in the admin header.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/header/div[2]/div/div/div[1]/nav/span[2]/div/div").nth(0)).to_be_visible(timeout=15000), "The 'Dashboard' label is visible in the admin header."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[2]").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Hero Slaytları' quick action is visible on the dashboard.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[2]").nth(0)).to_be_visible(timeout=15000), "The 'Hero Slaytlar\u0131' quick action is visible on the dashboard."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Taslak haber' dashboard stat card is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[1]").nth(0)).to_be_visible(timeout=15000), "The 'Taslak haber' dashboard stat card is visible."
        
        # --> Verify dashboard stats and quick access content are displayed
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[1]").nth(0).scroll_into_view_if_needed()
        # Assert: Dashboard stat 'Taslak haber' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[1]").nth(0)).to_be_visible(timeout=15000), "Dashboard stat 'Taslak haber' is visible."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[3]").nth(0).scroll_into_view_if_needed()
        # Assert: Dashboard stat 'Okunmamış mesaj' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[3]").nth(0)).to_be_visible(timeout=15000), "Dashboard stat 'Okunmam\u0131\u015f mesaj' is visible."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[6]").nth(0).scroll_into_view_if_needed()
        # Assert: Dashboard stat 'Panel kullanıcısı' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[1]/a[6]").nth(0)).to_be_visible(timeout=15000), "Dashboard stat 'Panel kullan\u0131c\u0131s\u0131' is visible."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[1]").nth(0).scroll_into_view_if_needed()
        # Assert: Quick action 'Ana Sayfa Düzeni' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[1]").nth(0)).to_be_visible(timeout=15000), "Quick action 'Ana Sayfa D\u00fczeni' is visible."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[2]").nth(0).scroll_into_view_if_needed()
        # Assert: Quick action 'Hero Slaytları' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[2]").nth(0)).to_be_visible(timeout=15000), "Quick action 'Hero Slaytlar\u0131' is visible."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[6]").nth(0).scroll_into_view_if_needed()
        # Assert: Quick action 'Gelen Kutusu' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div[1]/section[2]/div/a[6]").nth(0)).to_be_visible(timeout=15000), "Quick action 'Gelen Kutusu' is visible."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    