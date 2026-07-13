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
        
        # -> Open the admin login page (visit the 'Giriş' / admin login page at /admin/login) and verify the login form is visible.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Notifications' section to attempt to trigger the admin UI to render the login form.
        # Notifications alt+T
        elem = page.get_by_text('Notifications alt+T', exact=True)
        await elem.click(timeout=10000)
        
        # -> Reload the admin main page (Sultan Okulları Yönetim Paneli) by navigating to the admin home page to force the SPA to initialize.
        await page.goto("http://localhost:5001/admin")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the admin login page and display the login form with the 'E-posta' and 'Parola' fields.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the 'Email' field with admin@admin.com, fill the 'Password' field with admin123, and click the 'Login' button.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill the 'Email' field with admin@admin.com, fill the 'Password' field with admin123, and click the 'Login' button.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill the 'Email' field with admin@admin.com, fill the 'Password' field with admin123, and click the 'Login' button.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Haber / Duyuru Ekle' (Add News / Announcement) quick action to open the create news form.
        # Haber / Duyuru Ekle link
        elem = page.get_by_role('link', name='Haber / Duyuru Ekle', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Başlık' field with a test news title, fill the 'Tam metin' content editor with body text, then click the 'Save Draft' button.
        # title text field
        elem = page.locator('[id="field-title"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Taslak Haber - 2026-07-13")
        
        # -> Fill the 'Başlık' field with a test news title, fill the 'Tam metin' content editor with body text, then click the 'Save Draft' button.
        # Fill the 'Başlık' field with a test news title, fill the 'Tam metin' content editor with body text, then click the 'Save Draft' button.
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[2]/div/div/div[5]/div[2]/div/div/div/div')
        await elem.click(timeout=10000)
        
        # -> Fill the 'Başlık' field with a test news title, fill the 'Tam metin' content editor with body text, then click the 'Save Draft' button.
        # Fill the 'Başlık' field with a test news title, fill the 'Tam metin' content editor with body text, then click the 'Save Draft' button.
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[2]/div/div/div[5]/div[2]/div/div/div/div')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("This is an automated test draft created on 2026-07-13. Body content for the draft news item.")
        
        # -> Fill the 'Başlık' field with a test news title, fill the 'Tam metin' content editor with body text, then click the 'Save Draft' button.
        # Save Draft button
        elem = page.locator('[id="action-save-draft"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Haberler listesini aç →' link to open the news list and verify the draft appears there.
        # Haberler listesini aç → link
        elem = page.get_by_role('link', name='Haberler listesini aç →', exact=True)
        await elem.click(timeout=10000)
        
        # -> Switch to the admin tab titled 'Editing - Haber - Payload' (the admin news editor) to navigate back to the news list and verify the draft.
        # Switch to tab 3FC4
        page = context.pages[-1]  # switch to most recently active tab
        
        # -> Click the 'Haberler' link in the left navigation to open the admin news list and verify the draft is listed.
        # Haberler link
        elem = page.get_by_text('/', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Haberler', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the news list is displayed
        # Assert: The admin news list URL is present.
        await expect(page).to_have_url(re.compile("admin/collections/news"), timeout=15000), "The admin news list URL is present."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/thead/tr").nth(0).scroll_into_view_if_needed()
        # Assert: The news list table header is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/thead/tr").nth(0)).to_be_visible(timeout=15000), "The news list table header is visible."
        
        # --> Verify the new draft news item is listed
        # Assert: The news list contains the draft titled 'Test Taslak Haber - 2026-07-13'.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/tbody/tr[2]/td[2]/a").nth(0)).to_have_text("Test Taslak Haber - 2026-07-13", timeout=15000), "The news list contains the draft titled 'Test Taslak Haber - 2026-07-13'."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    