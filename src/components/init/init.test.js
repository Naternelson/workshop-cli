// ====================
// Imports
// ====================
// const {init} = require("./init")
// const PackageHandler = require("../package-handler/package-handler.js")
// const path = require("path")
// const fs = require("fs-extra")
// const inquirer = require("inquirer")

import {init} from "./init"
import PackageHandler from "../package-handler/package-handler"
import path from "path"
import fs from "fs-extra"
import inquirer from "inquirer"
import { setUpTestDir, tearDownTestDir } from "../test-helper/test-helper"
// import jest from "jest"

// jest.mock(inquirer)

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
    const testDirPath = path.resolve(new URL(import.meta.url).pathname, "../../../test-dir")
    beforeEach(setUpTestDir)
    afterEach(tearDownTestDir)

    describe.only("package.json", () => {

        // ====================
        // Lifecycle Methods
        // ====================
        const pkg = new PackageHandler()
        beforeEach(()=>{
            pkg.filepath = path.resolve(testDirPath, "./package.json")
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
        it.only("should change package.json to include workshop", async () => {
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