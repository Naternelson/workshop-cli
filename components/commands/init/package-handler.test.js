// ====================
// Imports
// ====================
const PackageHandler = require("./package-handler")
const path = require("path")

// ====================
// Main Description
// ====================
describe("package-handler", ()=>{
    
    // ====================
    // Declarations
    // ====================
    const pkg = new PackageHandler()

    // ====================
    // Lifecylce functions
    // ====================
    beforeEach(async ()=>{
        await pkg.new(path.resolve(__dirname, "./example.json"))
    })
    afterEach(async ()=>{
        await pkg.deleteFile()
    })

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