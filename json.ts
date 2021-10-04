// sacri's json scripts

import { appendFileSync, readFileSync, statSync, writeFileSync } from "fs";

export function parseJSON(path: string) { // Reads the JSON file at the path given
        initJSONifNotExist(path);
        return JSON.parse(readFileSync(path, "utf8"));
}

function initJSONifNotExist(path: string) { // Creates a json file if it does not exist
        if (!isFile(path)) {
            initJSON(path);
        }
}

export function writeJSON(path: string, data: string) { // writes data to a file specified at the given path
        initJSONifNotExist(path);
        writeFileSync(path, JSON.stringify(data));
}

export function isFile(filepath:string):boolean {
        try {
            if (JSON.parse(readFileSync(path, "utf8")) == "{}" || JSON.parse(readFileSync(path, "utf8")) == "") return false;
            else return statSync(filepath).isFile();
        } catch (err) {
            return false;
        }
}

function initJSON(path: string) {
        writeFileSync(path, "{}")
}
