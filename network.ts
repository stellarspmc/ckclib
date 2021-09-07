// mineyee2913's code

import { DeviceOS } from "bdsx/common";
import { events } from "bdsx/event";
import { MinecraftPacketIds } from "bdsx/bds/packetIds";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";

let nIt = new Map();
let nMt = new Map();
let nXt = new Map();
let nSt = new Map();
events.packetAfter(MinecraftPacketIds.Login).on((ptr, networkIdentifier) => {
    let conq = ptr.connreq;
    if (conq === null) return;
    const cert = conq.cert;
    const device = DeviceOS[conq.getDeviceOS()];
    const xuid = cert.getXuid();
    const username = cert.getId();
    let [ip, port] = String(networkIdentifier).split('|');
    console.log(`${username} : ${ip} [${port}]`);
    nXt.set(username, xuid);
    nIt.set(username, networkIdentifier);
    nMt.set(networkIdentifier, username);
    nSt.set(networkIdentifier, device);
});

/**
  *get playerId by Name
*/
export function IdByName(PlayerName: string) {
    let Rlt:NetworkIdentifier = nIt.get(PlayerName);
    return Rlt;
}

/**
  *get playerName by Id
*/
export function NameById(networkIdentifier: NetworkIdentifier) {
        let actor = networkIdentifier.getActor();
        let playerName:string;
        try {
            playerName = actor!.getName();
        } catch {
            playerName = nMt.get(networkIdentifier);
        }
        return playerName;
    }