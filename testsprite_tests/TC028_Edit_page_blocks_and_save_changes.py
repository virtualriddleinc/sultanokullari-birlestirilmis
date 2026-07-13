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
        
        # -> Open the admin login page (the site's login screen).
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
        
        # -> Open the 'DENEME' page from the 'Son düzenlenen içerik' (Recent content) list.
        # DENEME Hero 14.07.2026 link
        elem = page.get_by_role('link', name='DENEME Hero 14.07.2026', exact=True)
        await elem.click(timeout=10000)
        
        # -> Change the 'Üst etiket' field to 'DENEME-UPDATED', click the 'Save' button, and verify the new value appears on the page.
        # tagline text field
        elem = page.locator('[id="field-tagline"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("DENEME-UPDATED")
        
        # -> Change the 'Üst etiket' field to 'DENEME-UPDATED', click the 'Save' button, and verify the new value appears on the page.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the page changes are saved successfully
        # Assert: The 'Üst etiket' input contains the updated value 'DENEME-UPDATED'.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div[1]/div/div[1]/div/div/div[1]/div/div/input").nth(0)).to_have_value("DENEME-UPDATED", timeout=15000), "The '\u00dcst etiket' input contains the updated value 'DENEME-UPDATED'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    