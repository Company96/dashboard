export const sendEmail = async (email: string, firstName: string, verifier: string) => {
    return fetch('/api/welcome', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, firstName, verifier })
    });
}

export const resendAccountVerification = async (email: string, firstName: string, verifier: string) => {
    return fetch('/api/resend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, firstName, verifier })
    });
}

export const sendOTPtoMail = async (email: string) => {
    return fetch('/api/otp?action=send', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });
}

export const verifyOTP = async (fullOTP: string, email: string) => {
    return fetch('/api/otp?action=verify', {  
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp: fullOTP }) 
    });
}

export const invoice = async (firstname: string, email: string, plan: string, amount: number, bonus: number, sum: number, date: string) => {
    return fetch('/api/invoice', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname, email, plan, amount, bonus, sum, date })
    });
}

export const wallet = async (firstname: string, email: string, amount: number, wallet: string,  fee: string, transactionID: string, date: string) => {
    return fetch('/api/wallet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstname, email, amount, wallet, fee, transactionID, date })
    });
}