import { HfInference } from "@huggingface/inference";

import Discord from 'discord.js';

import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'prod') {
	dotenv.config();
	console.log("dotenv is doing stuff");
}

const discord_client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
		Discord.GatewayIntentBits.DirectMessages
	]
});

const hf = new HfInference(process.env.HF_TOKEN);


async function query(data) {
	const result = await hf.textGeneration({
		model: process.env.MODEL,
		inputs: data,
		parameters: { max_new_tokens: 100, max_time: 20, return_full_text: false, temperature: 0.8, repetition_penalty: 1.1, top_p: 0.5}
	});
	return result;
}

discord_client.on('ready', () => {
	console.log(`Logged in as ${discord_client.user.tag}!`);
});

discord_client.on('message', () => {
	console.log("fjlsaggakljagkj");
});

discord_client.on('messageCreate', async message => {
	// ignore messages from self, empty messages, dms
	if (message.author.bot || message.content == "" || message.guild === null) {
		// console.log("no");
		return;
	}
	console.log(`message received from ${message.author}`);

	// message.channel.startTyping();
	message.channel.sendTyping();

	let botResponse = "";

	console.log(message.content);

	// delete bot mention
	let input = "<s>[INST]" + message.content.replace('<@1161523308689371197>', '') + "[/INST]"
	console.log(input);

	let output = await query(input);

	console.log(output.generated_text);

	botResponse = output.generated_text;

	// message.channel.stopTyping();

	message.reply(botResponse)
		.then(() => console.log("Replied"))
		.catch(console.error);
})

discord_client.login(process.env.TOKEN);
