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
        
        # -> Open the admin login page and display the login form so the username and password fields are visible.
        await page.goto("http://localhost:5001/admin/login")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Reload the admin root page and wait for the login form (E-posta and Parola fields and a login button) to appear.
        await page.goto("http://localhost:5001/admin")
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
        
        # -> Click the 'Haber / Duyuru Ekle' (Add News/Announcement) quick action on the dashboard to open the news creation form.
        # Haber / Duyuru Ekle link
        elem = page.get_by_role('link', name='Haber / Duyuru Ekle', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Başlık' field, enter an Özet and main content, then click the 'Save Draft' button to save the news as a draft.
        # title text field
        elem = page.locator('[id="field-title"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Taslak Haber Ba\u015fl\u0131\u011f\u0131")
        
        # -> Fill the 'Başlık' field, enter an Özet and main content, then click the 'Save Draft' button to save the news as a draft.
        # excerpt text area
        elem = page.locator('[id="field-excerpt"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("K\u0131sa \u00f6zet: Bu haber bir test tasla\u011f\u0131d\u0131r.")
        
        # -> Fill the 'Başlık' field, enter an Özet and main content, then click the 'Save Draft' button to save the news as a draft.
        # Fill the 'Başlık' field, enter an Özet and main content, then click the 'Save Draft' button to save the news as a draft.
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div/div/div/div/div[2]/div/div/div[5]/div[2]/div/div/div/div')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Bu bir test haber tasla\u011f\u0131 i\u00e7eri\u011fidir. \u0130\u00e7erik d\u00fczenlenebilir ve daha sonra yeniden a\u00e7\u0131lacakt\u0131r.")
        
        # -> Fill the 'Başlık' field, enter an Özet and main content, then click the 'Save Draft' button to save the news as a draft.
        # Save Draft button
        elem = page.locator('[id="action-save-draft"]')
        await elem.click(timeout=10000)
        
        # -> Fill the 'Başlık' field, enter an Özet and main content, then click the 'Save Draft' button to save the news as a draft.
        # Haberler listesini aç → link
        elem = page.get_by_role('link', name='Haberler listesini aç →', exact=True)
        await elem.click(timeout=10000)
        
        # -> Switch to the admin tab titled 'Editing - Haber - Payload' to view the admin news item and list.
        # Switch to tab AFFA
        page = context.pages[-1]  # switch to most recently active tab
        
        # -> Click the 'Haberler' breadcrumb at the top of the page to return to the admin news list and verify the draft 'Taslak Haber Başlığı' appears.
        # Haberler link
        elem = page.get_by_text('/', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Haberler', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the saved draft 'Taslak Haber Başlığı' from the Haberler list.
        # Taslak Haber Başlığı link
        elem = page.get_by_role('link', name='Taslak Haber Başlığı', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the draft news item is available in the list and can be reopened
        # Assert: The editor for the saved draft is open (URL contains '/admin/collections/news/2').
        await expect(page).to_have_url(re.compile("/admin/collections/news/2"), timeout=15000), "The editor for the saved draft is open (URL contains '/admin/collections/news/2')."
        # Assert: The title field contains the saved draft title 'Taslak Haber Başlığı'.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div[1]/div/div[1]/div/div/div/div[2]/div/div/div[1]/div/input").nth(0)).to_have_value("Taslak Haber Ba\u015fl\u0131\u011f\u0131", timeout=15000), "The title field contains the saved draft title 'Taslak Haber Ba\u015fl\u0131\u011f\u0131'."
        # Assert: The item status is shown as 'Draft' on the edit page.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[1]/div[1]/div[1]/ul/li[1]/div/div/span[2]").nth(0)).to_have_text("Draft", timeout=15000), "The item status is shown as 'Draft' on the edit page."
        
        # --> Verify the editing view for the saved draft is displayed
        # Assert: The edit page URL contains the news item path /admin/collections/news/2.
        await expect(page).to_have_url(re.compile("/admin/collections/news/2"), timeout=15000), "The edit page URL contains the news item path /admin/collections/news/2."
        # Assert: The title field contains the saved draft title 'Taslak Haber Başlığı'.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div[1]/div/div[1]/div/div/div/div[2]/div/div/div[1]/div/input").nth(0)).to_have_value("Taslak Haber Ba\u015fl\u0131\u011f\u0131", timeout=15000), "The title field contains the saved draft title 'Taslak Haber Ba\u015fl\u0131\u011f\u0131'."
        # Assert: The Status label displays 'Draft', confirming the item is a draft.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[1]/div[1]/div[1]/ul/li[1]/div/div/span[2]").nth(0)).to_have_text("Draft", timeout=15000), "The Status label displays 'Draft', confirming the item is a draft."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    