import { observer } from 'mobx-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '../../core/utils/yupValidate';
import { useStore } from '../../core/utils/hook';
import { MSG, SCREEN_MODE, ROLE, GENDER } from '../../core/configs/constants';
import { useEffect } from 'react';
import { CalendarCustom, ReactNotifications } from '../../components';
import moment from 'moment';
import { countries } from 'countries-list';
import { useTranslation } from 'react-i18next';

const SettingStudentScreen = observer((props) => {

    // translation
    const { t, i18n: { language } } = useTranslation();

    // props
    const { mode, id } = props;

    // store
    const {
        userStore: { createUser, getAllUser, clean, getUser, user, setAttrObservable, updateUser },
        modalStore: { hide }
    } = useStore();

    // state
    const validateSchema = yup.object().shape({
        name: yup.string().trim().required(MSG['error.required'][language]),
        gender: yup.lazy((value) => {
            if(value === '') {
                return yup.string().required(MSG['error.required'][language]);
            }
            return yup.number()
        }),
        birthday: yup.lazy((value) => {
            if(value === null) {
                return yup.mixed().required(MSG['error.required'][language]);
            }
            return yup.string().required(MSG['error.required'][language])
        }),
        email: yup.string().email(MSG['error.email_format'][language]).required(MSG['error.required'][language]),
        phoneNumber: yup.string().trim().nullable(true).required(MSG['error.required'][language]),
        country: yup.string().required(MSG['error.required'][language]),
        address: yup.string().trim().required(MSG['error.required'][language]),
        roleId: yup.number().required(MSG['error.required'][language])
    })
    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting }, 
        reset,
        getValues,
        setValue,
        trigger
    } = useForm({ resolver: yupResolver(validateSchema), mode: 'onChange' });

    // lifecycle
    useEffect(() => {
        const getData = async () => {
            if(mode === SCREEN_MODE.EDIT) {
                getUser(id);
            }
        }
        getData();

        return () => {
            setAttrObservable('user', {});
        }
    }, [mode])

    useEffect(() => {
        const { name, email, gender, birthday, phoneNumber, country, address } = user;
        reset((user && mode === SCREEN_MODE.EDIT && id) ? 
            { name, email, gender, birthday, phoneNumber, country, address, roleId: ROLE.ROLE_USER } 
            : 
            { roleId: ROLE.ROLE_USER });
    }, [user])

    // function
    const onSubmitSettingUser = async (data) => {
        let res;
        if(mode === SCREEN_MODE.ADD) {
            res = await createUser(data);
        } else if (mode === SCREEN_MODE.EDIT) {
            const { name, email, gender, birthday, phoneNumber, country, address } = data;
            res = await updateUser(id, { name, email, gender, birthday, phoneNumber, country, address });
        }

        if(res) {
            ReactNotifications('success', mode === 0 ? MSG['inform.success.create'][language] : MSG['inform.success.update'][language]);
            if(mode === SCREEN_MODE.ADD) clean();
            getAllUser({ roleId: ROLE.ROLE_USER  });
            hide();
        }
    }

    return(
        <div className='setting-user-screen pd-30 max-height-modal'>
            <form onSubmit={handleSubmit(onSubmitSettingUser)}>
                <div className='row'>
                    <label className='field-required col-3-5'>{t('settingStudentScreen.fullName')}</label>
                    <div className='col-8 pd-0'>
                        <input {...register('name')} className='w-100'/>
                        {
                            errors.name &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.name?.message}</div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingStudentScreen.gender')}</label>
                    <div className='col-8 pd-0'>
                        <select {...register('gender')} className='w-100'>
                            <option value={''}>{t('settingStudentScreen.selectGender')}</option>
                            {
                                Object.keys(GENDER).map(e => <option key={e} value={e} >{GENDER[e][language]}</option>)
                            }
                        </select>
                        {
                            errors.gender &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.gender?.message}</div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingStudentScreen.birthday')}</label>
                    <div className='col-8 pd-0'>
                        <CalendarCustom
                            date={getValues('birthday') || null}
                            displayMode={'date'}
                            maxDate={new Date()}
                            onChange={date => {
                                setValue('birthday', date ? moment(date).format('YYYY/MM/DD') : null);
                                trigger('birthday');
                            }}
                        />
                        {
                            errors.birthday &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.birthday?.message}</div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingStudentScreen.email')}</label>
                    <div className='col-8 pd-0'>
                        <input {...register('email')} className='w-100'/>
                        {
                            errors.email &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.email?.message}</div>
                        }
                        {
                            user?.newEmail &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>
                                <i className='fa-solid fa-circle-info mg-r-5'/>
                                {
                                    language === 'en' ? 
                                        <span>There is a request to change the email to "{user.newEmail}". 
                                            Please check your email inbox for confirmation.
                                        </span>
                                        :
                                        <span>Có yêu cầu thay đổi email thành "{user.newEmail}". 
                                            Vui lòng kiểm tra hộp thư đến email của bạn để xác nhận.
                                        </span>
                                }
                            </div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingStudentScreen.phoneNumber')}</label>
                    <div className='col-8 pd-0'>
                        <input {...register('phoneNumber')} className='w-100'/>
                        {
                            errors.phoneNumber &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.phoneNumber?.message}</div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingStudentScreen.country')}</label>
                    <div className='col-8 pd-0'>
                        <select {...register('country')} className='w-100'>
                            <option value={''}>{t('settingStudentScreen.selectCountry')}</option>
                            {
                                Object.keys(countries).map(key => <option key={key} value={key}>{countries[key].name}</option>)
                            }
                        </select>
                        {
                            errors.country &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.country?.message}</div>
                        }
                    </div>
                </div>
                <div className='row mg-t-15'>
                    <label className='field-required col-3-5'>{t('settingStudentScreen.address')}</label>
                    <div className='col-8 pd-0'>
                        <input {...register('address')} className='w-100'/>
                        {
                            errors.address &&
                            <div className='text-danger fs-error mg-t-5 pd-0'>{errors.address?.message}</div>
                        }
                    </div>
                </div>
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

export default SettingStudentScreen;