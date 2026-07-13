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
        
        # -> Open the admin login page at /admin/login and load the login form.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Wait briefly and then reload the 'Login' page so the email and password fields can appear.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill 'admin@admin.com' into the Email field and 'admin123' into the Password field, then click the 'Login' button.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill 'admin@admin.com' into the Email field and 'admin123' into the Password field, then click the 'Login' button.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill 'admin@admin.com' into the Email field and 'admin123' into the Password field, then click the 'Login' button.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'İletişim Mesajları' (Contact Messages) collection page.
        await page.goto("http://localhost:5001/admin/collections/contact-messages")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the 'TestSprite Demo Kullanıcı' message from the Contact Messages list.
        # TestSprite Demo Kullanıcı link
        elem = page.get_by_role('link', name='TestSprite Demo Kullanıcı', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Arşivle' (Archive) button on the open message to archive it and then verify the inbox reflects the archived/removed state.
        # Arşivle button
        elem = page.get_by_role('button', name='Arşivle', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'İletişim Mesajları' link to return to the contact messages inbox list and verify the message is archived/removed from the active inbox.
        # İletişim Mesajları link
        elem = page.get_by_text('/', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='İletişim Mesajları', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the message is shown as read in the inbox
        # Assert: Message row shows the status 'Okundu' (read) in the inbox.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/tbody/tr[1]/td[5]").nth(0)).to_have_text("Okundu", timeout=15000), "Message row shows the status 'Okundu' (read) in the inbox."
        
        # --> Verify the message is archived or removed from the active inbox list
        # Assert: The message row in the inbox list shows the status 'Arşiv' (archived).
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/tbody/tr[2]/td[5]/span").nth(0)).to_have_text("Ar\u015fiv", timeout=15000), "The message row in the inbox list shows the status 'Ar\u015fiv' (archived)."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    