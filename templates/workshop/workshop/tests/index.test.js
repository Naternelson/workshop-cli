import path from 'path'

if(import.meta.url.includes("component")){
    const component = require("../")
}

describe("This is a dummy test", ()=>{
    it("should be able to run", () => {
        expect("This to be true").toBeTruthy()
        expect(component()).toEqual("Foo - Bar")
    })
})