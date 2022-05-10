import {
	colors,
	getLineChartTemplate,
	getDashboardTemplate
} from "./dataTemplates.js";

let HouseTemperatureData = [],
	HouseHumidityData = [],
	SoilTemperatureData = [],
	SoilHumidityData = [],
	CO2Data = [],
	IlluminationData = [],
	xAxisData = [];
export function addxAxis() {
	let time = new Date();
	xAxisData.push(time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds());
	while (xAxisData.length > 10) {
		xAxisData.shift();
	}
}

export function houseTemperatureHumidity(obj, y1, y2) {
	// 室内温湿度传感器
	let option = getLineChartTemplate();
	let legendData = ["室内温度", "室内湿度"];
	HouseTemperatureData.push(y1)
	HouseHumidityData.push(y2);
	if (HouseHumidityData.length > 10) {
		HouseHumidityData.shift();
	}
	if (HouseTemperatureData.length > 10) {
		HouseTemperatureData.shift();
	}
	option.color = [colors[0], colors[1]];
	option.xAxis[0].data = xAxisData;
	option.xAxis[0].axisPointer.label.formatter = function(params) {
		return (
			params.value + ":" + params.seriesData[0].data + "℃" + " " +
			params.seriesData[1].data + "%"
		);
	};
	option.series[0].name = legendData[0];
	option.series[1].name = legendData[1];

	option.series[0].data = HouseTemperatureData;
	option.series[1].data = HouseHumidityData;
	option.legend.data = legendData;
	obj.setOption(option);
}
export function houseTemperature(obj, y) {
	// 室内温度传感器
	let option = getDashboardTemplate();

	option.series[0].min = -50;
	option.series[0].max = 50;
	option.series[0].detail.formatter = '{value}' + "℃";
	option.series[0].data[0] = {
		value: y,
		name: "室内温度"
	};
	obj.setOption(option);
}

export function houseHumidity(obj, y) {
	// 室内湿度传感器
	let option = getDashboardTemplate();
	option.series[0].detail.formatter = '{value}' + "%";

	option.series[0].min = 0;
	option.series[0].max = 100;
	option.series[0].data[0] = {
		value: y,
		name: "室内湿度"
	};
	obj.setOption(option);
}

export function soilTemperatureHumidity(obj, y1, y2) {
	// 土壤温湿度传感器
	let option = getLineChartTemplate();
	let legendData = ["土壤温度", "土壤湿度"];
	SoilTemperatureData.push(y1);
	SoilHumidityData.push(y2);

	while (SoilTemperatureData.length > 10) {
		SoilTemperatureData.shift();
	}

	while (SoilHumidityData.length > 10) {
		SoilHumidityData.shift();
	}
	option.color = [colors[2], colors[3]];
	option.xAxis[0].data = xAxisData;
	option.xAxis[0].axisPointer.label.formatter = function(params) {
		return (
			params.value + ":" + params.seriesData[0].data + "℃" + " " +
			params.seriesData[1].data + "%"
		);
	};
	option.series[0].name = legendData[0];
	option.series[1].name = legendData[1];
	option.series[0].data = SoilTemperatureData;
	option.series[1].data = SoilHumidityData;
	option.legend.data = legendData;
	obj.setOption(option);
}

export function soilTemperature(obj, y) {
	// 土壤温度
	let option = getDashboardTemplate();
	option.color = colors[0]
	option.series[0].min = -50;
	option.series[0].max = 50;
	option.series[0].detail.formatter = '{value}' + "℃";
	option.series[0].data[0] = {
		value: y,
		name: "土壤温度"
	};
	obj.setOption(option);
}

export function soilHumidity(obj, y) {
	// 土壤湿度
	let option = getDashboardTemplate();

	option.series[0].min = 0;
	option.series[0].max = 100;
	option.series[0].detail.formatter = '{value}' + "%";
	option.series[0].data[0] = {
		value: y,
		name: "土壤湿度"
	};
	obj.setOption(option);
}


export function CO2Illumination(obj, y1, y2) {
	// 光照二氧化碳传感器
	let option = getLineChartTemplate();
	let legendData = ["CO2浓度", "光照强度"];
	CO2Data.push(y1);
	IlluminationData.push(y2);
	while (CO2Data.length > 10) {
		CO2Data.shift();
	}
	while (IlluminationData.length > 10) {
		IlluminationData.shift();
	}
	option.color = [colors[4], colors[5]];
	option.xAxis[0].data = xAxisData;
	option.xAxis[0].axisPointer.label.formatter = function(params) {
		return (
			params.value + ":" + params.seriesData[0].data + "PPM" + " " +
			params.seriesData[1].data + "LUX"
		);
	};
	option.series[0].name = legendData[0];
	option.series[1].name = legendData[1];
	option.series[0].data = CO2Data;
	option.series[1].data = IlluminationData;
	option.legend.data = legendData;
	option.yAxis[0].axisLabel.formatter = function(value) {
		return value + "PPM";
	};
	option.yAxis[1].axisLabel.formatter = function(value) {
		return value + "LUX";
	};
	obj.setOption(option);
}

export function CO2(obj, y) {
	// CO2
	let option = getDashboardTemplate();

	option.series[0].min = 0;
	option.series[0].max = 100;
	option.series[0].detail.formatter = '{value}' + "%";
	option.series[0].data[0] = {
		value: Math.floor(y * 100 / 1023),
		name: "CO2浓度"
	};
	obj.setOption(option);

}

export function Illumination(obj, y) {
	// 光照
	let option = getDashboardTemplate();

	option.series[0].min = 0;
	option.series[0].max = 100;
	option.series[0].detail.formatter = '{value}' + "%";
	option.series[0].data[0] = {
		value: Math.floor(y * 100 / 65535),
		name: "光照强度"
	};
	obj.setOption(option);
}

export default {
	addxAxis,
	houseTemperatureHumidity,
	houseTemperature,
	houseHumidity,
	soilTemperatureHumidity,
	soilTemperature,
	soilHumidity,
	CO2Illumination,
	CO2,
	Illumination
}
