/* eslint-disable no-useless-escape */
/* eslint-disable quotes */
/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { useStore, useTitle } from '../../core/utils/hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Chart } from '../../components';

const MainAlgorithmScreen = observer((props) => {

    // translation
    const { t } = useTranslation();

    // other
    useTitle(t('mainAlgorithmScreen.titleDocument'));

    // store
    const { algorithmStore: { subclassAI, dataClassification } } = useStore();

    // state
    const [ resultSubclassAI, setResultSubclassAI ] = useState({
        'result_train': {
            'number_correct': null,
            'rate_correct_results': null,
            'run_time': null,
            'index_rating': null
        },
        'result_validate': {
            'number_correct': null,
            'rate_correct_results': null,
            'run_time': null,
            'index_rating': null
        },
        'result_test': {
            'number_correct': null,
            'rate_correct_results': null,
            'run_time': null,
            'index_rating': null
        }
    })

    const [ resultSubclassAIWithJump, setResultSubclassAIWithJump ] = useState({
        h: null,
        results: []
    })

    const [ chartInfo, setChartInfo ] = useState({
        labels: [],
        datasets: []
    })

    const { register, handleSubmit, reset, watch, setValue } = useForm({
        defaultValues: {
            is_jump: 'false'
        }
    });
    const watchMeasure = watch('type_measure');
    const watchIsJump = watch('is_jump');

    const { register: register1, handleSubmit: handleSubmit1 } = useForm();

    // lifecycle
    useEffect(() => {
        setResultSubclassAI({
            'result_train': {
                'number_correct': null,
                'rate_correct_results': null,
                'run_time': null,
                'index_rating': null
            },
            'result_validate': {
                'number_correct': null,
                'rate_correct_results': null,
                'run_time': null,
                'index_rating': null
            },
            'result_test': {
                'number_correct': null,
                'rate_correct_results': null,
                'run_time': null,
                'index_rating': null
            }
        })
        setResultSubclassAIWithJump({
            h: null,
            results: []
        });
    }, [watchIsJump])

    useEffect(() => {
        setValue('is_jump', 'false');
    }, [watchMeasure])


    useEffect(() => {
        if(resultSubclassAIWithJump?.h && resultSubclassAIWithJump?.results?.length > 0) {
            const labels = resultSubclassAIWithJump.results.map(e => e.p);
            let datasets = [];
            if(resultSubclassAIWithJump.results[0]?.result?.result_train) {
                datasets = [
                    ...datasets,
                    {
                        label: 'Train',
                        data: resultSubclassAIWithJump.results.map(e => e.result.result_train.rate_correct_results.toFixed(2)),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)'
                    }
                ]
            }
            if(resultSubclassAIWithJump.results[0]?.result?.result_validate) {
                datasets = [
                    ...datasets,
                    {
                        label: 'Validate',
                        data: resultSubclassAIWithJump.results.map(e => e.result.result_validate.rate_correct_results.toFixed(2)),
                        borderColor: 'rgb(53, 162, 235)',
                        backgroundColor: 'rgba(53, 162, 235, 0.5)'
                    }
                ]
            }
            if(resultSubclassAIWithJump.results[0]?.result?.result_test) {
                datasets = [
                    ...datasets,
                    {
                        label: 'Test',
                        data: resultSubclassAIWithJump.results.map(e => e.result.result_test.rate_correct_results.toFixed(2)),
                        borderColor: 'rgba(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)'
                    }
                ]
            }
            setChartInfo({
                labels,
                datasets
            })
        }
    }, [resultSubclassAIWithJump])

    // function
    const onResetForm = () => {
        reset();
        setResultSubclassAI({
            'result_train': {
                'number_correct': null,
                'rate_correct_results': null,
                'run_time': null,
                'index_rating': null
            },
            'result_validate': {
                'number_correct': null,
                'rate_correct_results': null,
                'run_time': null,
                'index_rating': null
            },
            'result_test': {
                'number_correct': null,
                'rate_correct_results': null,
                'run_time': null,
                'index_rating': null
            }
        })
        setResultSubclassAIWithJump({
            h: null,
            results: []
        });
    }

    const onSubclassAI = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_validate?.length > 0) {
            formData.append('file_validate', data.file_validate[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        formData.append('type_measure', data?.type_measure || '0');
        formData.append('type_cal_s', data?.type_cal_s || '0');
        formData.append('number_loops', data?.number_loops || '0');
        formData.append('is_index_rating', data?.isIndexRating ?? false);
        if(watchMeasure == 5) {
            formData.append('is_jump', data?.is_jump ?? false);
            formData.append('h', data?.h ?? 1);
            formData.append('n', data?.n ?? 1);
            formData.append('p', data?.p ?? 1);

        }
        const res =  await subclassAI(formData);
        if(res) {
            if(watchMeasure == 5 && watchIsJump == 'true') {
                setResultSubclassAIWithJump({
                    ...resultSubclassAIWithJump,
                    ...res
                })
            } else {
                setResultSubclassAI({
                    ...resultSubclassAI,
                    ...res
                });
            }
        }
    }

    const onSubmitModelAI = (data) => {
        onSubclassAI(data);
    }

    const onDataClassClassification = (data) => {
        const formData = new FormData();
        if(data.file_data?.length > 0) {
            formData.append('file_data', data.file_data[0]);
        }
        dataClassification(formData);
    }

    return(
        <div className='main-algorithm-screen'>
            <div className='container-title'>{t('mainAlgorithmScreen.titleScreen')}</div>
            <div className='container-content'>
                <form onSubmit={handleSubmit(onSubmitModelAI)} className={'w-100'}>
                    <i role={'button'} className='fa-solid fa-rotate-left float-end mg-b-10 fs-heading-normal txt-navy' onClick={onResetForm}></i>
                    <table className='table table-bordered align-middle'>
                        <thead className='text-center'>
                            <tr>
                                <th scope='col' className='col-1-5'>#</th>
                                <th scope='col' className='col-3-5'>{t('mainAlgorithmScreen.labelTrain')}</th>
                                {/* <th scope='col' className='col-3-5'>{t('mainAlgorithmScreen.labelValidate')}</th> */}
                                <th scope='col' className='col-3-5'>{t('mainAlgorithmScreen.labelTest')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='text-center'>
                                <td scope='row'>{t('mainAlgorithmScreen.labelFile')}</td>
                                <td scope='row'>
                                    <input {...register('file_train')} type={'file'} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'/>
                                </td>
                                {/* <td scope='row'>
                                    <input {...register('file_validate')} type={'file'} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'/>
                                </td> */}
                                <td scope='row'>
                                    <input {...register('file_test')} type={'file'} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'/>
                                </td>
                            </tr>

                            {/* Thuật toán CS-IFS */}
                            <tr className='text-center'>
                                <td scope='row'>{t('mainAlgorithmScreen.labelFunction')}</td>
                                <td scope='row' colSpan={3} className='pd-lr-25'>
                                    <select {...register('type_cal_s')} defaultValue={1} className='w-100'>
                                        <option value={1}>{t('mainAlgorithmScreen.labelFunction')} 1</option>
                                        <option value={2}>{t('mainAlgorithmScreen.labelFunction')} 2</option>
                                        <option value={3}>{t('mainAlgorithmScreen.labelFunction')} 3</option>
                                        <option value={0}>{t('mainAlgorithmScreen.labelMix')}</option>
                                    </select>
                                </td>
                            </tr>
                            <tr className='text-center'>
                                <td scope='row'>{t('mainAlgorithmScreen.labelMeasure')}</td>
                                <td scope='row' colSpan={3} className='pd-lr-25'>
                                    <select {...register('type_measure')} defaultValue={0} className='w-100'>
                                        <option value={0}>Minkowski (p=9) </option>
                                        <option value={1}>Hamming 2</option>
                                        <option value={2}>Hamming 3</option>
                                        <option value={3}>Ngân</option>
                                        <option value={4}>Manhattan</option>
                                        <option value={5}>General Minkowski</option>
                                    </select>
                                </td>
                            </tr>
                            {
                                watchMeasure == 5 &&
                                <tr className='text-center'>
                                    <td scope='row'>{t('mainAlgorithmScreen.labelParameters')}</td>
                                    <td scope='row' colSpan={3} className='pd-lr-25'>
                                        <div className='d-flex align-items-center flex-gap-20'>
                                            <input {...register('is_jump')} type='radio' value={'false'}/>
                                            <div>
                                                <span>p = </span>
                                                <input {...register('p')} type='number' min={1} defaultValue={1} disabled={watchIsJump === 'true'}/>
                                            </div>
                                            <input {...register('is_jump')} type='radio' value={'true'}/>
                                            <div>
                                                <span>h = </span>
                                                <input {...register('h')} type='number' min={1} defaultValue={1} disabled={watchIsJump === 'false'}/>
                                            </div>
                                            <div>
                                                <span>n = </span>
                                                <input {...register('n')} type='number' min={1} defaultValue={1} disabled={watchIsJump === 'false'}/>
                                                <span> p = 1 + i * h (i = 0, 1, ..., n)</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            }
                            <tr className='text-center'>
                                <td scope='row'>{t('mainAlgorithmScreen.labelNumberOfLoops')}</td>
                                <td scope='row' colSpan={3} className='pd-lr-25'>
                                    <input {...register('number_loops')} type='number' className='w-100' min={0} defaultValue={0}/>
                                </td>
                            </tr>

                            {
                                watchIsJump == 'false' ? 
                                    <>
                                        <tr>
                                            <td scope='row' className='text-center'>{t('mainAlgorithmScreen.labelResult')}</td>
                                            <td scope='row' className='pd-lr-25'>
                                                <div>
                                                    <p>{t('mainAlgorithmScreen.labelCorrect')}: {resultSubclassAI.result_train.number_correct}</p>
                                                    <p>{t('mainAlgorithmScreen.labelAccuracy')}: {resultSubclassAI.result_train.rate_correct_results} {resultSubclassAI.result_train.rate_correct_results != null && '(%)'}</p>
                                                    {/* <p>{String(resultSubclassAI.result_train.rate_correct_results)?.replace('.', ',')}</p> */}
                                                    <p>{t('mainAlgorithmScreen.labelTime')}: {resultSubclassAI.result_train.run_time} {resultSubclassAI.result_train.run_time != null && '(s)'}</p>
                                                    {/* <p>{String(resultSubclassAI.result_train.run_time)?.replace('.', ',')}</p> */}
                                                </div>
                                            </td>
                                            {/* <td scope='row' className='pd-lr-25'>
                                                <div>
                                                    <p>{t('mainAlgorithmScreen.labelCorrect')}: {resultSubclassAI.result_validate.number_correct}</p>
                                                    <p>{t('mainAlgorithmScreen.labelAccuracy')}: {resultSubclassAI.result_validate.rate_correct_results} {resultSubclassAI.result_validate.rate_correct_results != null && '(%)'}</p>
                                                    <p>{t('mainAlgorithmScreen.labelTime')}: {resultSubclassAI.result_validate.run_time} {resultSubclassAI.result_validate.run_time != null && '(s)'}</p>
                                                </div>
                                            </td> */}
                                            <td scope='row' className='pd-lr-25'>
                                                <div>
                                                    <p>{t('mainAlgorithmScreen.labelCorrect')}: {resultSubclassAI.result_test.number_correct}</p>
                                                    <p>{t('mainAlgorithmScreen.labelAccuracy')}: {resultSubclassAI.result_test.rate_correct_results} {resultSubclassAI.result_test.rate_correct_results != null && '(%)'}</p>
                                                    {/* <p>{String(resultSubclassAI.result_test.rate_correct_results)?.replace('.', ',')}</p> */}
                                                    <p>{t('mainAlgorithmScreen.labelTime')}: {resultSubclassAI.result_test.run_time} {resultSubclassAI.result_test.run_time != null && '(s)'}</p>
                                                    {/* <p>{String(resultSubclassAI.result_test.run_time)?.replace('.', ',')}</p> */}
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Các chỉ số đánh giá chất lượng */}
                                        <tr className='text-center'>
                                            <td scope='row' colSpan={4} className={'fw-bolder'}>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <input {...register('isIndexRating')} type={'checkbox'}/>
                                                    <span className='mg-l-10'>{t('mainAlgorithmScreen.labelIndexRating')}</span>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td scope='row' className='text-center'>{t('mainAlgorithmScreen.labelResult')}</td>
                                            <td scope='row' className='pd-lr-25'>
                                                <div>
                                                    {
                                                        resultSubclassAI.result_train.index_rating?.length > 0 &&
                                                    resultSubclassAI.result_train.index_rating.map(e => <IndexRating key={e.class} value={e}/>)
                                                    }
                                                </div>
                                                {/* {
                                                    resultSubclassAI.result_train.index_rating?.length > 0 &&
                                                        <>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_train.index_rating.filter(e => e.class == 'Very Low')[0]} 
                                                                isPrintValue={true}/>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_train.index_rating.filter(e => e.class == 'Low')[0]} 
                                                                isPrintValue={true}/>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_train.index_rating.filter(e => e.class == 'Middle')[0]} 
                                                                isPrintValue={true}/>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_train.index_rating.filter(e => e.class == 'High')[0]} 
                                                                isPrintValue={true}/>
                                                        </>
                                                }
                                                {
                                                    resultSubclassAI.result_test.index_rating?.length > 0 &&
                                                        <>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_test.index_rating.filter(e => e.class == 'Very Low')[0]} 
                                                                isPrintValue={true}/>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_test.index_rating.filter(e => e.class == 'Low')[0]} 
                                                                isPrintValue={true}/>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_test.index_rating.filter(e => e.class == 'Middle')[0]} 
                                                                isPrintValue={true}/>
                                                            <IndexRating 
                                                                value={resultSubclassAI.result_test.index_rating.filter(e => e.class == 'High')[0]} 
                                                                isPrintValue={true}/>
                                                        </>
                                                } */}
                                            </td>
                                            {/* <td scope='row' className='pd-lr-25'>
                                                <div>
                                                    {
                                                        resultSubclassAI.result_validate.index_rating?.length > 0 &&
                                                    resultSubclassAI.result_validate.index_rating.map(e => <IndexRating key={e.class} value={e}/>)
                                                    }
                                                </div>
                                            </td> */}
                                            <td scope='row' className='pd-lr-25'>
                                                <div>
                                                    {
                                                        resultSubclassAI.result_test.index_rating?.length > 0 &&
                                                    resultSubclassAI.result_test.index_rating.map(e => <IndexRating key={e.class} value={e}/>)
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    </>
                                    :
                                    <tr>
                                        <td scope='row' className='text-center'>{t('mainAlgorithmScreen.labelResult')}</td>
                                        <td scope='row' colSpan={3} className='pd-lr-25'>
                                            {
                                                resultSubclassAIWithJump?.h && resultSubclassAIWithJump?.results?.length > 0 &&
                                                <Chart
                                                    titleChart={t('mainAlgorithmScreen.labelChart')} 
                                                    labels={chartInfo?.labels}
                                                    datasets={chartInfo?.datasets}
                                                />
                                            }
                                        </td>
                                    </tr>
                            }
                            
                        </tbody>
                    </table>
                    <div className='text-center'>
                        <button type='submit' className='btn btn-default-2 width-150'>{t('common.send')}</button>
                    </div>
                </form>
            </div>

            {/* <div className='create-fake-data-screen mg-t-50'>
                <div className='container-title'>{t('mainAlgorithmScreen.dataClassification')}</div>
                <div className='container-content'>
                    <form onSubmit={handleSubmit1(onDataClassClassification)} className={'w-100 d-flex align-items-center flex-gap-20'}>
                        <label>{t('mainAlgorithmScreen.labelFile')}</label>
                        <input {...register1('file_data')} type={'file'} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel' required/>
                        <button type='submit' className='btn btn-default-2 width-150'>{t('common.send')}</button>
                    </form>
                </div>
            </div> */}

            <div className='parameter-description mg-t-50'>
                <div className='container-title'>{t('mainAlgorithmScreen.parameterDescription')}</div>
                <div className='container-content'>
                    <div>
                        <strong>{t('mainAlgorithmScreen.labelFunction')}</strong>
                        <div className='mg-t-10 pd-l-30'>
                            <div className='d-flex flex-column flex-gap-10'>
                                <img src='/images/func1.png' width={500}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <strong>{t('mainAlgorithmScreen.labelMeasure')}</strong>
                        <div className='mg-t-10'>
                            <div className='d-flex flex-column flex-gap-10'>
                                <img src='/images/func2.png' width={700}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

const IndexRating = ({ value, isPrintValue = false }) => {

    const { class: class_name, indexRating: { acc, f1, fmi, fpr, mcc, pre, sen, spe, tpr } } = value;

    if(!isPrintValue) {
        return (
            <div>
                <div className='fw-bolder'>{class_name}</div>
                <div className='pd-l-15 d-flex flex-wrap flex-gap-10'>
                    <div>ACC: {acc} (%)</div>
                    <div>SEN: {sen} (%)</div>
                    <div>SPE: {spe} (%)</div>
                    <div>PRE: {pre} (%)</div>
                    <div>F1: {f1} (%)</div>
                    <div>MCC: {mcc} (%)</div>
                    <div>FMI: {fmi} (%)</div>
                    <div>FPR: {fpr} (%)</div>
                    <div>TPR: {tpr} (%)</div>
                </div>
            </div>
        )
    }

    return (
        <div>
            { `"${acc}","${sen}","${spe}","${pre}","${f1}","${mcc}","${fmi}","${fpr}","${tpr}"`.replace(/\./g, ',') }
        </div>
    )
}

export default MainAlgorithmScreen;