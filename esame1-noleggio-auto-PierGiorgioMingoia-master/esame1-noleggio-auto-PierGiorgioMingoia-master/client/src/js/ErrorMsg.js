import React from 'react';

/*Display Error*/
function OptionalErrorMsg(props) {
    if (props.errorMsg)
        return <div className='alert alert-danger alert-dismissible show' role='alert'>
            <strong>Error:</strong> <span>{props.errorMsg}</span>
            <button type='button' className='close' aria-label='Close'
                onClick={props.cancelErrorMsg}> 
                <span aria-hidden='true'>&times;</span>
            </button>
        </div>;
    else
        return null;
}

/*Display Succesful payment*/
function SuccesfulPayment(props) {
    if (props.successMsg)
        return <div className='alert alert-success alert-dismissible show' role='alert'>
            <strong>Success:</strong> <span>{props.successMsg}</span>
            <button type='button' className='close' aria-label='Close'
                onClick={props.cancelSuccessMsg}> 
                <span aria-hidden='true'>&times;</span>
            </button>
        </div>;
    else
        return null;
}
export { OptionalErrorMsg, SuccesfulPayment }