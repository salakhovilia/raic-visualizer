import { ICircle } from "./types/ICircle";
import { ILine } from "./types/ILine";
import { IText } from "./types/IText";
import { IRect } from "./types/IRect";

export class Visualizer {
  public readonly PORT = 8800;
  private readonly ws;
  private readonly clients: any[] = [];

  public readonly OFFSET = 100;
  public readonly SCALE = 25;

  constructor() {
    if (process.env.MODE === "dev") {
      const ws = require("ws");

      this.ws = new ws.Server({ host: "0.0.0.0", port: this.PORT });

      console.log("Init websocket on", this.PORT);

      this.ws.on("connection", (client: any) => {
        this.clients.push(client);

        setInterval(() => {
          this.send(
            {
              type: "ping",
            },
            client
          );
        }, 5000);
      });
    }
  }
  send(command: any, ws?: any) {
    if (process.env.MODE !== "dev") {
      return;
    }

    if (ws) {
      ws.send(JSON.stringify(command));
    } else {
      for (const client of this.clients) {
        client.send(JSON.stringify(command));
      }
    }
  }

  addCircle(config: ICircle) {
    this.send({
      type: "draw",
      command: "circle",
      config,
    });
  }

  addCircles(configs: ICircle[]) {
    this.send(configs.map((e) => ({ type: "draw", command: "circle", config: e })));
  }

  addLine(config: ILine) {
    this.send({
      type: "draw",
      command: "line",
      config,
    });
  }

  addLines(configs: ILine[]) {
    this.send(configs.map((e) => ({ type: "draw", command: "line", config: e })));
  }

  addText(config: IText) {
    this.send({
      type: "draw",
      command: "text",
      config,
    });
  }

  addTexts(configs: IText[]) {
    this.send(configs.map((e) => ({ type: "draw", command: "text", config: e })));
  }

  addRect(config: IRect) {
    this.send({
      type: "draw",
      command: "rect",
      config,
    });
  }
}
