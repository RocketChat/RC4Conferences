import Cookies from 'js-cookie';
import { unsignCook } from './unsignCook';

export const isSignedIn = async () => {
  try {
    const hashmail = Cookies.get('hashmail');

    const res = await unsignCook({ hash: hashmail });
    const mail = res.mail;

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    return emailRegex.test(mail);
  } catch (e) {
    console.error('An error while verifying admin access', e);
    return false;
  }
};
