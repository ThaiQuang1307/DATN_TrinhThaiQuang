import { observer } from 'mobx-react';
import { useStore, useTitle } from '../../core/utils/hook';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';

const DataScreen = observer((props) => {

    // translation
    const { t } = useTranslation();

    // other
    useTitle(t('dataScreen.titleDocument'));

    // store
    const { algorithmStore: { splitData, createFakeData }  } = useStore();

    // state
    const validateSplitFileSchema = yup.object().shape({
        file: yup.mixed(),
        percent_train: yup.number(),
        percent_validate: yup.number(),
        percent_test: yup.number()
    })
  
    const { register, handleSubmit, formState: { errors } 
    } = useForm({ resolver: yupResolver(validateSplitFileSchema), defaultValues: { testSumPercent: 0 }});

    const { register: register1, handleSubmit: handleSubmit1 } = useForm();

    // function
    const onSplitData = async (data) => {
        const formData = new FormData();
        if(data.file?.length > 0) {
            formData.append('file', data.file[0]);
            formData.append('percent_train', data.percent_train || 0);
            formData.append('percent_validate', data.percent_validate || 0);
            formData.append('percent_test', data.percent_test || 0);
            await splitData(formData);
        }
    }

    const onCreateFakeData = async (data) => {
        createFakeData({
            numbers: parseInt(data.numbers)
        });
    }

    return(
        <>
            <div className='split-data-screen'>
                <div className='container-title'>{t('dataScreen.titleScreen')}</div>
                <div className='container-content'>
                    <form onSubmit={handleSubmit(onSplitData)} className={'w-100'}>
                        <input {...register('file')} type={'file'} className='w-100' 
                            accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'/>
                        <div className='row justify-content-between mg-t-10'>
                            <div className='col-3-5'>
                                <label>{t('dataScreen.percentTrain')} (%):</label>
                                <input {...register('percent_train')} type={'number'} 
                                    defaultValue={0}
                                    min={0} max={100}
                                    className='w-100 mg-t-5'/>
                            </div>

                            <div className='col-3-5'>
                                <label>{t('dataScreen.percentValidate')} (%):</label>
                                <input {...register('percent_validate')} type={'number'} 
                                    defaultValue={0}
                                    min={0} max={100} 
                                    className='w-100 mg-t-5'/>
                            </div>

                            <div className='col-3-5'>
                                <label>{t('dataScreen.percentTest')} (%):</label>
                                <input {...register('percent_test')} type={'number'} 
                                    defaultValue={0}
                                    min={0} max={100} 
                                    className='w-100 mg-t-5'/>
                            </div>
                        </div>
                        <div className='mg-t-5 text-danger'>{errors?.testSumPercent?.message}</div>
                        <div className='text-center mg-t-10'>
                            <button type='submit' className='btn btn-default-2 width-150'>{t('common.send')}</button>
                        </div>
                    </form>
                </div>
            </div>
            {/* <div className='create-fake-data-screen mg-t-50'>
                <div className='container-title'>{t('dataScreen.createFakeData')}</div>
                <div className='container-content'>
                    <form onSubmit={handleSubmit1(onCreateFakeData)} className={'w-100 d-flex align-items-center flex-gap-20'}>
                        <label>{t('dataScreen.numberOfInstances')}</label>
                        <input {...register1('numbers')} type={'number'} min={1} required/>
                        <button type='submit' className='btn btn-default-2 width-150'>{t('dataScreen.createFakeData')}</button>
                    </form>
                </div>
            </div> */}
        </>

    )
})

export default DataScreen;