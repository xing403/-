<template>
	<div id="box">
		<el-link href="/" type="primary">
			<el-button type="primary">页面数据</el-button>
		</el-link>
		<el-row>
			<el-col :sm="10" :md="7" :lg="6" class="status" v-for="(allDataItem, allDataIndex) in allData"
				:key="allDataIndex">
				<div class="title">
					<h3>{{allDataItem.title}} 状态</h3>
					<el-table :data="allDataItem.data">
						<el-table-column prop="title" label="控制名字" fixed="left">
						</el-table-column>
						<el-table-column label="状态" fixed="right">
							<template slot-scope="scope">

								<el-switch v-if="scope.row.key=='switch'" v-model="scope.row.status"
									@change="SwitchChange(scope.row)" :disabled="scope.row.disabled">
								</el-switch>
								<el-slider v-if="scope.row.key=='slider'" v-model="scope.row.status" :step="10"
									:change="SliderChange(scope.row)" show-stops>
								</el-slider>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import mqttConfig from "../util/MqttConfig.js";
	const topic = "ESP8266Kong";
	export default {
		name: "KongZhi",

		data() {
			return {
				allData: [{
					"id": "2",
					"title": "设备",
					"data": [{
						'id': "2001",
						"title": "水泵",
						"status": false,
						"key": "switch",
						"value": "S",
						"disabled": false
					}, {
						'id': "2002",
						"title": "风扇",
						"status": false,
						"key": "switch",
						"value": "F",
						"disabled": false
					}, {
						'id': "2004",
						"title": "窗帘",
						"key": "switch",
						"status": false,
						"value": "C",
						"disabled": false
					}]
				}, {
					'id': "1",
					"title": "传感器",
					"data": [{
						'id': "1001",
						"title": "室内温度传感器",
						"status": true,
						"key": "switch",
						"disabled": true
					}, {
						'id': "1002",
						"title": "室内湿度传感器",
						"status": true,
						"key": "switch",
						"disabled": true
					}, {
						'id': "1003",
						"title": "土壤温度传感器",
						"status": false,
						"key": "switch",
						"disabled": true
					}, {
						'id': "1004",
						"title": "土壤湿度传感器",
						"status": true,
						"key": "switch",
						"disabled": true
					}, {
						'id': "1005",
						"title": "空气CO2传感器",
						"status": true,
						"key": "switch",
						"disabled": true
					}, {

						'id': "1006",
						"title": "室内光照传感器",
						"status": true,
						"key": "switch",
						"disabled": true
					}]
				}, ]
			}
		},
		mounted() {
			this.connect(); // 连接 mqtt 服务
		},
		methods: {
			mqttsend(topic, data) {
				let message;
				if (data) {
					console.log(topic, data);
					message = new Paho.Message(data);
					message.destinationName = topic; //topic
					this.client.send(message);
				}
			},
			subscribe(tp) {
				var topic = tp;
				console.log(topic);
				var qos = 0;
				this.client.subscribe(topic, {
					qos: Number(qos),
				});
			},

			onConnect() {
				console.log("onConnected");
				this.subscribe(topic)
			},
			onFail() {
				// connected = false;
				console.log("onFail");
				this.connect();
			},
			makeid() {
				var text = "";
				var possible =
					"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

				for (var i = 0; i < 5; i++)
					text += possible.charAt(Math.floor(Math.random() * possible.length));
				return "_" + text;
			},

			connect() {
				// 链接地址，端口，连接id
				var hostname = mqttConfig.MqttHostName,
					port = mqttConfig.MqttPort;
					// 随机生成一个 id
					clientId = mqttConfig.clientIdPrefix + this.makeid(),
					timeout = 5,
					keepAlive = 100,
					cleanSession = false,
					path = "";

				// 创建一个 Paho 对象 客户端对象，
				if (path.length > 0) {
					this.client = new Paho.Client(hostname, Number(port), path, clientId);
				} else {
					this.client = new Paho.Client(hostname, Number(port), clientId);
				}

				var options = {
					invocationContext: {
						host: hostname,
						port: port,
						path: path,
						clientId: clientId,
					},
					timeout: timeout,
					keepAliveInterval: keepAlive,
					cleanSession: cleanSession,
					useSSL: false,
					// userName: user,
					// password: pass,
					reconnect: true,
					onSuccess: this.onConnect,
					onFailure: this.onFail,
				};
				// 连接断开
				this.client.onConnectionLost = this.onConnectionLost;
				// 收到消息
				this.client.onMessageArrived = this.onMessageArrived;
				// connect the client
				this.client.connect(options);
			},
			onConnectionLost(responseObject) {
				console.log(responseObject);
				if (responseObject.errorCode !== 0) {
					console.log("onConnectionLost:" + responseObject.errorMessage);
					console.log("连接已断开");
				}
			},

			onMessageArrived(message) {
				let that = this;
				// console.log(message.destinationName, message.payloadString);
				let msg = message.payloadString;
				// console.log(message.destinationName == that.topicid)
				if (message.destinationName == that.topicid) {
					let arr = msg.split(":");
					// console.log(arr)
					this.echartsSetData(arr[0], parseInt(arr[1]));
				}
			},

			get_topicid() {
				this.subscribe(this.topicid);
			},
			SwitchChange(row) {
				console.log(row);
				let data = this.allData;
				for (var i = 0; i < data.length; i++) {
					for (var j = 0; j < data[i].data.length; j++) {
						if (data[i].data[j].id == row.id) {
							this.mqttsend(topic, data[i].data[j].value + (row.status ? "T" : "F"));
						}
					}
				}
			},
			SliderChange(row) {
				console.log(row);
			},
		},
	};
</script>

<style>
	#box {
		margin: 0;
		padding: 0;
	}

	.status {
		padding: 10px;
		margin: 15px;
		border-radius: 10px;
		background-color: #fff;
	}
</style>
