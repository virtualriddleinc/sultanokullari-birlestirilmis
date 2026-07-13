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
        
        # -> Fill 'Email' with admin@admin.com and 'Password' with admin123, then click the 'Login' button.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill 'Email' with admin@admin.com and 'Password' with admin123, then click the 'Login' button.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill 'Email' with admin@admin.com and 'Password' with admin123, then click the 'Login' button.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Hero Slaytları' link in the dashboard quick actions to open the hero slides collection.
        # Hero Slaytları link
        elem = page.get_by_role('link', name='Hero Slaytları', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the 'Üst etiket' and all three 'Başlık satırı' fields, then click the 'Create New' button under 'Slayt medyası' to open the media upload dialog.
        # tagline text field
        elem = page.locator('[id="field-tagline"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Yeni Ba\u015fl\u0131k")
        
        # -> Fill the 'Üst etiket' and all three 'Başlık satırı' fields, then click the 'Create New' button under 'Slayt medyası' to open the media upload dialog.
        # titleLine1 text field
        elem = page.locator('[id="field-titleLine1"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Okula Ho\u015fgeldiniz")
        
        # -> Fill the 'Üst etiket' and all three 'Başlık satırı' fields, then click the 'Create New' button under 'Slayt medyası' to open the media upload dialog.
        # titleLine2 text field
        elem = page.locator('[id="field-titleLine2"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("E\u011fitimde M\u00fckemmellik")
        
        # -> Fill the 'Üst etiket' and all three 'Başlık satırı' fields, then click the 'Create New' button under 'Slayt medyası' to open the media upload dialog.
        # titleLine3 text field
        elem = page.locator('[id="field-titleLine3"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Gelece\u011fe Haz\u0131r")
        
        # -> Fill the 'Üst etiket' and all three 'Başlık satırı' fields, then click the 'Create New' button under 'Slayt medyası' to open the media upload dialog.
        # Create New button
        elem = page.get_by_role('button', name='Create New', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Paste URL' button in the media dialog to use a remote image URL instead of uploading a local file.
        # Paste URL button
        elem = page.get_by_role('button', name='Paste URL', exact=True)
        await elem.click(timeout=10000)
        
        # -> Enter a remote image URL into the media dialog's URL field, fill the 'Alternatif metin' field, and click the media dialog 'Save' button to attach the image.
        # text field
        elem = page.get_by_text('https://via.placeholder.com/1920x1080.png', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("https://via.placeholder.com/1920x1080.png")
        
        # -> Enter a remote image URL into the media dialog's URL field, fill the 'Alternatif metin' field, and click the media dialog 'Save' button to attach the image.
        # alt text field
        elem = page.locator('[id="field-alt"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Hero slide image")
        
        # -> Enter a remote image URL into the media dialog's URL field, fill the 'Alternatif metin' field, and click the media dialog 'Save' button to attach the image.
        # Save button
        elem = page.locator('xpath=/html/body/div[5]/dialog/div[2]/div[2]/main/form/div[2]/div/div[2]/div/div/button')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the media dialog to attach the image.
        # Save button
        elem = page.locator('xpath=/html/body/div[5]/dialog/div[2]/div[2]/main/form/div[2]/div/div[2]/div/div/button')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the media dialog to attach the image and close the media dialog.
        # Save button
        elem = page.locator('xpath=/html/body/div[5]/dialog/div[2]/div[2]/main/form/div[2]/div/div[2]/div/div/button')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button in the media dialog to attach the image and close the dialog.
        # Save button
        elem = page.locator('xpath=/html/body/div[5]/dialog/div[2]/div[2]/main/form/div[2]/div/div[2]/div/div/button')
        await elem.click(timeout=10000)
        
        # -> Click the media dialog 'Close' button (the X in the dialog header) to close the dialog and check if the media preview appears in the slide form.
        # Close button
        elem = page.get_by_text('[Untitled]', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Close', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill 'Dosya yolu (public)' with the image URL, fill 'Alternatif metin', fill the 'Açıklama' description, then click the 'Save' button.
        # slideMedia.src text field
        elem = page.locator('[id="field-slideMedia__src"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("https://via.placeholder.com/1920x1080.png")
        
        # -> Fill 'Dosya yolu (public)' with the image URL, fill 'Alternatif metin', fill the 'Açıklama' description, then click the 'Save' button.
        # slideMedia.alt text field
        elem = page.locator('[id="field-slideMedia__alt"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Hero slide image")
        
        # -> Fill 'Dosya yolu (public)' with the image URL, fill 'Alternatif metin', fill the 'Açıklama' description, then click the 'Save' button.
        # description text area
        elem = page.locator('[id="field-description"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Bu bir test slayt a\u00e7\u0131klamas\u0131d\u0131r.")
        
        # -> Fill 'Dosya yolu (public)' with the image URL, fill 'Alternatif metin', fill the 'Açıklama' description, then click the 'Save' button.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the saved slide is available for management
        # Assert: Slide title line 1 is saved and visible in the form.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/div[2]/div/div/input").nth(0)).to_have_value("Okula Ho\u015fgeldiniz", timeout=15000), "Slide title line 1 is saved and visible in the form."
        # Assert: Slide description is saved and visible in the form.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/div[5]/div/div[1]/textarea").nth(0)).to_have_text("Bu bir test slayt a\u00e7\u0131klamas\u0131d\u0131r.", timeout=15000), "Slide description is saved and visible in the form."
        # Assert: Slide media source URL is saved and visible in the form.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/div[8]/div/div[2]/div[3]/div/input").nth(0)).to_have_value("https://via.placeholder.com/1920x1080.png", timeout=15000), "Slide media source URL is saved and visible in the form."
        # Assert: Slide media alt text is saved and visible in the form.
        await expect(page.locator("xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[1]/div/div/div[8]/div/div[2]/div[4]/div/input").nth(0)).to_have_value("Hero slide image", timeout=15000), "Slide media alt text is saved and visible in the form."
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
    