import "../styles/Layout.module.css";
import Footer from "./footer";
import { useRouter } from "next/router";
import { VerifyUserRole } from "./conferences/EventAdmin";

function Layout(props) {
  const { pathname } = useRouter();
  return (
    <>
      <VerifyUserRole menuprops={props} />
      {props.children}
      <Footer></Footer>
    </>
  );
}

export default Layout;
