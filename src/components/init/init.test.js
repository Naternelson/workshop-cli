// ====================
// Imports
// ====================
import {jest} from '@jest/globals'
import {init} from "./init"
import PackageHandler from "../package-handler/package-handler"
import path from "path"
import fs from "fs-extra"
import { setUpTestDir, tearDownTestDir, testDir } from "../test-helper/test-helper"
import inquirer from 'inquirer'
import { featureChange } from '../git-handler/feature-change'

// jest.mock('inquirer')

// ====================
// Main description
// ====================
describe("Initialization", () => {
    const defOptions = {
        git: true, 
        gitBranch: true, 
        remote: false, 
        name: 'example-feature'
    }

    // ====================
    // lifecycle Function
    // ====================
    const testDirPath = testDir()
    let backupI
    beforeEach(async ()=> {
        backupI = inquirer.prompt
        inquirer.prompt = jest.fn().mockResolvedValue({        
            git: false, 
            gitBranch: false, 
            feature: 'new-feature'
        })
        await setUpTestDir()
    })
    afterEach(async () => {
        inquirer.prompt = backupI
        await tearDownTestDir()
    })

    describe("package.json", () => {

        // ====================
        // Lifecycle Methods
        // ====================
        const pkg = new PackageHandler()
        beforeEach(()=>{
            pkg.filepath = path.resolve(testDirPath, "./package.json")
        })

        // ====================
        // Tests
        // ====================
        it("should change package.json to include workshop", async () => {
            await init({})
            const pkgData = await pkg.getData()
            expect(pkgData).toHaveProperty("workshop")
        })
        it("workshop item should have a git and branch setting", async () => {
            await init({git: true, gitBranch: true})
            const pkgData = await pkg.getData()
            expect(pkgData).toHaveProperty("workshop.git")
            expect(pkgData).toHaveProperty("workshop.git-branch")
        })
        it("git settings should reflect options given", async ()=>{
            await init({})
            let pkgData = await pkg.getData()
            expect(pkgData).toHaveProperty("workshop.git", false)
            expect(pkgData).toHaveProperty("workshop.git-branch", false)
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
                } catch (err) {
                    console.error(err)
                    return false
                }
            }
            const arr = [srcDir, compDir, feaDir]
            let res = await Promise.all([checkDir(srcDir), checkDir(compDir), checkDir(feaDir)])
            expect(res.every(r => !!r)).toBe(true)
        })
    })

    describe("actions", () => {
        const resolveInq = obj => inquirer.prompt = jest.fn().mockResolvedValue(obj)
        it("should init new git repo if git=true is passed", async() => {
            resolveInq({git: true, gitBranch: true, remote: false})
            await init()
            fs.access(path.resolve(testDirPath, ".git"), fs.constants.R_OK, (err) => {
                expect(!!err).toBe(false)
            })
        })
        it("should create a new feature if feature[name] is passed", async ()=>{
            resolveInq({git: true, gitBranch: true, remote: false, feature: 'awesome-feature'})
            await init()
            fs.access(path.resolve(testDirPath, "./src/features/awesome-feature"), fs.constants.R_OK, (err) => {
                console.error({err})
                expect(!!err).toBe(false)
                
            })

        })
        it.todo("should create a new component is component[name] is passed")
    })
    // describe("watching", () => {
    //     it.todo("should get new file event for files under tests, units and features")
    //     it.todo("should create a mirroring file for files")
    // })
})