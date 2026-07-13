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
        
        # -> Fill the 'Email' field with 'admin@admin.com'.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill the 'Email' field with 'admin@admin.com'.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill the 'Email' field with 'admin@admin.com'.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the account/profile menu (click the profile/avatar button) to reveal the 'Çıkış Yap' (Logout) option.
        # Account link
        elem = page.get_by_role('link', name='Account', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Çıkış Yap' (Logout) link in the left sidebar to end the admin session and return to the login page.
        # link
        elem = page.get_by_role('link', name='Dashboard', exact=True)
        await elem.click(timeout=10000)
        
        # -> List all page links and read their visible labels to locate the 'Çıkış Yap' (Logout) link; if not found, open the account avatar menu to reveal logout.
        # Account link
        elem = page.get_by_role('link', name='Account', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Çıkış Yap' (Logout) link in the left sidebar to end the admin session and return to the login page.
        # link
        elem = page.get_by_role('link', name='Dashboard', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Open' menu button to expand the left sidebar so the 'Çıkış Yap' (Logout) link becomes clickable.
        # Open
        elem = page.locator('xpath=/html/body/div[2]/div/div/button/div/div')
        await elem.click(timeout=10000)
        
        # -> Click the 'Çıkış Yap' (Logout) link in the left sidebar to end the admin session.
        # Çıkış Yap link
        elem = page.get_by_role('link', name='Çıkış Yap', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the logged-out state is displayed
        # Assert: The browser is on the login page (/admin/login).
        await expect(page).to_have_url(re.compile("/admin/login"), timeout=15000), "The browser is on the login page (/admin/login)."
        await page.locator("xpath=/html/body/section[1]/div/form/div[1]/div[1]/div/input").nth(0).scroll_into_view_if_needed()
        # Assert: The email input is visible, showing the login form is displayed.
        await expect(page.locator("xpath=/html/body/section[1]/div/form/div[1]/div[1]/div/input").nth(0)).to_be_visible(timeout=15000), "The email input is visible, showing the login form is displayed."
        await page.locator("xpath=/html/body/section[1]/div/form/div[1]/div[2]/div/div/input").nth(0).scroll_into_view_if_needed()
        # Assert: The password input is visible, showing the login form is displayed.
        await expect(page.locator("xpath=/html/body/section[1]/div/form/div[1]/div[2]/div/div/input").nth(0)).to_be_visible(timeout=15000), "The password input is visible, showing the login form is displayed."
        await page.locator("xpath=/html/body/section[1]/div/form/div[2]/button").nth(0).scroll_into_view_if_needed()
        # Assert: The Login button is visible, confirming the logged-out state.
        await expect(page.locator("xpath=/html/body/section[1]/div/form/div[2]/button").nth(0)).to_be_visible(timeout=15000), "The Login button is visible, confirming the logged-out state."
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
    