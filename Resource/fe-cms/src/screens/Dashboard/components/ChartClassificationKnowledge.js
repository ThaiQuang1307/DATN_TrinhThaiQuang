import { observer } from 'mobx-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useStore } from '../../../core/utils/hook';
import { useMemo } from 'react';
import { countCharacterOfNumber } from '../../../core/utils/common';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

ChartJS.defaults.datasets.bar.barThickness = 60;
ChartJS.defaults.color = '#212529';

const ChartClassificationKnowledge = observer(props => {

    // store
    const {
        algorithmStore: { countClassificationKnowledge }
    } = useStore();

    // state
    const min = useMemo(() => {
        return Math.min(
            countClassificationKnowledge.veryLow ?? 0,
            countClassificationKnowledge.low ?? 0,
            countClassificationKnowledge.middle ?? 0,
            countClassificationKnowledge.high ?? 0)
    }, [countClassificationKnowledge])

    const max = useMemo(() => {
        return Math.max(
            countClassificationKnowledge.veryLow ?? 0,
            countClassificationKnowledge.low ?? 0,
            countClassificationKnowledge.middle ?? 0,
            countClassificationKnowledge.high ?? 0)
    }, [countClassificationKnowledge])

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top'
            },
            title: {
                display: true,
                text: 'Statistical classification of student knowledge',
                font: {
                    size: 16
                }
            },
            datalabels: {
                color: (context) => {
                    if (context?.dataset?.data?.[context.dataIndex] > 0) return '#fff';
                    return '#212529'
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    // forces step size to be 50 units
                    stepSize: Math.pow(10, countCharacterOfNumber(max) - 1)
                }
            }
        }
    };

    const labels = ['Very Low', 'Low', 'Middle', 'High'];

    const data = useMemo(() => {
        return {
            labels,
            datasets: [
                {
                    label: 'Total',
                    data: [
                        countClassificationKnowledge.veryLow ?? 0,
                        countClassificationKnowledge.low ?? 0,
                        countClassificationKnowledge.middle ?? 0,
                        countClassificationKnowledge.high ?? 0
                    ],
                    backgroundColor: 'rgb(101, 119, 152)'
                }
            ]
        }
    }, [countClassificationKnowledge])

    return (
        <div className='chart-classification-knowledge'>
            <div className='container-content'>
                <Bar options={options} data={data} />
            </div>
        </div>
    )
})

export default ChartClassificationKnowledge;