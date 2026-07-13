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
        
        # -> Open the admin login page by navigating to /admin/login so the login form and email field can be displayed.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Enter 'inbox@test.local' in the Email field, enter 'admin123' in the Password field, then click the 'Login' button to sign in as the inbox user.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("inbox@test.local")
        
        # -> Enter 'inbox@test.local' in the Email field, enter 'admin123' in the Password field, then click the 'Login' button to sign in as the inbox user.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Enter 'inbox@test.local' in the Email field, enter 'admin123' in the Password field, then click the 'Login' button to sign in as the inbox user.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Gelen Kutusu' (Inbox) link in the sidebar to open the inbox collections.
        # Gelen Kutusu link
        elem = page.get_by_role('link', name='Gelen Kutusu', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Kullanıcılar' (Users) link in the sidebar to attempt to open the Users list and verify it is inaccessible to the inbox-only role.
        # Kullanıcılar link
        elem = page.locator('[id="nav-users"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Open' sidebar toggle to fully reveal the left navigation so the 'İK Başvuruları' link can be located and clicked.
        # Open
        elem = page.locator('xpath=/html/body/div[2]/div/div/button/div/div')
        await elem.click(timeout=10000)
        
        # -> Click the 'İK Başvuruları' (IK Applications) link in the sidebar to open the IK Applications collection and verify whether it is accessible.
        # İK Başvuruları link
        elem = page.locator('[id="nav-ik-applications"]')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify inbox collections are accessible
        await page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[6]/div/div/div/a[1]").nth(0).scroll_into_view_if_needed()
        # Assert: Expected "İletişim Mesajları" to be visible in the inbox collections.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[6]/div/div/div/a[1]").nth(0)).to_be_visible(timeout=15000), "Expected \"\u0130leti\u015fim Mesajlar\u0131\" to be visible in the inbox collections."
        await page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/tbody/tr[1]/td[2]/a").nth(0).scroll_into_view_if_needed()
        # Assert: Expected the IK Applications entry "TestSprite IK İkinci" to be visible in the inbox collections.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[2]/div/div/table/tbody/tr[1]/td[2]/a").nth(0)).to_be_visible(timeout=15000), "Expected the IK Applications entry \"TestSprite IK \u0130kinci\" to be visible in the inbox collections."
        await page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[6]/div/div/div/a[2]").nth(0).scroll_into_view_if_needed()
        # Assert: Expected "Başvuru Dosyaları" to be visible in the inbox collections.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[6]/div/div/div/a[2]").nth(0)).to_be_visible(timeout=15000), "Expected \"Ba\u015fvuru Dosyalar\u0131\" to be visible in the inbox collections."
        
        # --> Verify non-inbox admin areas are not accessible
        # Assert: Expected 'Kullanıcılar' (Users) link to not be accessible to the inbox-only user.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[7]/div/div/div/a[1]").nth(0)).not_to_be_visible(timeout=15000), "Expected 'Kullan\u0131c\u0131lar' (Users) link to not be accessible to the inbox-only user."
        # Assert: Expected 'Ayarlar' (Settings) group to not be accessible to the inbox-only user.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[7]/button").nth(0)).not_to_be_visible(timeout=15000), "Expected 'Ayarlar' (Settings) group to not be accessible to the inbox-only user."
        # Assert: Expected 'İçerik' (Content) group to not be accessible to the inbox-only user.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[5]/button").nth(0)).not_to_be_visible(timeout=15000), "Expected '\u0130\u00e7erik' (Content) group to not be accessible to the inbox-only user."
        # Assert: Expected 'Okullar' (Schools) group to not be accessible to the inbox-only user.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/aside/div/nav/div[4]/button").nth(0)).not_to_be_visible(timeout=15000), "Expected 'Okullar' (Schools) group to not be accessible to the inbox-only user."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    