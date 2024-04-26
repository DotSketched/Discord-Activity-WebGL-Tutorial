import {DiscordSDK} from "@discord/embedded-app-sdk";

const discordSdk = new DiscordSDK(import.meta.env.VITE_DISCORD_CLIENT_ID)

let auth;

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
   // Mobile device style: fill the whole browser client area with the game canvas:
   var meta = document.createElement('meta');
   meta.name = 'viewport';
   meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
   document.getElementsByTagName('head')[0].appendChild(meta);

   var canvas = document.querySelector("#unity-canvas");
   canvas.style.width = "100%";
   canvas.style.height = "100%";
   canvas.style.position = "fixed";

   document.body.style.textAlign = "left";
}

createUnityInstance(document.querySelector("#unity-canvas"), {
   dataUrl: "Build/Web.data.gz",
   frameworkUrl: "Build/Web.framework.js.gz",
   codeUrl: "Build/Web.wasm.gz",
   streamingAssetsUrl: "StreamingAssets",
   companyName: "DefaultCompany",
   productName: "Unity Webgl Activity",
   productVersion: "1.0",
   matchWebGLToCanvasSize: false, // Uncomment this to separately control WebGL canvas render size and DOM element size.
   // devicePixelRatio: 1, // Uncomment this to override low DPI rendering on high DPI displays.
}).then(async unityInstance => {
   await setupDiscordSdk();

   const member  = await fetch(`https://discord.com/api/v10/users/@me/guilds/${discordSdk.guildId}/member`, {
      headers: {
         // NOTE: we're using the access_token provided by the "authenticate" command
         Authorization: `Bearer ${auth.access_token}`,
         'Content-Type': 'application/json',
      },
   }).then((response) => response.json());

   let username = member?.nick ?? auth.user.global_name;
   let iconUrl = "";

   if (member?.avatar != null) {
      iconUrl = `https://cdn.discordapp.com/guilds/${discordSdk.guildId}/users/${auth.user.id}/avatars/${member.avatar}.png?size=${256}`;
   } else {
      iconUrl = `https://cdn.discordapp.com/avatars/${auth.user.id}/${auth.user.avatar}.png?size=${256}`;
   }

   if (unityInstance) {
      unityInstance.SendMessage("Bridge", "SetUserData", JSON.stringify({
         "username": username,
         "iconUrl": iconUrl,
      }))
   }

});

async function setupDiscordSdk(){
   await discordSdk.ready();

   // Authorize with Discord Client
   const { code } = await discordSdk.commands.authorize({
      client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
      response_type: "code",
      state: "",
      prompt: "none",
      scope: [
         "identify",
         "guilds",
         "guilds.members.read"
      ],
   });

   console.log(code)

   // Retrieve an access_token from your activity's server
   const response = await fetch("/server/token", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         code,
      }),
   });
   const { access_token } = await response.json();

   // Authenticate with Discord client (using the access_token)
   auth = await discordSdk.commands.authenticate({
      access_token,
   });

   if (auth == null) {
      throw new Error("Authenticate command failed");
   }
}