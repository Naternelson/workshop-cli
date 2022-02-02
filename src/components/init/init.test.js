// ====================
// Imports
// ====================
const init = require("./init")
const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")

// ====================
// Main description
// ====================
describe("Initialization", () => {
    // ====================
    // Lifecycle Methods
    // ====================
    const pkg = new PackageHandler()
    beforeEach(()=>{
        process.chdir(path.resolve(__dirname,"../../.."))
        
        pkg.filepath = path.resolve(process.cwd(), "./package.json")
        console.log({pkg: pkg.filepath})
    })
    afterEach(async()=> {
        const data = await pkg.getData()
        delete data.workshop 
        pkg.data = data 
        await pkg.save()
    })

    describe("package.json", () => {
        it("should change package.json to include workshop", async () => {
            
            await init({git: true, gitBranch: true})
            const pkgData = await pkg.getData()
            expect(pkgData).toHaveProperty("workshop")
        })
        it.todo("workshop item should have a git and branch setting")
        it.todo("git settings should reflect options given")
    })
    describe("workshop", () => {
        it.todo("should create a src/components if not present")
        it.todo("should create workshop/units")
        it.todo("should create workshop/tests")
        it.todo("should create workshop/feature")
        it.todo("should create a package.json file for workshop")
    })
    describe("components", () => {
        it.todo("should create a src/components if not present")
    })
    describe("features", () => {
        it.todo("should create a src/features if not present")
    })
    describe("setup", () => {
        it.todo("should prompt user for information on git")
        it.todo("should prompt user for information on git-branches")
        it.todo("should prompt user for name of feature")
        it.todo("should prompt user for name of component")
    })
    describe("watching", () => {
        it.todo("should get new file event for files under tests, units and features")
        it.todo("should create a mirroring file for files")
    })
})