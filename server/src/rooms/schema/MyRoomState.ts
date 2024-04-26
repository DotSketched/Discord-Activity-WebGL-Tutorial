import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") username: string
  @type("string") iconUrl: string
}

export class MyRoomState extends Schema {

  @type({map: Player}) players = new MapSchema<Player>()

}
