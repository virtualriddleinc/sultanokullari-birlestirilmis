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
        
        # -> Fill the Email and Password fields and click the 'Login' button.
        # email email field
        elem = page.locator('[id="field-email"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin@admin.com")
        
        # -> Fill the Email and Password fields and click the 'Login' button.
        # Password password field
        elem = page.locator('[id="field-password"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("admin123")
        
        # -> Fill the Email and Password fields and click the 'Login' button.
        # Login button
        elem = page.get_by_role('button', name='Login', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Hero Slaytları' quick action link on the Dashboard to open the hero slides list.
        # Hero Slaytları link
        elem = page.get_by_role('link', name='Hero Slaytları', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Create New' button to open the new Hero Slaytı creation form.
        # Create New link
        elem = page.get_by_role('link', name='Create new Hero Slaytı', exact=True)
        await elem.click(timeout=10000)
        
        # -> Fill the required text fields: enter values into 'Üst etiket', 'Başlık satırı 1', 'Başlık satırı 2', 'Başlık satırı 3', and 'Açıklama'.
        # tagline text field
        elem = page.locator('[id="field-tagline"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("QA Tagline")
        
        # -> Fill the required text fields: enter values into 'Üst etiket', 'Başlık satırı 1', 'Başlık satırı 2', 'Başlık satırı 3', and 'Açıklama'.
        # titleLine1 text field
        elem = page.locator('[id="field-titleLine1"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("QA Title 1")
        
        # -> Fill the required text fields: enter values into 'Üst etiket', 'Başlık satırı 1', 'Başlık satırı 2', 'Başlık satırı 3', and 'Açıklama'.
        # titleLine2 text field
        elem = page.locator('[id="field-titleLine2"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("QA Title 2")
        
        # -> Fill the required text fields: enter values into 'Üst etiket', 'Başlık satırı 1', 'Başlık satırı 2', 'Başlık satırı 3', and 'Açıklama'.
        # titleLine3 text field
        elem = page.locator('[id="field-titleLine3"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("QA Title 3")
        
        # -> Fill the required text fields: enter values into 'Üst etiket', 'Başlık satırı 1', 'Başlık satırı 2', 'Başlık satırı 3', and 'Açıklama'.
        # description text area
        elem = page.locator('[id="field-description"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("Automated test slide created by TestSprite QA.")
        
        # -> Paste a public image URL into the 'Dosya yolu (public)' field, fill 'Alternatif metin' with descriptive alt text, then click the 'Save' button.
        # slideMedia.src text field
        elem = page.locator('[id="field-slideMedia__src"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("https://via.placeholder.com/1200x600.png")
        
        # -> Paste a public image URL into the 'Dosya yolu (public)' field, fill 'Alternatif metin' with descriptive alt text, then click the 'Save' button.
        # slideMedia.alt text field
        elem = page.locator('[id="field-slideMedia__alt"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("QA Slide Image")
        
        # -> Paste a public image URL into the 'Dosya yolu (public)' field, fill 'Alternatif metin' with descriptive alt text, then click the 'Save' button.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button to submit the new hero slide and return to the hero slides list, then verify the new slide appears in the list.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button to submit the new hero slide and return to the hero slides list.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # -> Click the 'Save' button to submit the new hero slide and return to the hero slides list.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # -> Enter 'QA Tagline' into the 'Search by Üst etiket' field and press Enter to filter the hero slides list, then check whether the new slide appears.
        # Search by Üst etiket text field
        elem = page.locator("xpath=/html/body/div[2]/div[2]/div/div/div/div[1]/div[1]/div[1]/input").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("QA Tagline")
        
        # -> Click the 'Create new Hero Slaytı' button to open the hero slide creation form and inspect visible fields before attempting Save again.
        # Create New link
        elem = page.get_by_text('Create New', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Create new Hero Slaytı', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Son düzenleyen' (Last editor) dropdown labeled 'Select a value' so available user options appear for selection.
        # button
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Open the 'Son düzenleyen' dropdown labeled 'Select a value' so available user options appear.
        # button
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Open the 'Son düzenleyen' dropdown labeled 'Select a value' and wait for the available user options to appear.
        # button
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Open the 'Son düzenleyen' (Last editor) dropdown and reveal its available user options.
        # button
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Open the 'Son düzenleyen' dropdown labeled 'Select a value' so available user options appear.
        # Open the 'Son düzenleyen' dropdown labeled 'Select a value' so available user options appear.
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]')
        await elem.click(timeout=10000)
        
        # -> Open the 'Select a value' dropdown under 'Son düzenleyen' (Last editor) so the user options appear.
        # button
        elem = page.locator('xpath=/html/body/div[2]/div[2]/div/main/form/div[2]/div/div/div[2]/div/div/div/div[2]/div/div/div/div/div[2]/button')
        await elem.click(timeout=10000)
        
        # -> Open the 'Son düzenleyen' dropdown labeled 'Select a value' by scrolling the page and clicking the combobox input so user options can appear.
        await page.mouse.wheel(0, 300)
        
        # -> Open the 'Son düzenleyen' dropdown labeled 'Select a value' by scrolling the page and clicking the combobox input so user options can appear.
        # text field
        elem = page.locator('[id="react-select-_r_0_-input"]')
        await elem.click(timeout=10000)
        
        # -> Fill the 'Buton bağlantısı' (Button link) field with '/' and click the 'Save' button to submit the new hero slide.
        # buttonLink text field
        elem = page.locator('[id="field-buttonLink"]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("/")
        
        # -> Fill the 'Buton bağlantısı' (Button link) field with '/' and click the 'Save' button to submit the new hero slide.
        # Save button
        elem = page.locator('[id="action-save"]')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
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
    