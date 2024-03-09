<script>
    import { onMount } from 'svelte';
	import ApexCharts from 'apexcharts';
    	let chart;


    onMount(() => {

        var options = {
            series: [{
              name: 'Net Profit',
              data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
            }, {
              name: 'Revenue',
              data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
            }, {
              name: 'Free Cash Flow',
              data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
            }],
            
            
              chart: {
                type: 'bar',
                 height: 500,
                 toolbar: {
                    show: true,
                    tools:{
                        download:false 
                    }
                },
                
            },
            
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '80%',
                borderRadius: 7,
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
              categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            },
            yaxis: {
              title: {
                text: 'Rp (Rupiah)'
              }
            },
            fill: {
              opacity: 1
            },
            colors: ['#FF5656', '#6A7EFC', '#93BBFB'],

            tooltip: {
              y: {
                formatter: function (val) {
                  return "Rp " + val 
                }
              }
            }
            };
    
            chart = new ApexCharts(document.querySelector('#chartBar'), options);
			chart.render();
    });

</script>

<div id="chartBar" />