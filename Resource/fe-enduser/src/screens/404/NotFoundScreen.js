const NotFoundScreen = () => {

    return(
        // We could not find the page you were looking for. Meanwhile, you may return to home.
        <div className='not-found-screen pd-30'>
            This page does not exist.<a className='hover-underline' href='/'> Back to home page!</a>
        </div>
    )
}

export default NotFoundScreen;