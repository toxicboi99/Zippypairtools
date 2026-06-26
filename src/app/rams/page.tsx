import { TextLoader } from "langchain/document_loaders/fs/text"
import path from "path"

export default async function Page() {
    const filePath = path.join(process.cwd(), "src/app/docs/ram.txt")
    const loader = new TextLoader(filePath)
    const docs = await loader.load()

    return (
        <>
            <pre>{JSON.stringify(docs, null, 2)}</pre>
            <h1>hello world from the rams page</h1>
        </>
    )
}