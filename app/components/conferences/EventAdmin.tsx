import { useEffect, useState } from 'react';
import NewMenubar from '../menubar/newMenuBar';
import _ from 'lodash';
import Cookies from 'js-cookie';
import { useVerifyAdmin } from './auth/AuthSuperProfileHelper';
import { unsignCook } from '../../lib/conferences/eventCall';

export const VerifyUserRole = ({ menuprops }: { menuprops: any }) => {
  const hookResult = useVerifyAdmin();
  const [getCurrentUser, apolloResult] = Array.isArray(hookResult) ? hookResult : [hookResult, {}];
  const { data, error, loading } = (apolloResult as any) || {};
  const [verified, setVerified] = useState(false);
  const hashmail = Cookies.get('hashmail');

  useEffect(() => {
    const decipherEmail = async () => {
      try {
        if (hashmail) {
          const res = await unsignCook({ hash: hashmail });
          if (typeof getCurrentUser === 'function') {
            getCurrentUser({ email: res.mail });
          }
        }
      } catch {
        console.error('Error while deciphering');
      }
    };
    decipherEmail();
  }, [getCurrentUser, hashmail]);

  let menuCache = null;

  if (!menuprops.menu?.topNavItems) {
    return <NewMenubar menu={menuprops.menu.topNavItems} />;
  }

  // const abortAdmin = () => {
  //   menuCache = _.cloneDeep(menuprops);

  //   menuCache.menu.topNavItems.data.body =
  //     menuCache.menu.topNavItems.data.body.filter(
  //       (element) => element.label !== 'Admin'
  //     );
  // };

  if (data) {
    const isAdmin = data.findUserByEmail?.rc4conf?.data[0]?.role;
    if (isAdmin === 'Admin') {
      !verified && setVerified(true);
    }
  }

  if (error) {
    console.error(
      'An error ocurred while getting user details on Superprofile',
      error
    );
  }

  return (
    <>
      {/* {abortAdmin()} */}
      {verified ? (
        // <Menubar menu={menuprops.menu.topNavItems} />
        <NewMenubar menu={menuprops.menu.topNavItems} />
      ) : (
        // <Menubar menu={menuCache.menu.topNavItems} />
        <NewMenubar menu={menuCache.menu.topNavItems} />
      )}
    </>
  );
};
