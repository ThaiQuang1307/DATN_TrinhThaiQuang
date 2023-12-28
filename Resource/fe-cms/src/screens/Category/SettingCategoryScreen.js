import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../core/utils/yupValidate';
import { useStore } from '../../core/utils/hook';
import { CATEGORY_IMAGE_SIZE, MSG, SCREEN_MODE } from '../../core/configs/constants';
import { useEffect } from 'react';
import { ReactNotifications } from '../../components';
import { useTranslation } from 'react-i18next';
import { loadFilePreview, loadURLPreview } from '../../core/utils/browser';

const SettingCategoryScreen = observer((props) => {

    // translation
    const { t, i18n: { language } } = useTranslation();
 
    // props
    const { mode, id } = props;

    // store
    const {
        categoryStore: { createCategory, getAllCategory, clean, getCategory, category, setAttrObservable, updateCategory },
        modalStore: { hide },
        apiStore: { uploadToCloudinary }
    } = useStore();

    // state
    const validateSettingCategorySchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required'][language]),
        description: yup.string(),
        // image: yup.mixed().transform((v) => {
        //     if(v instanceof FileList) {
        //         return v.length < 1 ? undefined : v[0];
        //     } else {
        //         return v;
        //     }
        // }).required(MSG['error.required'][language]),
        // ratio: yup.lazy((value) => {
        //     if(value === null || value === undefined) {
        //         return yup.number().nullable(true)
        //     } 
        //     return yup.number().checkEqualValue(CATEGORY_IMAGE_SIZE, 'Please choose a photo with an aspect ratio of 16:10')
        // })
    })

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        reset,
        watch,
        setValue
    } = useForm({ resolver: yupResolver(validateSettingCategorySchema), mode: 'onChange', defaultValues: category });

    // const watchImage = watch('image');

    // lifecycle
    // useEffect(() => {
    //     if(watchImage instanceof FileList) {
    //         if(watchImage.length > 0) {
    //             loadFilePreview(watchImage[0], 'preview-image', null,
    //                 (({ width, height }) => setValue('ratio', (width/height).toFixed(1), { shouldValidate: true })));
    //         } else {
    //             loadURLPreview('/images/image-default.png', 'preview-image');
    //         }
    //     } else if(typeof watchImage === 'string' || watchImage instanceof String) {
    //         loadURLPreview(watchImage || '/images/image-default.png', 'preview-image');
    //     } else {
    //         loadURLPreview('/images/image-default.png', 'preview-image');
    //     }
    // }, [watchImage])

    // lifecycle
    useEffect(() => {
        return () => {
            setAttrObservable('category', null);
        }
    }, [])

    useEffect(() => {
        const getData = async () => {
            await getCategory(id);
        }

        if(mode === SCREEN_MODE.EDIT) {
            getData();
        }
    }, [mode])

    useEffect(() => {
        reset(category);
    }, [category])

    // function
    // const onRemoveImage = () => {
    //     setValue('image', undefined, { shouldValidate: true });
    //     setValue('ratio', null, { shouldValidate: true });
    // }

    const onSubmitSettingCategory = async (data) => {
        const { name, description } = data;
        let res;
        if (mode === SCREEN_MODE.ADD) {
            res = await createCategory({ name, description });
        } else if (mode === SCREEN_MODE.EDIT) {
            res = await updateCategory(id, { name, description });
        }

        if(res) {
            ReactNotifications('success', mode === 0 ? MSG['inform.success.create'][language] : MSG['inform.success.update'][language]);
            if(mode === SCREEN_MODE.ADD) clean();
            getAllCategory();
            hide();
        }
    }

    return(
        <div className='setting-category-screen pd-30 max-height-modal'>
            <form onSubmit={handleSubmit(onSubmitSettingCategory)}>
                <div className='row'>
                    <label className='field-required col-3-5'>{t('settingCategoryScreen.categoryName')}</label>
                    <div className='col-8 pd-0'>
                        <input {...register('name')} className='w-100'/>
                        {
                            errors.name &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.name?.message}</div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='col-3-5'>{t('settingCategoryScreen.description')}</label>
                    <div className='col-8 pd-0'>
                        <textarea {...register('description')} className='w-100 height-100'/>
                        {
                            errors.description &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.description?.message}</div>
                        }
                    </div>
                </div>
                {/* <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingCategoryScreen.image')}</label>
                    <div className='d-flex align-items-center flex-column flex-gap-1 pd-lr-0 width-255'>
                        <div className='position-relative'>
                            <img id='preview-image' className='w-100'/>
                            {
                                (( watchImage instanceof FileList && watchImage.length > 0 ) 
                                        || ((typeof watchImage === 'string' || watchImage instanceof String ) && watchImage !== '')) &&
                                        <i onClick={onRemoveImage} role='button' 
                                            className='fa fa-light fa-circle-xmark text-danger position-absolute top-0 end-0 font-size-20'/>
                            }
                        </div>
                        <input id='image' type={'file'} {...register('image')} accept='image/png, image/jpeg' className='w-100' hidden/>
                        <label htmlFor='image' className='mg-t-5 text-center'>
                            <i className='fa fa-light fa-upload mg-r-5'></i> {t('common.selectImage')}
                        </label>
                        {
                            errors.image &&
                                <div className='text-danger fs-error mg-t-5 pd-0 align-self-start'>{errors.image?.message}</div>
                        }
                        {
                            errors.ratio &&
                                <div className='text-danger fs-error mg-t-5 pd-0 align-self-start'>{errors.ratio?.message}</div>
                        }
                    </div>
                </div> */}
                <div className='d-flex justify-content-center align-items-center mg-t-40'>
                    <button type='button' className='btn btn-default-1 width-150' onClick={hide}>{t('common.cancel')}</button>
                    <button type='submit' className='btn btn-default-2 width-150 mg-l-50' disabled={isSubmitting}>
                        {SCREEN_MODE.ADD === mode ? t('common.create') : t('common.update')}
                    </button>
                </div>
            </form>
        </div>
    )
})

export default SettingCategoryScreen;