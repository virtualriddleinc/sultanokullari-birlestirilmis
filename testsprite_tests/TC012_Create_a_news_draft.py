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
        
        # -> Open the admin login page by navigating to the '/admin/login' URL.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill 'admin@admin.com' into the Email field, fill 'admin123' into the Password field, then click the 'Login' button.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill 'admin@admin.com' into the Email field, fill 'admin123' into the Password field, then click the 'Login' button.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill 'admin@admin.com' into the Email field, fill 'admin123' into the Password field, then click the 'Login' button.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Haber / Duyuru Ekle' quick action to open the new news item form.
        # Haber / Duyuru Ekle link
        elem = page.get_by_role('link', name='Haber / Duyuru Ekle', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Başlık' field with 'TestSprite Draft News', add an excerpt and body, then click the 'Save Draft' button.
        # title text field
        elem = page.locator('[id="field-title"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("TestSprite Draft News")
        
        # -> Fill the 'Başlık' field with 'TestSprite Draft News', add an excerpt and body, then click the 'Save Draft' button.
        # excerpt text area
        elem = page.locator('[id="field-excerpt"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Automated draft created by TestSprite.")
        
        # -> Fill the 'Başlık' field with 'TestSprite Draft News', add an excerpt and body, then click the 'Save Draft' button.
        # Fill the 'Başlık' field with 'TestSprite Draft News', add an excerpt and body, then click the 'Save Draft' button.
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[2]/div/div/div[5]/div[2]/div/div/div/div')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("This is a draft news item created during an automated test run. It should appear in the Haberler list with draft status.")
        
        # -> Fill the 'Başlık' field with 'TestSprite Draft News', add an excerpt and body, then click the 'Save Draft' button.
        # Save Draft button
        elem = page.locator('[id="action-save-draft"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Haberler listesini aç →' link to open the Haberler (News) list and verify the 'TestSprite Draft News' entry appears with 'Draft' status.
        # Haberler listesini aç → link
        elem = page.get_by_role('link', name='Haberler listesini aç →', exact=True)
        await elem.click(timeout=10000)
        
        # -> Switch to the admin tab titled 'Editing - Haber - Payload' so the News (Haberler) collection can be opened and the 'TestSprite Draft News' draft verified.
        # Switch to tab D607
        page = context.pages[-1]  # switch to most recently active tab
        
        # -> Click the 'Haberler' item in the admin sidebar to open the News (Haberler) collection list so the 'TestSprite Draft News' draft can be located and its status verified.
        # Haberler link
        elem = page.get_by_text('/', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Haberler', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'TestSprite Draft News' title in the Haberler list to open its edit page and confirm the Status reads 'Draft'.
        # TestSprite Draft News link
        elem = page.get_by_role('link', name='TestSprite Draft News', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Reload' button on the 'This page couldn't load' screen to retry loading the news edit/list page.
        # Reload button
        elem = page.locator("xpath=/html/body/div[2]/div/div/form/button").nth(0)
        await elem.click(timeout=10000)
        
        # -> Open the Haberler (News) list page and verify that the 'TestSprite Draft News' item appears with 'Draft' status.
        await page.goto("http://localhost:5001/admin/collections/news")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Assertions to verify final state
        
        # --> Verify the news item appears in the list with draft status
        # Assert: The news item titled 'TestSprite Draft News' appears in the list.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/tbody/tr[1]/td[2]/a").nth(0)).to_have_text("TestSprite Draft News", timeout=15000), "The news item titled 'TestSprite Draft News' appears in the list."
        # Assert: The news item's Status column shows 'Draft'.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/tbody/tr[1]/td[6]").nth(0)).to_have_text("Draft", timeout=15000), "The news item's Status column shows 'Draft'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    