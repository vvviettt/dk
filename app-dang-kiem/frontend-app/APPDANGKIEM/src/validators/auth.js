import * as Yup from 'yup'
import { email, password,old_password, phone_number, re_password ,validNumber,name} from './common'

export const LoginSchema = Yup.object().shape({
    phone_number,
    password
})

export const SignUpSchema = Yup.object().shape({
    name,
    phone_number,
    password,
    re_password,
    email
})

export const ConfirmEmailSchema = (length, name) => {
    const schema = Yup.object().shape({
        [name]: Yup.array().of(Yup.string().required().length(1)).length(length)
    })
    return schema
}

export const ForgotPassword = Yup.object().shape({
    phone_number
})

export const confirmOTP= Yup.object().shape({
    validNumber
})

export const ResetPassword = Yup.object().shape({
    password,
    re_password
})

export const ChangePassword = Yup.object().shape({
    password,
    re_password,
    old_password
})

export const confirmChangeInfor= Yup.object().shape({
    email,
    name
})