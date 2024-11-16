import hs from 'hs-test-web';
import puppeteer from 'puppeteer';
import * as reactServer from 'hs-test-web-server';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const sleep = (ms) => new Promise(res => setTimeout(res, ms));


async function stageTest() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args:['--start-maximized', '--disable-infobar'],
        ignoreDefaultArgs: ['--enable-automation'],
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:31328');



    //await sleep(1000000);
    page.on('console', msg => console.log(msg.text()));

    let result = await hs.testPage(page,
        () => {
            // test #1
            // HELPERS-->
            // method to check if element with id exists
            this.elementExists = (id, nodeNames) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                else return (nodeNames && !nodeNames.includes(element.nodeName.toLowerCase()));
            };

            // method to check if element with id has right text
            this.elementHasText = (id, correctText) => {
                const element = document.body.querySelector(id);
                if (!element || !element.innerText) return true;

                if (correctText) {
                    return !element.innerText.includes(correctText);
                }
                return element.innerText.trim().length === 0;
            };

            // method to check if element with id has right attribute
            this.elementHasAttribute = (id, attribute, value) => {
                const element = document.body.querySelector(id);
                if (!element) return true;
                const attributeValue = element.getAttribute(attribute);
                if (!attributeValue) return true;
                if (value) return attributeValue !== value;
                return false;
            };

            // method to check if element exist in the specified amount
            this.elementExistsInAmount = (id, amount) => {
                const elements = document.body.querySelectorAll(id);
                return elements.length !== amount;
            }

            // method to check flat list items
            this.checkFlatListItems = () => {
                const flats = this.flats;

                for (let i = 1; i <= flats.length; i++) {
                    const flat = flats[i - 1];
                    const flatListItem = `main ul > li:nth-child(${i})`

                    // check if li has key attribute as id
                    //if (this.elementHasAttribute(flatListItem, "key", flat.id.toString())) return this.missingAttributeMsg(flatListItem, "key");

                    // check h3 flat name
                    const h3 = flatListItem + " > h3";
                    if (this.elementExists(h3)) return this.missingElementMsg(h3);
                    if (this.elementHasText(h3, flat.name)) return this.wrongTextMsg(h3, flat.name);

                    // check p location
                    const pLocation = flatListItem + ` > p:nth-of-type(1)`;
                    if (this.elementExists(pLocation)) return this.missingElementMsg(pLocation);
                    if (this.elementHasText(pLocation, `Location: ${flat.location}`))
                        return this.wrongTextMsg(pLocation, `Location: ${flat.location}`);

                    // check p price
                    const pPrice = flatListItem + ` > p:nth-of-type(2)`;
                    if (this.elementExists(pPrice)) return this.missingElementMsg(pPrice);
                    if (this.elementHasText(pPrice, `Price: ${flat.price}`))
                        return this.wrongTextMsg(pPrice, `Price: ${flat.price}`);

                    // check p availability
                    const pAvailability = flatListItem + ` > p:nth-of-type(3)`;
                    if (this.elementExists(pAvailability)) return this.missingElementMsg(pAvailability);
                    if (this.elementHasText(pAvailability, `Availability: ${flat.available ? 'Available' : 'Not Available'}`))
                        return this.wrongTextMsg(pAvailability, `Availability: ${flat.available ? 'Available' : 'Not Available'}`);

                    // check img
                    const img = flatListItem + " > img";
                    if (this.elementExists(img)) return this.missingElementMsg(img);
                    if (this.elementHasAttribute(img, "src", flat.image)) return this.wrongAttributeMsg(img, "src", flat.image);
                    if (this.elementHasAttribute(img, "alt", flat.name)) return this.wrongAttributeMsg(img, "alt", flat.name);
                }
                return false;
            }


            // CONSTANTS-->
            const theElement = "The element with the selector of";

            this.flats = [
                {
                    id: 1,
                    name: 'Cozy Apartment',
                    location: 'Downtown',
                    price: '$1500/month',
                    available: true,
                    image: 'https://example.com/cozy-apartment.jpg',
                },
                {
                    id: 2,
                    name: 'Modern Loft',
                    location: 'Midtown',
                    price: '$1800/month',
                    available: false,
                    image: 'https://example.com/modern-loft.jpg',
                },
                {
                    id: 3,
                    name: 'Charming Studio',
                    location: 'Uptown',
                    price: '$1200/month',
                    available: true,
                    image: 'https://example.com/charming-studio.jpg',
                },
                // Add more flats as needed
            ];
            // <--CONSTANTS

            // MESSAGES-->
            this.missingElementMsg = (selector) => {
                return `${theElement} "${selector}" is missing in the body of the HTML document.`;
            };
            this.wrongTagMsg = (id, tag, tagAlt) => {
                if (tagAlt) return `${theElement} "${id}" should be a/an ${tag} or ${tagAlt} tag.`;
                else return `${theElement} "${id}" should be a/an ${tag} tag.`;
            };
            this.wrongTextMsg = (id, text) => {
                return `${theElement} "${id}" should have the text: "${text}".`;
            };
            this.missingTextMsg = (id) => {
                return `${theElement} "${id}" should have some text.`;
            };
            this.wrongAttributeMsg = (id, attribute, value) => {
                return `${theElement} "${id}" should have the attribute "${attribute}" with the value "${value}".`;
            };
            this.missingAttributeMsg = (id, attribute) => {
                return `${theElement} "${id}" should have the attribute "${attribute}".`;
            }
            this.wrongAmountOfElementsMsg = (id, amount) => {
                return `There should be "${amount}" elements with the selector of "${id}" in the body of the HTML document.`;
            }
            // <--MESSAGES
            return hs.correct();

        }, () => {
            // test #2
            // HEADER TAGS

            // check if header exists
            if (this.elementExists("header")) return hs.wrong(this.missingElementMsg("header"));

            // check if h1 exists in header
            const h1 = "header > h1";
            if (this.elementExists(h1)) return hs.wrong(this.missingElementMsg(h1));

            // check if h1 has text
            if (this.elementHasText(h1)) return hs.wrong(this.missingTextMsg(h1));

            return hs.correct();
        }, () => {
            // test #3
            // MAIN TAGS

            // check if main exists
            if (this.elementExists("main")) return hs.wrong(this.missingElementMsg("main"));

            // check if h2 exists in main
            const h2 = "main h2";
            if (this.elementExists(h2)) return hs.wrong(this.missingElementMsg(h2));

            // check if h2 has text "Flat List"
            if (this.elementHasText(h2, "Flat List")) return hs.wrong(this.wrongTextMsg(h2, "Flat List"));

            return hs.correct();
        }, () => {
            // test #4
            // UL TAGS

            // check if ul exists in main
            const ul = "main ul";
            if (this.elementExists(ul)) return hs.wrong(this.missingElementMsg(ul));

            // check if ul has 3 li children
            if (this.elementExistsInAmount(ul + " > li", 3)) return hs.wrong(this.wrongAmountOfElementsMsg(ul + " > li", 3));

            // check if li has h3, p, p, p and img
            const checkResult = this.checkFlatListItems();
            if (checkResult) return hs.wrong(checkResult);

            return hs.correct();

        }

    );

    await sleep(2000);
    await browser.close();
    return result;


}


it("Test stage", async () => {
    // await new Test().runTests()
    let result = await reactServer.startServerAndTest(
        'localhost', 31328, resolve(__dirname, '..'), stageTest
    )

    if (result['type'] === 'wrong') {
        throw new Error(result['message']);
    }
}).timeout(30000);