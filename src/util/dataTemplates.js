export const colors = ['#F8D800', '#0396FF', '#EA5455', '#7367F0', '#32CCBC', '#F6416C', '#28C76F', '#9F44D3',
	'#F55555', '#736EFE', '#E96D71', '#DE4313', '#D939CD', '#4C83FF', '#F072B6', '#C346C2',
	'#5961F9', '#FD6585', '#465EFB', '#FFC600', '#FA742B', '#5151E5', '#BB4E75', '#FF52E5',
	'#49C628', '#00EAFF', '#F067B4', '#F067B4', '#ff9a9e', '#00f2fe', '#4facfe', '#f093fb',
	'#6fa3ef', '#bc99c4', '#46c47c', '#f9bb3c', '#e8583d', '#f68e5f'
];
export function getLineChartTemplate() {
	return {
		color: colors,
		tooltip: {
			trigger: 'none',
			axisPointer: {
				type: 'cross'
			}
		},
		legend: {
			data: ["线1的标题", "线2的标题"]
		},
		grid: {
			x: 50,
			y: 25,
			x2: 30,
			y2: 35,
			top: 70,
			bottom: 50
		},
		xAxis: [{
			axisTick: {
				alignWithLabel: true
			},
			axisLine: {
				onZero: false,
				lineStyle: {
					color: "#000"
				}
			},
			axisPointer: {
				label: {
					formatter: function(params) {
						return (
							params.value + ":" + params.seriesData[0].data + "℃" + " " +
							params.seriesData[1].data + "%"
						);
					}
				}
			},
			type: 'category',
			data: []
		}],
		yAxis: [{
				type: 'value',
				axisLabel: {
					show: true,
					formatter: function(value) {
						return value + "℃";
					}
				}
			},
			{
				type: 'value',
				axisLabel: {
					show: true,
					formatter: function(value) {
						return value + "%";
					}
				}
			}
		],
		series: [{
				name: '线1',
				type: 'line',
				yAxisIndex: 0,
				smooth: true,
				emphasis: {
					focus: 'series'
				},
				data: []
			},
			{
				name: '线2',
				type: 'line',
				yAxisIndex: 1,
				smooth: true,
				emphasis: {
					focus: 'series'
				},
				data: []
			}
		]
	};
}
export function getDashboardTemplate() {
	return {
		tooltip: {
			formatter: '{a} <br/>{b} : {c}%'
		},
		series: [{
			name: 'Pressure',
			type: 'gauge',
			radius: "80%",

			center: ["50%", "50%"],
			// 仪表盘线
			axisLine: {
				lineStyle: {
					color: [
						[0.3, "#00f2fe"],
						[0.7, "#0396FF"],
						[1, '#F55555']
					],
					opacity: 0.5,
					width: 5,

				}
			},
			splitLine: {},
			axisLabel: {},
			title: {
				textStyle: {
					fontSize: 18,
					color: "#000"
				},
				offsetCenter: [0, "100%"]
			},
			itemStyle: {

			},
			detail: {
				formatter: '{value}' + "%",
				offsetCenter: [0, "75%"],
				textStyle: {
					color: "#000",
					fontWeight: "700",
					fontSize: 36,
				}
			},
			data: [{
				value: 30,
				name: '室内湿度'
			}]
		}]
	};
}
