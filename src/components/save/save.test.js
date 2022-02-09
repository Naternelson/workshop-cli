import {setUpTestDir, tearDownTestDir, testDir} from '../test-helper/test-helper'
import inquirer from 'inquirer'
import {init} from "../init/init"
import {jest} from '@jest/globals'
import save from './save'
import fs  from "fs-extra"
import * as git from "../git-handler/git-handler"
import path from 'path'

describe("workshop save", ()=> {
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

    describe("conditions", () => {
        it("should not throw errors", async()=>{
            expect(save()).resolves.toBe(undefined)
            await init()
            expect(save()).resolves.toBe(undefined)
        })
        
        it("should check package.json to see if git should be enacted", async ()=> {
            inquirer.prompt = jest.fn().mockResolvedValue({        
                git: true, 
                gitBranch: true,
                remote: false, 
                feature: 'feature_hehe'
            })
            
            await init()
            await fs.writeFile(path.resolve(testDirPath, "example.md"), "# New File")
            await save()
        })
        it("should save to git with provided message", async () => {
            inquirer.prompt = jest.fn().mockResolvedValue({        
                git: true, 
                gitBranch: true,
                remote: false, 
                feature: 'feature_hehe'
            })
            
            await init()
            await fs.writeFile(path.resolve(testDirPath, "example.md"), "# New File")
            await save({message: "Message"})
        })
    })
})