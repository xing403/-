<template>
	<div id="box">
		<el-link href="/#/kongzhi">
			<el-button type="primary" plain>设备控制</el-button>
		</el-link>
		<el-row>
			<el-col :md="12" :xl="8">
				<el-row justify="center">
					<el-col>
						<div id="TemperatureHumidity" class="sensor-data lineChart temperature humidity house"
							:style="'width: '+lineChartWidth+'px ;height: '+lineChartHeight+'px;'"></div>
					</el-col>
					<el-col :span="12">
						<div id="Temperature" class="sensor-data dashboard temperature humidity house"
							:style="'width: '+dashboardWidth+'px;height: '+dashboardWidth+'px;'"></div>
					</el-col>
					<el-col :span="12">
						<div id="Humidity" class="sensor-data dashboard temperature humidity house"
							:style="'width: '+dashboardWidth+'px;height: '+dashboardWidth+'px;'">
						</div>
					</el-col>
				</el-row>

			</el-col>
			<el-col :md="12" :xl="8">
				<el-row justify="center">
					<el-col>
						<div id="SoilTemperatureHumidity" class="sensor-data lineChart temperature humidity soil"
							:style="'width: '+lineChartWidth+'px ;height: '+lineChartHeight+'px;'"></div>
					</el-col>
					<el-col :span="12">
						<div id="SoilTemperature" class="sensor-data dashboard temperature humidity house"
							:style="'width: '+dashboardWidth+'px;height: '+dashboardWidth+'px;'"></div>
					</el-col>
					<el-col :span="12">
						<div id="SoilHumidity" class="sensor-data dashboard temperature humidity house"
							:style="'width: '+dashboardWidth+'px;height: '+dashboardWidth+'px;'">
						</div>
					</el-col>
				</el-row>

			</el-col>

			<el-col :md="12" :xl="8">
				<el-row justify="center">
					<el-col>
						<div id="CO2AndIllumination" class="sensor-data lineChart CO2 Illumination"
							:style="'width: '+lineChartWidth+'px ;height: '+lineChartHeight+'px;'">
						</div>
					</el-col>
					<el-col :span="12">
						<div id="CO2" class="sensor-data dashboard CO2"
							:style="'width: '+dashboardWidth+'px;height: '+dashboardWidth+'px;'"></div>
					</el-col>
					<el-col :span="12">
						<div id="Illumination" class="sensor-data dashboard Illumination"
							:style="'width: '+dashboardWidth+'px;height: '+dashboardWidth+'px;'">
						</div>
					</el-col>
				</el-row>

			</el-col>
		</el-row>

	</div>
</template>

<script>
	import sensor from "./../util/sensor.js"
	import mqttConfig from "../util/MqttConfig.js";
	import echarts from "echarts";

	export default {
		name: "robotMsg",

		data() {
			return {
				flagusername: true,
				username: "",
				topicid: "greenhouse",
				userMsg: "",
				HouseTemperatureData: 0,
				HouseHumidityData: 0,
				SoilTemperatureData: 0,
				SoilHumidityData: 0,
				CO2Data: 0,
				IlluminationData: 0,
				xAxisData: 0,
				client: null,
				windowsSize: null,
				lineChartWidth: 768,
				lineChartHeight: 350,
				dashboardWidth: 320,
				dashboardHeight: 320,
			};
		},
		mounted() {
			let that = this;
			window.onresize = this.changeWindowsSize;

			this.connect(); // 连接 mqtt 服务
			this.echartsInit();
			that.drowEcharts();
			that.changeWindowsSize()
		},
		methods: {
			changeWindowsSize() {
				let that = this;
				const windowInfo = {
					width: document.body.clientWidth,
					height: document.body.clientHeight
				}
				// console.log(windowInfo);
				if (that.windowsSize == null) {
					that.windowsSize = windowInfo;
				} else if (that.windowsSize.width == windowInfo.width && that.windowsSize.height == windowInfo.height) {
					return;
				}
				if (windowInfo.width < 768) {
					// 已经是手机了
					this.lineChartWidth = windowInfo.width;
					this.dashboardWidth = windowInfo.width / 2;
				} else if (windowInfo.width < 992) {
					this.lineChartWidth = windowInfo.width;
					this.dashboardWidth = windowInfo.width / 2;
				} else if (windowInfo.width < 1200) {
					this.lineChartWidth = windowInfo.width / 2;
					this.dashboardWidth = 992 / 4;
				} else if (windowInfo.width < 1920) {
					this.lineChartWidth = windowInfo.width / 2.1;
					this.dashboardWidth = 992 / 4;
				} else {
					this.lineChartWidth = 1900 / 3;
					this.dashboardWidth = 992 / 4;
				}
				that.windowsSize = windowInfo;
				setTimeout(function() {
					that.ReSizeEcharts();
				}, 300);
			},
			ReSizeEcharts() {
				this.HTH.resize()
				this.HT.resize()
				this.HH.resize()
				this.STH.resize()
				this.ST.resize()
				this.SH.resize()
				this.Ill.resize()
				this.CO2AI.resize()
				this.CO2.resize()
			},
			mqttsend(topic, data) {
				let message;
				if (data) {
					console.log(topic, data);
					message = new Paho.Message(data);
					message.destinationName = topic; //topic
					this.client.send(message);
				}
			},
			echartsInit() {
				this.HTH = echarts.init(document.getElementById('TemperatureHumidity')),
					this.HT = echarts.init(document.getElementById('Temperature')),
					this.HH = echarts.init(document.getElementById('Humidity')),
					this.STH = echarts.init(document.getElementById('SoilTemperatureHumidity')),
					this.ST = echarts.init(document.getElementById('SoilTemperature')),
					this.SH = echarts.init(document.getElementById('SoilHumidity')),
					this.CO2AI = echarts.init(document.getElementById('CO2AndIllumination')),
					this.CO2 = echarts.init(document.getElementById('CO2')),
					this.Ill = echarts.init(document.getElementById('Illumination'));
			},
			echartsSetData(type, data) {
				// console.log(type, data)

				let that = this;
				switch (type) {
					case "begin":
						break;
					case "temperature": //室内温度
						that.HouseTemperatureData = data;
						break;
					case "humidity": // 室内湿度
						that.HouseHumidityData = data;
						break;
					case "soilHumidity": // 土壤湿度
						that.SoilHumidityData = data;
						break;

					case "soilTemperature": // 土壤温度
						that.SoilTemperatureData = data;
						break;

					case "CO2": // 二氧化碳
						that.CO2Data = data;
						break;


					case "light": // 光照
						that.IlluminationData = data;
						break;
					case "end":
						that.drowEcharts();
						break;
				}
			},
			drowEcharts() {
				sensor.addxAxis();
				sensor.houseTemperatureHumidity(this.HTH, this.HouseTemperatureData, this.HouseHumidityData);
				sensor.houseTemperature(this.HT, this.HouseTemperatureData);
				sensor.houseHumidity(this.HH, this.HouseHumidityData);
				sensor.soilTemperatureHumidity(this.STH, Math.floor(this.HouseTemperatureData + Math.random() * 4 - 4), this.SoilHumidityData)
				sensor.soilTemperature(this.ST, Math.floor(this.HouseTemperatureData + Math.random() * 4 - 2))
				sensor.soilHumidity(this.SH, this.SoilHumidityData)
				sensor.CO2Illumination(this.CO2AI, this.CO2Data, this.IlluminationData)
				sensor.CO2(this.CO2, this.CO2Data)
				sensor.Illumination(this.Ill, this.IlluminationData)

			},
			subscribe(tp) {
				var topic = tp;
				// console.log(topic);
				var qos = 0;
				this.client.subscribe(topic, {
					qos: Number(qos),
				});
			},

			onConnect() {
				console.log("onConnected");
				this.subscribe("greenhouse")
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

			send() {

			},
			get_topicid() {
				this.subscribe(this.topicid);
			},
		},
	};
</script>

<style>
	body {
		margin: 0;
		padding: 0;
		background-color: #fffae8;
	}

	.sensor-data.dashboard {
		margin: auto;
	}
</style>
