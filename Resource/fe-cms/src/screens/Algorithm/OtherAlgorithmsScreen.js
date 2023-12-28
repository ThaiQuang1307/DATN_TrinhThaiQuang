/* eslint-disable max-len */
import { observer } from 'mobx-react';
import { useStore, useTitle } from '../../core/utils/hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const OtherAlgorithmsScreen = observer((props) => {

    // translation
    const { t } = useTranslation();

    // other
    useTitle(t('otherAlgorithmsScreen.titleDocument'));

    // store
    const { algorithmStore: { randomForest, svm, decisionTree, ld, nb, knn, xgb }  } = useStore();

    // state
    const defaultValue = {
        'number_correct': null,
        'rate_correct_results': null,
        'run_time': null
    }

    const [ resultRandomForest, setResultRandomForest ] = useState({
        ...defaultValue,
        'feature_importances': []
    });
    const [ resultSVM, setResultSVM ] = useState(defaultValue);
    const [ resultDecisionTree, setResultDecisionTree ] = useState(defaultValue);
    // const [ resultSOM, setResultSOM ] = useState(defaultValue);
    const [ resultLD, setResultLD ] = useState(defaultValue);
    const [ resultNB, setResultNB ] = useState(defaultValue);
    const [ resultKNN, setResultKNN ] = useState(defaultValue);
    const [ resultXGB, setResultXGB ] = useState(defaultValue);
    // const [ resultDL, setResultDL ] = useState(defaultValue);

    const { register, handleSubmit, reset } = useForm();

    // function
    const onResetForm = () => {
        reset();
        setResultRandomForest({
            ...defaultValue,
            'feature_importances': []
        });
        setResultSVM(defaultValue);
        setResultDecisionTree(defaultValue);
        // setResultSOM(defaultValue);
        setResultLD(defaultValue);
        setResultNB(defaultValue);
        setResultKNN(defaultValue);
        setResultXGB(defaultValue);
        // setResultDL(defaultValue);
    }
  
    const onSubmitRandomForest = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        formData.append('attributes', data?.attributes || '');
        const res =  await randomForest(formData);
        if(res) {
            setResultRandomForest({
                ...resultRandomForest,
                ...res
            });
        }
    }

    const onSubmitSVM = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        formData.append('kernel', data?.kernel || '');
        const res =  await svm(formData);
        if(res) {
            setResultSVM({
                ...resultSVM,
                ...res
            });
        }
    }

    const onSubmitDecisionTree = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        const res =  await decisionTree(formData);
        if(res) {
            setResultDecisionTree({
                ...resultDecisionTree,
                ...res
            });
        }
    }

    const onSubmitLD = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        const res =  await ld(formData);
        if(res) {
            setResultLD({
                ...resultLD,
                ...res
            });
        }
    }

    const onSubmitNB = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        const res =  await nb(formData);
        if(res) {
            setResultNB({
                ...resultNB,
                ...res
            });
        }
    }

    const onSubmitKNN = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        const res =  await knn(formData);
        if(res) {
            setResultKNN({
                ...resultKNN,
                ...res
            });
        }
    }

    const onSubmitXGB = async (data) => {
        const formData = new FormData();
        if(data.file_train?.length > 0) {
            formData.append('file_train', data.file_train[0]);
        }
        if(data.file_test?.length > 0) {
            formData.append('file_test', data.file_test[0]);
        }
        const res =  await xgb(formData);
        if(res) {
            setResultXGB({
                ...resultXGB,
                ...res
            });
        }
    }

    const onSubmitModelAI = (data) => {
        if(data.isRandomForest) {
            onSubmitRandomForest(data);
        }
        if(data.isSVM) {
            onSubmitSVM(data);
        }
        if(data.isDecisionTree) {
            onSubmitDecisionTree(data);
        }
        if(data.isLD) {
            onSubmitLD(data);
        }
        if(data.isNB) {
            onSubmitNB(data);
        }
        if(data.isKNN) {
            onSubmitKNN(data);
        }
        if(data.isXGB) {
            onSubmitXGB(data);
        }
    }

    return(
        <div className='other-algorithm-screen'>
            <div className='container-title'>{t('otherAlgorithmsScreen.titleScreen')}</div>
            <div className='container-content'>
                <form onSubmit={handleSubmit(onSubmitModelAI)} className={'w-100'}>
                    <i role={'button'} className='fa-solid fa-rotate-left float-end mg-b-10 fs-heading-normal txt-navy' onClick={onResetForm}></i>
                    <table className='table table-bordered align-middle'>
                        <thead className='text-center'>
                            <tr>
                                <th scope='col' className='col-1-5'>#</th>
                                <th scope='col' className='col-3-5'>{t('otherAlgorithmsScreen.labelTrain')}</th>
                                <th scope='col' className='col-3-5'>{t('otherAlgorithmsScreen.labelTest')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className='text-center'>
                                <td scope='row'>{t('otherAlgorithmsScreen.labelFile')}</td>
                                <td scope='row'>
                                    <input {...register('file_train')} type={'file'} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'/>
                                </td>
                                <td scope='row'>
                                    <input {...register('file_test')} type={'file'} accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'/>
                                </td>
                            </tr>

                            {/* Thuật toán Random Forest */}

                            <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isRandomForest')} type={'checkbox'} id='oal1'/>
                                        <label htmlFor='oal1' className='mg-l-10'>Random Forest</label>
                                    </div>
                                </td>
                            </tr>
                            <tr className='text-center'>
                                <td scope='row'>{t('otherAlgorithmsScreen.labelAttribute')}</td>
                                <td scope='row' colSpan={3} className='pd-lr-25'>
                                    <input {...register('attributes')} className='w-100'/>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultRandomForest.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultRandomForest.rate_correct_results} {resultRandomForest.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultRandomForest.run_time} {resultRandomForest.run_time != null && '(s)'}</p>
                                        <div>
                                            <div>{t('otherAlgorithmsScreen.labelImportantAttribute')}:</div>
                                            <div className='pd-l-15'>
                                                {
                                                    resultRandomForest.feature_importances?.length > 0 &&
                                                        resultRandomForest.feature_importances.map((e, idx) => (
                                                            <div key={idx}>
                                                                <span>{e.attribute}: </span>
                                                                <span>{e.importances}</span>
                                                            </div>
                                                        ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* Thuật toán SVM */}

                            <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isSVM')} type={'checkbox'} id='oal2'/>
                                        <label htmlFor='oal2' className='mg-l-10'>Support Vector Machine (SVM)</label>
                                    </div>
                                </td>
                            </tr>
                            <tr className='text-center'>
                                <td scope='row'>{t('otherAlgorithmsScreen.labelKernelFunction')}</td>
                                <td scope='row' colSpan={3} className='pd-lr-25'>
                                    <select {...register('kernel')} defaultValue={0} className='w-100'>
                                        <option value={''}>{t('common.default')}</option>
                                        <option value={'linear'}>Linear</option>
                                        <option value={'poly'}>Polynomial</option>
                                        <option value={'rbf'}>Radial Basic Function(RBF)</option>
                                        <option value={'sigmoid'}>Sigmoid</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultSVM.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultSVM.rate_correct_results} {resultSVM.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultSVM.run_time} {resultSVM.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr>

                            {/* Thuật toán Cây quyết định */}

                            <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isDecisionTree')} type={'checkbox'} id='oal3'/>
                                        <label htmlFor='oal3' className='mg-l-10'>Decision Tree</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultDecisionTree.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultDecisionTree.rate_correct_results} {resultDecisionTree.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultDecisionTree.run_time} {resultDecisionTree.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr>

                            {/* Thuật toán SOM */}

                            {/* <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isSOM')} type={'checkbox'} id='oal4'/>
                                        <label htmlFor='oal4' className='mg-l-10'>Self-organizing Maps (SOM)</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultSOM.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultSOM.rate_correct_results} {resultSOM.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultSOM.run_time} {resultSOM.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr> */}

                            {/* Thuật toán LD */}
                            
                            <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isLD')} type={'checkbox'} id='oal5'/>
                                        <label htmlFor='oal5' className='mg-l-10'>Linear Discriminant Analysis (LD)</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultLD.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultLD.rate_correct_results} {resultLD.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultLD.run_time} {resultLD.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr>

                            {/* Thuật toán NB */}
                            
                            <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isNB')} type={'checkbox'} id='oal6'/>
                                        <label htmlFor='oal6' className='mg-l-10'>Naïve Bayes (NB)</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultNB.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultNB.rate_correct_results} {resultNB.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultNB.run_time} {resultNB.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr>

                            {/* Thuật toán KNN */}
                            
                            <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isKNN')} type={'checkbox'} id='oal7'/>
                                        <label htmlFor='oal7' className='mg-l-10'>K-nearest Neighbours (KNN)</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultKNN.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultKNN.rate_correct_results} {resultKNN.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultKNN.run_time} {resultKNN.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr>

                            {/* Thuật toán XGB */}
                            
                            <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isXGB')} type={'checkbox'} id='oal9'/>
                                        <label htmlFor='oal9' className='mg-l-10'>XGBoost</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultXGB.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultXGB.rate_correct_results} {resultXGB.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultXGB.run_time} {resultXGB.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr>

                            {/* Thuật toán DL */}
                            
                            {/* <tr className='text-center'>
                                <td scope='row' colSpan={4} className={'fw-bolder'}>
                                    <div className='d-flex align-items-center justify-content-center'>
                                        <input {...register('isDL')} type={'checkbox'} id='oal8'/>
                                        <label htmlFor='oal8' className='mg-l-10'>Deep Learning (DL)</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td scope='row' className='text-center'>{t('otherAlgorithmsScreen.labelResult')}</td>
                                <td scope='row' className='pd-lr-25'>
                                </td>
                                <td scope='row' className='pd-lr-25'>
                                    <div>
                                        <p>{t('otherAlgorithmsScreen.labelCorrect')}: {resultDL.number_correct}</p>
                                        <p>{t('otherAlgorithmsScreen.labelAccuracy')}: {resultDL.rate_correct_results} {resultDL.rate_correct_results != null && '(%)'}</p>
                                        <p>{t('otherAlgorithmsScreen.labelTime')}: {resultDL.run_time} {resultDL.run_time != null && '(s)'}</p>
                                    </div>
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                    <div className='text-center'>
                        <button type='submit' className='btn btn-default-2 width-150'>{t('common.send')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
})

export default OtherAlgorithmsScreen;