import { ReadFile } from "filen";

export async function GetPKGInfo() {
    const file = await ReadFile([__dirname, "..", "..", "package.json"], {
        parseToJson: true
    });

    if (file) return file;

    throw new Error("package information not found!");
}