<template>
    <div>
        <input type="text" v-model="host"> {{state}}
        <div id="content">
            <v-stage :config="configKonva" :ref="'stage'">
                <v-layer>
                    <component :is="'v-' + shape.command" v-for="(shape, key) of shapes" :config="shape.config" :key="shape.command + key"></component>
                </v-layer>
            </v-stage>
        </div>
    </div>
</template>

<script>
const width = window.innerWidth - 50;
const height = window.innerHeight - 50;

export default {
    computed: {
    },
    data() {
        return {
            host: "ws://localhost:8800",
            ws: undefined,
            state: "Not connected",
            configKonva: {
                width,
                height,
                draggable: true,
                y: height / 2,
                // offsetX: width / 4,
                scaleY: -1
            },
            shapes: []
        }
    },
    methods: {
        parseObjectMessage(message) {
            console.log(message);
            if (!message.type) {
                    return;
                }

            if (message.type.toLowerCase() === "draw") {
                if (message.command === "text") {
                    // message.config.offsetX = width / 4;
                    message.config.scaleX = this.configKonva.scaleX;
                    message.config.scaleY = this.configKonva.scaleY;
                }
                if (message.config.id) {
                    const index = this.shapes.findIndex(e => e.config.id && String(e.config.id) === String(message.config.id));
                    console.log(index, this.shapes);

                    if (index !== -1) {
                        this.shapes.splice(index, 1, message);
                        return;
                    }
                }
                this.shapes.push(message);
            }
        },
        initWebSocket() {
            this.ws = new WebSocket(this.host);

            this.ws.onopen = (e) => {
                console.log("[open] Соединение установлено");
                this.state = "Connected";
                this.shapes.splice(0, this.shapes.length);
            };

            this.ws.onmessage = (event) => {
                let message
                try {
                    message = JSON.parse(event.data);
                } catch(e) {
                    console.error("Error parse",e);
                    return
                }

                if (typeof message === "object") {
                    if (Array.isArray(message)) {
                        for (const config of message) {
                            this.parseObjectMessage(config);
                        }
                    } else {
                        this.parseObjectMessage(message);
                    }
                }
            };

            this.ws.onclose = (event) => {
                if (event.wasClean) {
                    console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
                } else {
                    console.log('[close] Соединение прервано');
                }

                this.state = "Not Connected";

                setTimeout(() => {
                    this.initWebSocket();
                }, 2000);
            };
        },
        fitStageIntoParentContainer() {
            // const stage = this.$refs.stage;

            // var containerWidth = stage.offsetWidth;

            // var scale = containerWidth / width;

            // stage.width(width * scale);
            // stage.height(height * scale);
            // stage.scale({ x: scale, y: scale });
        }
    },
    mounted() {
        // this.fitStageIntoParentContainer();
        this.initWebSocket();

        // window.addEventListener('resize', this.fitStageIntoParentContainer.bind(this));
    },
    watch: {
        host() {
            this.initWebSocket();
        }
    }
}
</script>

<style>
    .content {
        overflow: hidden;
        width: 100%;
    }
</style>