import { TextPacket } from "bdsx/bds/packets";
import { Player } from "bdsx/bds/player";

export function sendMessage(actor: Player, message: string, type = 1) {
        const packet = TextPacket.create();
        packet.message = message;
        packet.type = type;
        packet.sendTo(actor.getNetworkIdentifier());
        packet.dispose();
    }