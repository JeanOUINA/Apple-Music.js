import { getMetadata } from "./metadata";

export * from "./metadata";
export * from "./controls";
export * from "./osascript";

getMetadata()
.then(metadata => {
    console.log(metadata);
})