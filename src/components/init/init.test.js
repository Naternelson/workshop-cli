// ====================
// Imports
// ====================
const init = require("./init")
const PackageHandler = require("../package-handler/package-handler.js")
const path = require("path")
const fs = require("fs-extra")
const inquirer = require("inquirer")

jest.mock(inquirer)

// ====================
// Main description
// ====================
describe("Initialization", () => {
    const defOptions = {
        git: true, 
        gitBranch: true, 
        name: 'example-feature'
    }

    // ====================
    // lifecycle Function
    // ====================
    const testDirPath = path.resolve(__dirname, "../../../test-dir")
    beforeEach(async ()=>{
        // create a test directory where files and subfolders will be created to be tested on
        try{
            await fs.access(testDirPath)
        } catch {
            await fs.mkdir(testDirPath)
            await fs.writeFile(path.resolve(testDirPath, "./package.json"), JSON.stringify({name: "test"}))
        } finally {
            process.chdir(testDirPath)
        }
    })
    afterEach(async ()=>{
        // destroy the test directory and all of its files
        const root = path.resolve(__dirname, "../../..")
        try{
            await fs.access(testDirPath)
            await fs.rm(testDirPath, {force: true, recursive: true})
        } catch (err) {
            console.log("Problem with cleaning test-dir")
            console.error(err)
        } finally {
            process.chdir(root)
        }
    })

    describe("package.json", () => {

        // ====================
        // Lifecycle Methods
        // ====================
        const pkg = new PackageHandler()
        beforeEach(()=>{
            pkg.filepath = path.resolve(process.cwd(), "./package.json")
        })
        afterEach(async()=> {
            const data = await pkg.getData()
            delete data.workshop 
            pkg.data = data 
            await pkg.save()
        })

        // ====================
        // Tests
        // ====================
        it("should change package.json to include workshop", async () => {
            await init({git: true, gitBranch: true})
            const pkgData = await pkg.getData()
            expect(pkgData).toHaveProperty("workshop")
        })
        it("workshop item should have a git and branch setting", async () => {
            await init({git: true, gitBranch: true})
            const pkgData = await pkg.getData()
            console.log({pkgData})
            expect(pkgData).toHaveProperty("workshop.git")
            expect(pkgData).toHaveProperty("workshop.git-branch")
        })
        it("git settings should reflect options given", async ()=>{
            await init({git: true, gitBranch: false})
            let pkgData = await pkg.getData()
            expect(pkgData).toHaveProperty("workshop.git", true)
            expect(pkgData).toHaveProperty("workshop.git-branch", false)

            await init({git: false, gitBranch: true})
            pkgData = await pkg.getData()
            expect(pkgData).toHaveProperty("workshop.git", false)
            expect(pkgData).toHaveProperty("workshop.git-branch", true)
        })
    })
    describe("template", () => {


        it("should setup directory folders if not present", async () => {
            await init(defOptions)
            const srcDir = path.resolve(testDirPath, "./src")
            const compDir = path.resolve(testDirPath, "./src/components")
            const feaDir = path.resolve(testDirPath, "./src/features")
            async function checkDir(dir){
                try {
                    await fs.access(dir)
                    return true
                } catch {
                    return false
                }
            }
            const arr = [srcDir, compDir, feaDir]
            let res = await checkDir(srcDir)
            expect(res).toBe(true)
        })
    })

    describe("prompts", () => {
        it("should prompt user for information on git", () => {
            
        })
        it.todo("should prompt user for information on git-branches")
        it.todo("should prompt user for name of feature")
        it.todo("should prompt user for name of component")
    })
    // describe("watching", () => {
    //     it.todo("should get new file event for files under tests, units and features")
    //     it.todo("should create a mirroring file for files")
    // })
})