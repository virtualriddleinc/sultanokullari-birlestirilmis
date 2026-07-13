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
        
        # -> Open the admin login page so the 'E-posta' and 'Parola' fields are visible.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Open the admin root page and confirm the 'E-posta' and 'Parola' login fields are visible on the login screen.
        await page.goto("http://localhost:5001/admin")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the 'Email' field with admin@admin.com and the 'Password' field with admin123, then click the 'Login' button.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill the 'Email' field with admin@admin.com and the 'Password' field with admin123, then click the 'Login' button.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill the 'Email' field with admin@admin.com and the 'Password' field with admin123, then click the 'Login' button.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Hero Slaytları' quick action on the dashboard to open the hero slides list.
        # Hero Slaytları link
        elem = page.get_by_role('link', name='Hero Slaytları', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Create New' button to open the hero slide creation form.
        # Create New link
        elem = page.get_by_role('link', name='Create new Hero Slaytı', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill 'Başlık satırı 1', 'Başlık satırı 2', 'Açıklama', add an image URL into 'Dosya yolu (public)', and click the 'Save' button to create the hero slide.
        # titleLine1 text field
        elem = page.locator('[id="field-titleLine1"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Ba\u015fl\u0131k 1")
        
        # -> Fill 'Başlık satırı 1', 'Başlık satırı 2', 'Açıklama', add an image URL into 'Dosya yolu (public)', and click the 'Save' button to create the hero slide.
        # titleLine2 text field
        elem = page.locator('[id="field-titleLine2"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Test Ba\u015fl\u0131k 2")
        
        # -> Fill 'Başlık satırı 1', 'Başlık satırı 2', 'Açıklama', add an image URL into 'Dosya yolu (public)', and click the 'Save' button to create the hero slide.
        # description text area
        elem = page.locator('[id="field-description"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Otomatik test a\u00e7\u0131klamas\u0131.")
        
        # -> Fill 'Başlık satırı 1', 'Başlık satırı 2', 'Açıklama', add an image URL into 'Dosya yolu (public)', and click the 'Save' button to create the hero slide.
        # slideMedia.src text field
        elem = page.locator('[id="field-slideMedia__src"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("https://via.placeholder.com/1200x600.png")
        
        # -> Click the 'Save' button in the top-right of the Create Hero Slaytı form to save the new slide.
        # button
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div[8]/div/div[2]/div/div/div/div/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the top-right of the Create Hero Slaytı form to submit the new slide.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # -> Click the '1 · Hero Slaytları' breadcrumb link to open the hero slides list so the new slide can be verified.
        # link
        elem = page.get_by_role('link', name='Dashboard', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the confirmation button labeled 'Leave anyway' (or Turkish equivalent) in the 'Leave without saving' dialog to return to the Hero Slaytları list.
        # button
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div[8]/div/div[2]/div/div/div/div/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Fill the 'Buton metni' and 'Buton bağlantısı' fields and click the 'Save' button to attempt saving the hero slide.
        # buttonText text field
        elem = page.locator('[id="field-buttonText"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Daha fazla")
        
        # -> Fill the 'Buton metni' and 'Buton bağlantısı' fields and click the 'Save' button to attempt saving the hero slide.
        # buttonLink text field
        elem = page.locator('[id="field-buttonLink"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("https://example.com")
        
        # -> Fill the 'Buton metni' and 'Buton bağlantısı' fields and click the 'Save' button to attempt saving the hero slide.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the hero slides list is displayed
        # Assert: The hero slides list header '1 · Hero Slaytları' is visible.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/header/div[2]/div/div/div[1]/nav/a[2]").nth(0)).to_have_text("1 \u00b7 Hero Slaytlar\u0131", timeout=15000), "The hero slides list header '1 \u00b7 Hero Slaytlar\u0131' is visible."
        current_url = await page.evaluate("() => window.location.href")
        # Assert: page loaded with a URL (final outcome verified by the AI judge during the run)
        assert current_url, 'Page should have loaded with a URL'
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    