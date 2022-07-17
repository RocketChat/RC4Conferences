import { gql, useLazyQuery } from "@apollo/client";
import client from "../../../apollo-client";

export const FIND_USER_BY_MAIL = gql`
  query findUser($email: String!) {
    findUserByEmail(email: $email) {
      _id
      uid
      displayName
      email
      photoURL
      phoneNumber
      rc4conf {
        data {
          role
        }
      }
    }
  }
`;

export const verifyAdmin = () => {
    const [getCurrentUser, { data, error, loading }] = useLazyQuery(FIND_USER_BY_MAIL);
    

    const callVerify = (prop) => {
        getCurrentUser({
            variables: {
              email: prop.email,
            },
          });
    }
    
    return [ callVerify, { data, error, loading} ]
}

export const ssrVerifyAdmin = async (prop) => {
    const {data} = await client.query({
        query: FIND_USER_BY_MAIL,
        variables: {email: prop.email}
    })

    if (data && data.findUserByEmail?.rc4conf?.data[0].role==="Admin") {
        return true
    }
    else {
        return false
    }
}