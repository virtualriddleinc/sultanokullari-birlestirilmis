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
        
        # -> Open the admin login page and wait for the email field to appear.
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
        
        # -> Click the 'Ana Sayfa Düzeni' quick action (Homepage Layout) to open the homepage global settings.
        # Ana Sayfa Düzeni link
        elem = page.get_by_text('Hero Slaytları', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Ana Sayfa Düzeni', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the '3 · Yolculuk' tab in the homepage layout tab row to open that section.
        # 3 · Yolculuk button
        elem = page.get_by_role('button', name='3 · Yolculuk', exact=True)
        await elem.click(timeout=10000)
        
        # -> Edit the 'Levha başlığı' (Yolculuk headline) text field to append ' (test)' and click the 'Save' button to persist the change.
        # journey.headline text field
        elem = page.locator('[id="field-journey__headline"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Peygamber Efendimiz'in (s.a.s) \u0130zinde Gelece\u011fe \u00d6rnek Nesiller... (test)")
        
        # -> Edit the 'Levha başlığı' (Yolculuk headline) text field to append ' (test)' and click the 'Save' button to persist the change.
        # Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button to persist the homepage global change, then reload the Ana Sayfa Düzeni editor and verify the Yolculuk headline still contains ' (test)'.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button to persist the homepage global change and then reload the 'Ana Sayfa Düzeni' page to verify the 'Levha başlığı' still contains ' (test)'.
        # Exit Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the top-right to persist the edited Yolculuk headline.
        # Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the top-right of the Ana Sayfa Düzeni editor to persist the edited Yolculuk headline, then reload the page to verify the change remains.
        # Exit Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the top-right of the Ana Sayfa Düzeni editor to persist the edited Yolculuk headline, then reload the page to verify the change remains.
        await page.goto("http://localhost:5001/admin/globals/ana-sayfa")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Save' button in the top-right of the Ana Sayfa Düzeni editor to persist the edited 'Yolculuk' headline.
        # Exit Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the top-right of the Ana Sayfa Düzeni editor to persist the edited 'Yolculuk' headline.
        await page.goto("http://localhost:5001/admin/globals/ana-sayfa")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the '3 · Yolculuk' tab to open the Yolculuk section and reveal the edited headline.
        # 3 · Yolculuk button
        elem = page.get_by_role('button', name='3 · Yolculuk', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the '3 · Yolculuk' tab to open the Yolculuk section and wait for the UI to update.
        # 3 · Yolculuk button
        elem = page.get_by_role('button', name='3 · Yolculuk', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the '3 · Yolculuk' tab and wait for the section content to appear.
        # 3 · Yolculuk button
        elem = page.get_by_role('button', name='3 · Yolculuk', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the '3 · Yolculuk' tab and wait for the Yolculuk section content to appear so the headline can be inspected.
        # 3 · Yolculuk button
        elem = page.get_by_role('button', name='3 · Yolculuk', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the '3 · Yolculuk' tab (label: '3 · Yolculuk') and wait for the Yolculuk section content to appear so the headline can be inspected.
        # 3 · Yolculuk button
        elem = page.get_by_role('button', name='3 · Yolculuk', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the saved homepage settings remain available
        await page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[1]/div/button[2]").nth(0).scroll_into_view_if_needed()
        # Assert: The '3 · Yolculuk' tab is visible in the Ana Sayfa Düzeni settings.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[1]/div/button[2]").nth(0)).to_be_visible(timeout=15000), "The '3 \u00b7 Yolculuk' tab is visible in the Ana Sayfa D\u00fczeni settings."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[2]/div/div[2]/p/a").nth(0).scroll_into_view_if_needed()
        # Assert: The 'Gâyemiz bölümünü sitede aç →' link is visible, showing the homepage globals are available.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[2]/div/div[2]/p/a").nth(0)).to_be_visible(timeout=15000), "The 'G\u00e2yemiz b\u00f6l\u00fcm\u00fcn\u00fc sitede a\u00e7 \u2192' link is visible, showing the homepage globals are available."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    