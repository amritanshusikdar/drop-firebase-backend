const isEmpty = (string: string) => (string.trim() === '' ? true : false);
const isEmail = (email: string) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(emailRegEx) ? true : false;
};

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    handle: string;
    contactNumber: string;
}

export const validateRegisterData = (data: RegisterData) => {
    const errors = <RegisterData>{};

    if (isEmpty(data.name)) errors.name = 'Name must be provided';
    if (isEmpty(data.email)) errors.email = 'Email must not be empty';
    else if (!isEmail(data.email)) {
        errors.email = 'Must be a valid email address';
    }

    if (isEmpty(data.password)) errors.password = 'Must not be empty';
    if (data.password != data.confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }
    if (isEmpty(data.handle)) errors.handle = 'Must not be empty';
    if (isEmpty(data.contactNumber)) {
        errors.contactNumber = 'Contact number must be provided';
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};

export const validateLoginData = (data: LoginData) => {
    const errors = <LoginData>{};
    if (isEmpty(data.email)) errors.email = 'Must not be empty';
    if (isEmpty(data.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false,
    };
};
