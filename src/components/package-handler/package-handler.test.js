// ====================
// Imports
// ====================
// const PackageHandler = require("./package-handler")
// const path = require("path")

import PackageHandler from "./package-handler"
import path from "path"
import { setUpTestDir, tearDownTestDir, testDir, resolveFromUrl } from "../test-helper/test-helper"

// ====================
// Main Description
// ====================
describe.skip("package-handler", ()=>{
    
    // ====================
    // Declarations
    // ====================
    const pkg = new PackageHandler()

    // ====================
    // Lifecylce functions
    // ====================
    beforeEach(async ()=>{
        await setUpTestDir()
        await pkg.new(path.resolve(testDir(), "./package.json"))
    })
    afterEach(tearDownTestDir)

    // ====================
    // Tests
    // ====================
    it("should have an empty default setting", async ()=>{
        const data = await pkg.getData()
        expect(Object.keys(data).length).toBe(0)
    })
    it("should be able to change propertys of JSON file", async () => {
        pkg.data = {
            hello: 'world',
            goodbye: 'planet'
        }
        await pkg.save()
        expect(await pkg.getData()).toHaveProperty("hello", "world")
        expect(await pkg.getData()).toHaveProperty("goodbye", "planet")
    })
})