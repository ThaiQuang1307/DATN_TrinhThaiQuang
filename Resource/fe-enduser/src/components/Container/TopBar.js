const TopBar = (props) => {

    return (
        <div className='container-fluid d-none d-lg-block'>
            <div className='row align-items-center py-4 px-xl-5'>
                <div className='col-lg-3'>
                    <a href className='text-decoration-none'>
                        <h1 className='m-0'><span className='text-primary'>QM</span>courses</h1>
                    </a>
                </div>
                <div className='col-lg-3 text-right'>
                    <div className='d-inline-flex align-items-center'>
                        <i className='fa fa-2x fa-map-marker-alt text-primary mr-3' />
                        <div className='text-left'>
                            {/* <h6 className='font-weight-semi-bold mb-1'>Our Office</h6> */}
                            <h6 className='font-weight-semi-bold mb-1'>Địa chỉ</h6>
                            <small>298 Cầu Diễn, Bắc Từ Liêm, Hà Nội</small>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 text-right'>
                    <div className='d-inline-flex align-items-center'>
                        <i className='fa fa-2x fa-envelope text-primary mr-3' />
                        <div className='text-left'>
                            <h6 className='font-weight-semi-bold mb-1'>Email</h6>
                            <small>elearing.system@gmail.com</small>
                        </div>
                    </div>
                </div>
                <div className='col-lg-3 text-right'>
                    <div className='d-inline-flex align-items-center'>
                        <i className='fa fa-2x fa-phone text-primary mr-3' />
                        <div className='text-left'>
                            <h6 className='font-weight-semi-bold mb-1'>Điện thoại</h6>
                            <small>+0343 136 604</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBar;