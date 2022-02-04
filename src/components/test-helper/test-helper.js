import path from "path"
import fs from "fs-extra"
export function resolveFromUrl(metaurl, ...dirs){
    return path.resolve(new URL(metaurl).pathname, ...dirs)
}

export function testDir(){
    return resolveFromUrl(import.meta.url, "../../../../test-dir") 
}

export async function setUpTestDir(){
    const dir = testDir()
    try{
        await fs.access(dir)
    } catch {
        await fs.mkdir(dir)
        await fs.writeFile(path.resolve(dir, "./package.json"), JSON.stringify({name: "test"}))
    } finally {
        process.chdir(dir)
    }
}

export async function tearDownTestDir(){
    const root = resolveFromUrl(import.meta.url, "../../../..")
    const dir = testDir()
    try{
        await fs.access(dir)
        await fs.rm(dir, {force: true, recursive: true})

    } catch (err) {
        console.log("Problem with cleaning test-dir")
        console.error(err)
    } finally {
        process.chdir(root)
    }
}