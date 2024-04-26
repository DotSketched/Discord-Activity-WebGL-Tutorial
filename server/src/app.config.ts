import config from "@colyseus/tools";
import express from "express";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import dotenv from 'dotenv';

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom";

dotenv.config();

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MyRoom);

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        app.post("/token", async (req, res) => {
            console.log(req)
            const response = await fetch(`https://discord.com/api/oauth2/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: process.env.NODE_DISCORD_CLIENT_ID,
                    client_secret: process.env.NODE_DISCORD_CLIENT_SECRET,
                    grant_type: 'authorization_code',
                    code: req.body.code,
                }),
            });
            const {access_token} = (await response.json());
            res.send({access_token});
        });

        app.use(express.json())

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/colyseus", monitor());
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
