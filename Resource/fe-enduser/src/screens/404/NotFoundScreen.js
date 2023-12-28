const NotFoundScreen = () => {

    return (
        // We could not find the page you were looking for. Meanwhile, you may return to home.
        <div className='not-found-screen pd-30'>
            {/* This page does not exist.<a className='hover-underline' href='/'> Back to home page!</a> */}
            Trang này không tồn tại.<a className='hover-underline' href='/'> Quay lại trang chủ!</a>
        </div>
    )
}

export default NotFoundScreen;