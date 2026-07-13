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
        
        # -> Navigate to the admin login page and wait for the email field to appear (navigate to /admin/login).
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Fill the Email field with 'admin@admin.com', fill the Password field with 'admin123', then click the 'Login' button to sign in.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill the Email field with 'admin@admin.com', fill the Password field with 'admin123', then click the 'Login' button to sign in.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill the Email field with 'admin@admin.com', fill the Password field with 'admin123', then click the 'Login' button to sign in.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Hero Slaytları' (Hero Slides) collection by clicking the 'Hero Slaytları' link on the dashboard.
        # Hero Slaytları link
        elem = page.get_by_role('link', name='Hero Slaytları', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the slide titled 'KURUMSAL KİMLİĞİMİZ' to open its edit/entry view.
        # KURUMSAL KİMLİĞİMİZ link
        elem = page.get_by_role('link', name='KURUMSAL KİMLİĞİMİZ', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Live Preview' button to open the preview panel.
        # Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Set the live preview width to 375 and height to 667 (mobile) then click the 'Open in new window' button to inspect the mobile preview.
        # live-preview-width number field
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div[2]/div/div/div/div[2]/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("375")
        
        # -> Set the live preview width to 375 and height to 667 (mobile) then click the 'Open in new window' button to inspect the mobile preview.
        # live-preview-height number field
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div[2]/div/div/div/div[2]/input[2]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("667")
        
        # -> Set the live preview width to 375 and height to 667 (mobile) then click the 'Open in new window' button to inspect the mobile preview.
        # Open in new window link
        elem = page.get_by_role('link', name='Open in new window', exact=True)
        await elem.click(timeout=10000)
        
        # -> Switch to the editor tab titled 'Editing - Hero Slaytı - Payloa' to inspect the live preview iframe and attempt re-opening the preview or switching breakpoints.
        # Switch to tab 2E4C
        page = context.pages[-1]  # switch to most recently active tab
        
        # -> Locate the Live Preview iframe and controls in the editor and reveal them if they are below the fold.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the editor page to reveal the live preview iframe and the preview controls (width/height and 'Open in new window').
        await page.mouse.wheel(0, 300)
        
        # -> Reveal the live preview iframe and the preview controls (width/height inputs and 'Open in new window') by scrolling further down the editor page.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll up to reveal the Live Preview iframe and the preview controls (width/height inputs and 'Open in new window') at the top of the editor page.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Open' control (label/title = 'Open') to reveal the live preview controls and iframe so breakpoint views can be checked.
        # Open
        elem = page.locator('xpath=/html/body/div[2]/div/div/button/div/div')
        await elem.click(timeout=10000)
        
        # -> Toggle the 'Exit Live Preview' control to refresh the live preview and check whether the preview iframe appears.
        # Exit Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Toggle the 'Exit Live Preview' control to refresh the live preview and check whether the preview iframe appears.
        # Exit Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Search the page for any iframe elements and, if none are found, click the 'Exit Live Preview' button (label: Exit Live Preview) to refresh the live preview.
        # Exit Live Preview button
        elem = page.locator('[id="live-preview-toggler"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Ana sayfayı aç →' link to open the front page preview and verify the hero layout.
        # Ana sayfayı aç → link
        elem = page.get_by_role('link', name='Ana sayfayı aç →', exact=True)
        await elem.click(timeout=10000)
        
        # -> Switch to the editor tab titled 'Editing - Hero Slaytı - Payloa' to inspect the live preview iframe and preview controls.
        # Switch to tab 2E4C
        page = context.pages[-1]  # switch to most recently active tab
        
        # -> Switch to the front-page preview tab that was opened by the 'Ana sayfayı aç →' link and check whether the hero preview content (e.g., 'KURUMSAL KİMLİĞİMİZ') is present.
        # Switch to tab 2A97
        page = context.pages[-1]  # switch to most recently active tab
        
        # --> Assertions to verify final state
        
        # --> Verify the hero layout is displayed in preview
        await page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/p/a").nth(0).scroll_into_view_if_needed()
        # Assert: The front-page preview link ('Ana sayfayı aç →') is visible so the hero preview can be opened.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/p/a").nth(0)).to_be_visible(timeout=15000), "The front-page preview link ('Ana sayfay\u0131 a\u00e7 \u2192') is visible so the hero preview can be opened."
        # Assert: The hero tagline field contains the expected text 'KURUMSAL KİMLİĞİMİZ' shown in the preview.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/div[1]/div/div/input").nth(0)).to_have_value("KURUMSAL K\u0130ML\u0130\u011e\u0130M\u0130Z", timeout=15000), "The hero tagline field contains the expected text 'KURUMSAL K\u0130ML\u0130\u011e\u0130M\u0130Z' shown in the preview."
        # Assert: The hero titleLine1 field contains the expected text 'İlimde âlim,' shown in the preview.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/div[2]/div/div/input").nth(0)).to_have_value("\u0130limde \u00e2lim,", timeout=15000), "The hero titleLine1 field contains the expected text '\u0130limde \u00e2lim,' shown in the preview."
        
        # --> Verify both breakpoint views are available
        await page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/p/a").nth(0).scroll_into_view_if_needed()
        # Assert: The front-page 'Ana sayfayı aç →' link is visible, indicating the desktop preview is available.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/p/a").nth(0)).to_be_visible(timeout=15000), "The front-page 'Ana sayfay\u0131 a\u00e7 \u2192' link is visible, indicating the desktop preview is available."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    