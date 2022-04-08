class BasePage {

    async navigateTo(path: string) {
        await browser.url(path);
    }

    async switches(section: string) {
      switch (section) {
        case 'Home':
          return browser.$('//*[@id="home"]');
        case 'F.A.Q.':
          return browser.$('//*[@id="root"]/div/div/header/div/div/div[3]/div[4]');
        case 'Partners':
          return browser.$('//*[@id="root"]/div/div/header/div/div/div[3]/div[3]');
        case 'Our mission':
          return browser.$('//*[@id="root"]/div/div/header/div/div/div[3]/div[2]') };
      }

    async clickOnSection(sectionName) {
      await (await this.switches(sectionName)).waitForDisplayed();
      await (await this.switches(sectionName)).click();
      await browser.pause(3000);
      await (await browser.$('//*[@id="root"]/div/div/header/div/div/div[1]/a/div')).scrollIntoView();

    }

    async click(ele: WebdriverIO.Element) {
        await ele.waitForClickable({ timeout: 5000 })
        if (!ele.elementId) {
            throw Error(ele.error.message)
        }
        await ele.click()
    }

    async typeInto(ele: WebdriverIO.Element, text: string) {
        await ele.waitForDisplayed({ timeout: 5000 })
        if (!ele.elementId) {
            throw Error(ele.error.message)
        }
        await ele.setValue(text)
    }

    async getSectionName(sectionName){
      await (await this.switches(sectionName)).waitForDisplayed();
      return await (await this.switches(sectionName)).getText();
    }
}

export default new BasePage();
